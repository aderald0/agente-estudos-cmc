'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ApostilaChapter,
  getApostilaById,
  getDrivePreviewUrl,
  getDriveViewUrl,
} from '../lib/apostilasCatalog';
import {
  formatBytes,
  getApostilaPdf,
  getLastReadPage,
  saveApostilaPdf,
  saveLastReadPage,
  StoredApostilaMeta,
} from '../lib/pdfStorage';
import { ReaderTarget, Topic } from '../lib/types';
import { Icons } from './Icons';

interface ApostilaReaderProps {
  target: ReaderTarget;
  topics: Topic[];
  storedMap: Record<string, StoredApostilaMeta>;
  onClose: () => void;
  onPdfStored: (meta: StoredApostilaMeta) => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
  onSwitchTarget: (next: ReaderTarget) => void;
}

type ReadingTone = 'paper' | 'sepia' | 'night';

interface PdfDocProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (opts: { scale: number }) => { width: number; height: number };
    render: (opts: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
      canvas?: HTMLCanvasElement;
    }) => { promise: Promise<void>; cancel?: () => void };
  }>;
  destroy?: () => Promise<void>;
}

export function ApostilaReader({
  target,
  topics,
  storedMap,
  onClose,
  onPdfStored,
  onTopicAction,
  onSwitchTarget,
}: ApostilaReaderProps) {
  const apostila = useMemo(() => getApostilaById(target.apostilaId), [target.apostilaId]);
  const storedMeta = storedMap[target.apostilaId];

  const [showToc, setShowToc] = useState(true);
  const [showStudyPanel, setShowStudyPanel] = useState(true);
  const [tone, setTone] = useState<ReadingTone>('paper');
  const [zoom, setZoom] = useState(1.15);
  const [fallbackMode, setFallbackMode] = useState<'drive' | 'upload'>('drive');

  // PDF.js state
  const [pdfDoc, setPdfDoc] = useState<PdfDocProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(apostila?.totalPages || 1);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (target.pdfPage && target.pdfPage >= 1) return target.pdfPage;
    const last = getLastReadPage(target.apostilaId);
    return last && last >= 1 ? last : 1;
  });
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [uploading, setUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const renderTaskRef = useRef<{ cancel?: () => void } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [drivePrivateHint, setDrivePrivateHint] = useState(false);

  // Study timer & notes state
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [savingAction, setSavingAction] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Sync currentPage when target changes
  useEffect(() => {
    const nextP = target.pdfPage && target.pdfPage >= 1
      ? target.pdfPage
      : getLastReadPage(target.apostilaId) || 1;
    setCurrentPage(nextP);
    setPageInput(String(nextP));
    setDrivePrivateHint(false);
  }, [target.apostilaId, target.pdfPage]);

  // Active chapter based on currentPage
  const activeChapter: ApostilaChapter | null = useMemo(() => {
    if (!apostila) return null;
    if (target.topicId && !pdfDoc) {
      const byTopic = apostila.chapters.find(c => c.topicId === target.topicId);
      if (byTopic) return byTopic;
    }
    const printed = Math.max(1, currentPage - apostila.pageOffset);
    return (
      apostila.chapters.find(
        c => printed >= c.printedPageStart && printed <= c.printedPageEnd
      ) ||
      apostila.chapters.find(c => c.topicId === target.topicId) ||
      apostila.chapters[0] ||
      null
    );
  }, [apostila, currentPage, pdfDoc, target.topicId]);

  const activeTopic: Topic | null = useMemo(() => {
    const tid = activeChapter?.topicId || target.topicId;
    if (!tid) return null;
    return topics.find(t => t.id === tid) || null;
  }, [activeChapter, target.topicId, topics]);

  const [notesDraft, setNotesDraft] = useState('');
  useEffect(() => {
    setNotesDraft(activeTopic?.notes || '');
  }, [activeTopic?.id, activeTopic?.notes]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => setTimerSec(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  // Load local PDF from IndexedDB, or auto-fetch via /api/apostila-pdf if Drive link is shared
  useEffect(() => {
    let cancelled = false;
    let loadedDoc: PdfDocProxy | null = null;

    async function loadPdf() {
      setPdfLoading(true);
      setPdfError('');
      try {
        let buffer: ArrayBuffer | null = null;

        if (storedMeta) {
          const rec = await getApostilaPdf(target.apostilaId);
          if (rec) buffer = rec.buffer;
        }

        if (!buffer && apostila) {
          const cargoParam = target.preferredCargo || 'analista';
          const res = await fetch(
            `/api/apostila-pdf?id=${encodeURIComponent(apostila.id)}&cargo=${cargoParam}`,
            { credentials: 'same-origin' }
          );
          if (res.ok && (res.headers.get('content-type') || '').includes('pdf')) {
            const downloaded = await res.arrayBuffer();
            if (!cancelled) {
              const fileObj = new File([downloaded], `${apostila.slug}.pdf`, {
                type: 'application/pdf',
              });
              const meta = await saveApostilaPdf(apostila.id, fileObj);
              onPdfStored(meta);
              buffer = downloaded;
            }
          } else if (res.status === 403) {
            if (!cancelled) setDrivePrivateHint(true);
          }
        }

        if (!buffer || cancelled) {
          if (!cancelled) {
            setPdfDoc(null);
            setPdfLoading(false);
          }
          return;
        }

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
        const doc = (await loadingTask.promise) as unknown as PdfDocProxy;
        if (cancelled) {
          doc.destroy?.();
          return;
        }
        loadedDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        const desiredPage = target.pdfPage && target.pdfPage >= 1
          ? target.pdfPage
          : getLastReadPage(target.apostilaId) || 1;
        const clamped = Math.min(Math.max(1, desiredPage), doc.numPages);
        setCurrentPage(clamped);
        setPageInput(String(clamped));
      } catch (err) {
        if (!cancelled) {
          setPdfError(err instanceof Error ? err.message : 'Não foi possível renderizar o PDF.');
          setPdfDoc(null);
        }
      } finally {
        if (!cancelled) setPdfLoading(false);
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
      loadedDoc?.destroy?.();
    };
  }, [target.apostilaId, target.preferredCargo, storedMeta, apostila]);

  // Render current page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        renderTaskRef.current?.cancel?.();
        const safePage = Math.min(Math.max(1, currentPage), pdfDoc.numPages);
        const page = await pdfDoc.getPage(safePage);
        if (cancelled || !canvasRef.current) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: zoom * dpr });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const task = page.render({ canvasContext: ctx, viewport, canvas });
        renderTaskRef.current = task;
        await task.promise;
        saveLastReadPage(target.apostilaId, safePage);
        stageRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      } catch {
        // Ignore cancellation errors during fast page flips
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
    };
  }, [pdfDoc, currentPage, zoom, target.apostilaId]);

  const goToPage = useCallback(
    (p: number) => {
      const maxP = pdfDoc ? pdfDoc.numPages : apostila?.totalPages || 999;
      const clamped = Math.min(Math.max(1, p), maxP);
      setCurrentPage(clamped);
      setPageInput(String(clamped));
    },
    [pdfDoc, apostila]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') onClose();
      if (pdfDoc && e.key === 'ArrowRight') goToPage(currentPage + 1);
      if (pdfDoc && e.key === 'ArrowLeft') goToPage(currentPage - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, pdfDoc, currentPage, goToPage]);

  const flashToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 2800);
  };

  const handleLocalFileUpload = async (file: File | null) => {
    if (!file || !apostila) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Selecione um arquivo PDF válido.');
      return;
    }
    setUploading(true);
    setPdfError('');
    try {
      const meta = await saveApostilaPdf(apostila.id, file);
      onPdfStored(meta);
      flashToast(`PDF vinculado offline (${formatBytes(meta.size)})`);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Erro ao salvar PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeTopic) return;
    setSavingAction(true);
    try {
      await onTopicAction({
        action: 'save_notes',
        id: activeTopic.id,
        notes: notesDraft,
      });
      flashToast('Anotações salvas no banco.');
    } finally {
      setSavingAction(false);
    }
  };

  const handleLogSession = async (markComplete: boolean) => {
    if (!activeTopic) return;
    const mins = Math.max(1, Math.round(timerSec / 60));
    setSavingAction(true);
    setTimerRunning(false);
    try {
      if (notesDraft !== (activeTopic.notes || '')) {
        await onTopicAction({
          action: 'save_notes',
          id: activeTopic.id,
          notes: notesDraft,
        });
      }
      await onTopicAction({
        action: markComplete ? 'complete_study' : 'log_timer',
        id: activeTopic.id,
        minutes: mins,
      });
      setTimerSec(0);
      flashToast(
        markComplete
          ? `Capítulo concluído (+${mins} min) e agendado para revisão!`
          : `Sessão de ${mins} min registrada.`
      );
    } finally {
      setSavingAction(false);
    }
  };

  if (!apostila) return null;

  const drivePreviewUrl = getDrivePreviewUrl(apostila, target.preferredCargo);
  const driveViewUrl = getDriveViewUrl(apostila, target.preferredCargo);
  const printedPage = Math.max(1, currentPage - apostila.pageOffset);
  const mm = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const ss = String(timerSec % 60).padStart(2, '0');

  return (
    <div className="reader-overlay" role="dialog" aria-modal="true" aria-label={`Leitor: ${apostila.title}`}>
      {/* Top Toolbar */}
      <header className="reader-topbar">
        <div className="reader-topbar-left">
          <button
            type="button"
            className="reader-icon-btn"
            onClick={onClose}
            aria-label="Fechar leitor"
            title="Fechar leitor (Esc)"
          >
            <Icons.Close size={18} />
          </button>
          <button
            type="button"
            className={`reader-icon-btn ${showToc ? 'active' : ''}`}
            onClick={() => setShowToc(v => !v)}
            aria-label="Alternar sumário"
            title="Mostrar/ocultar sumário"
          >
            <Icons.SidebarToggle size={17} />
          </button>
          <div className="reader-title-block">
            <div className="reader-title-row">
              <span className="reader-code-badge">
                {target.preferredCargo === 'tecnico'
                  ? apostila.codeTec || apostila.codeAnl
                  : apostila.codeAnl || apostila.codeTec}
              </span>
              <h2 className="reader-title">{apostila.title}</h2>
            </div>
            {activeChapter && (
              <p className="reader-subtitle">
                Cap. {activeChapter.chapterNumber} · {activeChapter.title} (p. {activeChapter.printedPageStart}–{activeChapter.printedPageEnd})
              </p>
            )}
          </div>
        </div>

        {/* PDF Controls (when local PDF loaded) */}
        {pdfDoc && (
          <div className="reader-controls">
            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Página anterior"
            >
              <Icons.ChevronLeft size={16} />
            </button>
            <form
              className="reader-page-form"
              onSubmit={e => {
                e.preventDefault();
                const parsed = parseInt(pageInput, 10);
                if (!Number.isNaN(parsed)) goToPage(parsed);
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                className="reader-page-input"
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                aria-label="Página do PDF"
              />
              <span className="reader-page-total">/ {numPages}</span>
            </form>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= numPages}
              aria-label="Próxima página"
            >
              <Icons.ChevronRight size={16} />
            </button>

            <span className="reader-divider" aria-hidden="true" />

            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => setZoom(z => Math.max(0.6, +(z - 0.15).toFixed(2)))}
              aria-label="Diminuir zoom"
            >
              <Icons.ZoomOut size={16} />
            </button>
            <span className="reader-zoom-label">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => setZoom(z => Math.min(2.2, +(z + 0.15).toFixed(2)))}
              aria-label="Aumentar zoom"
            >
              <Icons.ZoomIn size={16} />
            </button>

            <span className="reader-divider" aria-hidden="true" />

            <div className="reader-tone-group" role="group" aria-label="Modo de leitura">
              {(['paper', 'sepia', 'night'] as ReadingTone[]).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`reader-tone-btn ${tone === t ? 'active' : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t === 'paper' ? 'Papel' : t === 'sepia' ? 'Sépia' : 'Noite'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="reader-topbar-right">
          {driveViewUrl && (
            <a
              href={driveViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost reader-drive-link"
            >
              <Icons.ExternalLink size={14} /> Drive
            </a>
          )}
          <button
            type="button"
            className={`btn-ghost ${showStudyPanel ? 'active-pill' : ''}`}
            onClick={() => setShowStudyPanel(v => !v)}
          >
            <Icons.Clock size={14} /> Estudo
          </button>
        </div>
      </header>

      {toastMsg && (
        <div className="reader-toast" role="status">
          <Icons.Check size={14} /> {toastMsg}
        </div>
      )}

      {/* Main 3-Pane Workspace */}
      <div className="reader-workspace">
        {/* Left Sidebar: Interactive Apostila Sumário */}
        {showToc && (
          <aside className="reader-toc" aria-label="Sumário da apostila">
            <div className="reader-toc-header">
              <span>SUMÁRIO DA APOSTILA</span>
              <span className="mono">{apostila.totalPages} págs</span>
            </div>
            <div className="reader-toc-list">
              {apostila.chapters.map(ch => {
                const topic = ch.topicId ? topics.find(t => t.id === ch.topicId) : null;
                const isActive = activeChapter?.chapterNumber === ch.chapterNumber;
                const isDone = topic?.status === 'revisar' || topic?.status === 'dominado';
                return (
                  <button
                    key={ch.chapterNumber}
                    type="button"
                    className={`reader-toc-item ${isActive ? 'active' : ''} ${ch.validationStatus === 'fora-edital' ? 'out-of-edital' : ''}`}
                    onClick={() => {
                      goToPage(ch.pdfPageStart);
                      if (!pdfDoc && ch.topicId) {
                        onSwitchTarget({
                          ...target,
                          pdfPage: ch.pdfPageStart,
                          topicId: ch.topicId,
                          chapterTitle: ch.title,
                        });
                      }
                    }}
                  >
                    <div className="reader-toc-item-top">
                      <span className="reader-toc-cap">Cap. {String(ch.chapterNumber).padStart(2, '0')}</span>
                      <span className="reader-toc-pages">p. {ch.printedPageStart}–{ch.printedPageEnd}</span>
                    </div>
                    <div className="reader-toc-item-title">{ch.title}</div>
                    <div className="reader-toc-item-meta">
                      <span>{ch.editalRef}</span>
                      {isDone && <span className="toc-pill done">Concluído</span>}
                      {ch.validationStatus === 'lacuna' && <span className="toc-pill warn">Lacuna</span>}
                      {ch.validationStatus === 'fora-edital' && <span className="toc-pill muted">Fora do edital</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {(apostila.questionsPrintedPage || apostila.answerKeyPrintedPage) && (
              <div className="reader-toc-footer">
                {apostila.questionsPrintedPage && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => goToPage(apostila.questionsPrintedPage! + apostila.pageOffset)}
                  >
                    Questões (p. {apostila.questionsPrintedPage})
                  </button>
                )}
                {apostila.answerKeyPrintedPage && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => goToPage(apostila.answerKeyPrintedPage! + apostila.pageOffset)}
                  >
                    Gabarito (p. {apostila.answerKeyPrintedPage})
                  </button>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Center: PDF Canvas OR Drive Preview + Local Linker */}
        <main ref={stageRef} className={`reader-stage tone-${tone}`}>
          {/* Validation alert banner if active chapter has a note */}
          {activeChapter?.validationNote && (
            <div className={`reader-validation-banner status-${activeChapter.validationStatus}`}>
              <Icons.AlertTriangle size={16} />
              <div className="reader-validation-text">
                <strong>Validação Edital × Apostila:</strong> {activeChapter.validationNote}
              </div>
              {activeChapter.fallbackApostilaId && (
                <button
                  type="button"
                  className="btn-primary-sm"
                  onClick={() =>
                    onSwitchTarget({
                      apostilaId: activeChapter.fallbackApostilaId!,
                      pdfPage: activeChapter.fallbackPdfPage || 2,
                      topicId: activeChapter.topicId,
                      preferredCargo: target.preferredCargo,
                    })
                  }
                >
                  Abrir na Apostila de Legislação
                </button>
              )}
            </div>
          )}

          {pdfLoading ? (
            <div className="reader-center-msg">
              <div className="spinner" />
              <p>Abrindo apostila direto na página {currentPage}...</p>
            </div>
          ) : pdfDoc ? (
            <div className="reader-canvas-wrap">
              <div className="reader-page-indicator">
                Página impressa <strong>{printedPage}</strong> · PDF {currentPage}/{numPages}
              </div>
              <canvas ref={canvasRef} className="reader-canvas" />
            </div>
          ) : (
            <div className="reader-fallback">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={e => handleLocalFileUpload(e.target.files?.[0] || null)}
              />
              <div className="reader-fallback-bar">
                <div className="reader-fallback-info">
                  <span className="pill-accent">
                    Ir para pág. {activeChapter ? activeChapter.printedPageStart : printedPage} (PDF {currentPage})
                  </span>
                  <span className="reader-fallback-hint">
                    {drivePrivateHint
                      ? 'O iframe do Google Drive sempre abre na pág. 1. Para abrir direto na pág. exata: compartilhe a pasta no Drive como "Qualquer pessoa com o link (Leitor)" OU vincule o PDF local abaixo (1 única vez).'
                      : 'Para salto automático para a página exata do capítulo, vincule o PDF local (salvo offline no navegador).'}
                  </span>
                </div>
                <div className="reader-fallback-tabs">
                  {(apostila.driveFileIdAnl || apostila.driveFileIdTec) && (
                    <a
                      href={`https://drive.google.com/uc?export=download&id=${encodeURIComponent(
                        target.preferredCargo === 'tecnico'
                          ? apostila.driveFileIdTec || apostila.driveFileIdAnl || ''
                          : apostila.driveFileIdAnl || apostila.driveFileIdTec || ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ textDecoration: 'none' }}
                    >
                      1. Baixar PDF
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn-primary-sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icons.Upload size={14} /> {uploading ? 'Salvando...' : `2. Vincular e ir pág. ${activeChapter?.printedPageStart || printedPage}`}
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${fallbackMode === 'drive' ? 'active' : ''}`}
                    onClick={() => setFallbackMode(m => (m === 'drive' ? 'upload' : 'drive'))}
                  >
                    {fallbackMode === 'drive' ? 'Arrastar PDF' : 'Preview Drive'}
                  </button>
                </div>
              </div>

              {pdfError && <div className="reader-error-box">{pdfError}</div>}

              {fallbackMode === 'drive' && drivePreviewUrl ? (
                <iframe
                  src={drivePreviewUrl}
                  title={`Preview ${apostila.title}`}
                  className="reader-drive-iframe"
                  allow="autoplay"
                />
              ) : (
                <div
                  className="reader-dropzone"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0] || null;
                    handleLocalFileUpload(f);
                  }}
                >
                  <div className="reader-dropzone-icon">
                    <Icons.Library size={32} />
                  </div>
                  <h3>Ativar salto automático para a página {activeChapter?.printedPageStart || printedPage}</h3>
                  <p>
                    Arquivo esperado: <code>{apostila.driveFileNameAnl || apostila.driveFileNameTec}</code>
                  </p>
                  <p className="muted">
                    Solte o PDF aqui uma única vez: ele fica salvo offline no navegador (IndexedDB) e a partir daí sempre abre direto na página certa do capítulo.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icons.Upload size={15} /> {uploading ? 'Salvando no navegador...' : 'Selecionar PDF do computador'}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar: Study Timer, Status & Notes */}
        {showStudyPanel && (
          <aside className="reader-study-panel" aria-label="Painel de estudo ativo">
            <div className="reader-panel-section">
              <span className="reader-panel-label">CRONÔMETRO DA SESSÃO</span>
              <div className="reader-timer-display">{mm}:{ss}</div>
              <div className="reader-timer-actions">
                <button
                  type="button"
                  className="btn-primary-sm"
                  onClick={() => setTimerRunning(r => !r)}
                >
                  {timerRunning ? <><Icons.Pause size={13} /> Pausar</> : <><Icons.Play size={13} /> Iniciar</>}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSec(0);
                  }}
                >
                  Zerar
                </button>
              </div>
            </div>

            {activeTopic ? (
              <>
                <div className="reader-panel-section">
                  <span className="reader-panel-label">PROGRESSO NO TÓPICO</span>
                  <div className="reader-topic-card">
                    <div className="reader-topic-name">{activeTopic.title}</div>
                    <div className="reader-topic-stats">
                      <span>Status: <strong>{activeTopic.status}</strong></span>
                      <span>Estudado: <strong>{activeTopic.minutes_studied} min</strong></span>
                    </div>
                  </div>
                  <div className="reader-topic-btns">
                    <button
                      type="button"
                      className="btn-primary-sm"
                      disabled={savingAction}
                      onClick={() => handleLogSession(true)}
                    >
                      <Icons.Check size={14} /> Concluir capítulo
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      disabled={savingAction}
                      onClick={() => handleLogSession(false)}
                    >
                      Registrar tempo
                    </button>
                  </div>
                </div>

                <div className="reader-panel-section reader-notes-section">
                  <label htmlFor="reader-notes-input" className="reader-panel-label">
                    ANOTAÇÕES DO CAPÍTULO
                  </label>
                  <textarea
                    id="reader-notes-input"
                    className="reader-notes-textarea"
                    placeholder="Artigos importantes, pegadinhas da banca Selecon, fórmulas ou resumos deste capítulo..."
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={savingAction}
                    onClick={handleSaveNotes}
                  >
                    Salvar anotações
                  </button>
                </div>
              </>
            ) : (
              <div className="reader-panel-section">
                <p className="muted">Selecione um capítulo no sumário para registrar tempo e anotações.</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
