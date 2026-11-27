'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  APOSTILAS_CATALOG,
  ApostilaSpec,
  CargoKey,
  getApostilasForCargo,
  matchPdfFileToApostila,
} from '../lib/apostilasCatalog';
import {
  deleteApostilaPdf,
  formatBytes,
  getLastReadPage,
  saveApostilaPdf,
  StoredApostilaMeta,
} from '../lib/pdfStorage';
import { ReaderTarget, Topic } from '../lib/types';
import { Icons } from './Icons';

interface ApostilasLibraryViewProps {
  topics: Topic[];
  storedMap: Record<string, StoredApostilaMeta>;
  onOpenReader: (target: ReaderTarget) => void;
  onRefreshStored: () => Promise<void>;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
}

export function ApostilasLibraryView({
  topics,
  storedMap,
  onOpenReader,
  onRefreshStored,
  onTopicAction,
}: ApostilasLibraryViewProps) {
  const [scope, setScope] = useState<'analista' | 'tecnico' | 'all'>('analista');
  const [includeDigital, setIncludeDigital] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'ap-especificos-ti': true,
    'ap-legislacao': true,
    'ap-especificos-tecnico': true,
  });
  const [batchMessage, setBatchMessage] = useState('');
  const [batchBusy, setBatchBusy] = useState(false);

  const batchInputRef = useRef<HTMLInputElement | null>(null);
  const singleInputRef = useRef<HTMLInputElement | null>(null);
  const [singleTargetId, setSingleTargetId] = useState<string | null>(null);

  const topicMap = useMemo(() => {
    const m = new Map<string, Topic>();
    for (const t of topics) m.set(t.id, t);
    return m;
  }, [topics]);

  const apostilas = useMemo(() => {
    const list = getApostilasForCargo(scope, includeDigital);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list
      .map(ap => {
        const titleMatch =
          ap.title.toLowerCase().includes(q) ||
          ap.subject.toLowerCase().includes(q) ||
          (ap.codeAnl || '').toLowerCase().includes(q) ||
          (ap.codeTec || '').toLowerCase().includes(q);
        const matchingChapters = ap.chapters.filter(
          c =>
            c.title.toLowerCase().includes(q) ||
            c.editalRef.toLowerCase().includes(q)
        );
        if (!titleMatch && matchingChapters.length === 0) return null;
        return {
          ...ap,
          chapters: titleMatch ? ap.chapters : matchingChapters,
        };
      })
      .filter(Boolean) as ApostilaSpec[];
  }, [scope, includeDigital, search]);

  const storedSummary = useMemo(() => {
    const entries = Object.values(storedMap);
    const totalBytes = entries.reduce((acc, e) => acc + e.size, 0);
    return {
      count: entries.length,
      totalCatalog: APOSTILAS_CATALOG.filter(a => a.kind === 'apostila').length,
      totalBytes,
    };
  }, [storedMap]);

  const preferredCargo: CargoKey = scope === 'tecnico' ? 'tecnico' : 'analista';

  const handleBatchFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBatchBusy(true);
    let matched = 0;
    const unmatched: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.name.toLowerCase().endsWith('.pdf')) continue;
        const ap = matchPdfFileToApostila(file.name);
        if (ap) {
          await saveApostilaPdf(ap.id, file);
          matched++;
        } else {
          unmatched.push(file.name);
        }
      }
      await onRefreshStored();
      if (matched > 0 && unmatched.length === 0) {
        setBatchMessage(`${matched} apostila(s) vinculada(s) offline com sucesso.`);
      } else if (matched > 0) {
        setBatchMessage(
          `${matched} vinculada(s). Não reconhecidas automaticamente: ${unmatched.join(', ')}. Use "Vincular PDF" no card correspondente.`
        );
      } else {
        setBatchMessage(
          `Nenhum arquivo reconhecido pelo nome. Use o botão "Vincular PDF" dentro do card da apostila desejada.`
        );
      }
    } finally {
      setBatchBusy(false);
    }
  };

  const handleSingleFile = async (file: File | null) => {
    if (!file || !singleTargetId) return;
    setBatchBusy(true);
    try {
      await saveApostilaPdf(singleTargetId, file);
      await onRefreshStored();
      setBatchMessage(`PDF "${file.name}" vinculado com sucesso.`);
    } finally {
      setBatchBusy(false);
      setSingleTargetId(null);
    }
  };

  const handleRemoveStored = async (apostilaId: string) => {
    await deleteApostilaPdf(apostilaId);
    await onRefreshStored();
    setBatchMessage('PDF removido do armazenamento local do navegador.');
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="lib-view">
      {/* Hidden file inputs */}
      <input
        ref={batchInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={e => {
          handleBatchFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={singleInputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={e => {
          handleSingleFile(e.target.files?.[0] || null);
          e.target.value = '';
        }}
      />

      {/* Editorial Header & Batch Import Banner */}
      <section className="lib-hero">
        <div className="lib-hero-copy">
          <span className="eyebrow">BIBLIOTECA OFICIAL · EDITAL Nº 001/2026-CMC</span>
          <h1 className="editorial-h1">Sumário das Apostilas &amp; Leitura Direta</h1>
          <p className="lib-hero-sub">
            Todos os capítulos validados página a página contra o Anexo V do Edital. Clique em qualquer capítulo para abrir a apostila exatamente na página da matéria.
          </p>
        </div>

        <div
          className="lib-import-box"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            handleBatchFiles(e.dataTransfer.files);
          }}
        >
          <div className="lib-import-head">
            <div>
              <div className="lib-import-title">
                Biblioteca Offline no Navegador
              </div>
              <div className="lib-import-meta">
                {storedSummary.count}/{storedSummary.totalCatalog} apostilas vinculadas
                {storedSummary.totalBytes > 0 ? ` · ${formatBytes(storedSummary.totalBytes)}` : ' · Preview Google Drive ativo'}
              </div>
            </div>
            <button
              type="button"
              className="btn-primary-sm"
              disabled={batchBusy}
              onClick={() => batchInputRef.current?.click()}
            >
              <Icons.Upload size={14} /> {batchBusy ? 'Importando...' : 'Importar PDFs em lote'}
            </button>
          </div>
          <p className="lib-import-hint">
            Arraste vários PDFs das pastas <code>analista/</code> ou <code>tecnico/</code> de uma vez. O reconhecimento pelo nome é automático e abre direto na página do capítulo.
          </p>
        </div>
      </section>

      {batchMessage && (
        <div className="lib-status-banner" role="status">
          <span>{batchMessage}</span>
          <button type="button" onClick={() => setBatchMessage('')} aria-label="Fechar aviso">
            <Icons.Close size={14} />
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="lib-toolbar">
        <div className="seg-group" role="tablist" aria-label="Filtrar apostilas por cargo">
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'analista'}
            className={`seg-btn ${scope === 'analista' ? 'active' : ''}`}
            onClick={() => setScope('analista')}
          >
            Analista TI · Manhã (9)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'tecnico'}
            className={`seg-btn ${scope === 'tecnico' ? 'active' : ''}`}
            onClick={() => setScope('tecnico')}
          >
            Técnico Leg. · Tarde (8)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'all'}
            className={`seg-btn ${scope === 'all' ? 'active' : ''}`}
            onClick={() => setScope('all')}
          >
            Todas (11)
          </button>
        </div>

        <div className="lib-toolbar-right">
          <label className="lib-checkbox">
            <input
              type="checkbox"
              checked={includeDigital}
              onChange={e => setIncludeDigital(e.target.checked)}
            />
            <span>Incluir Material Digital (MD)</span>
          </label>
          <div className="search-field">
            <Icons.Search size={15} />
            <input
              type="search"
              placeholder="Buscar capítulo, lei ou matéria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar no sumário das apostilas"
            />
          </div>
        </div>
      </div>

      {/* Apostilas Shelf */}
      {apostilas.length === 0 ? (
        <div className="empty-state-box">
          <p>Nenhum capítulo encontrado para &ldquo;{search}&rdquo;.</p>
          <button type="button" className="btn-ghost" onClick={() => setSearch('')}>
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="lib-list">
          {apostilas.map(ap => {
            const isOpen = search.trim().length > 0 || Boolean(expanded[ap.id]);
            const stored = storedMap[ap.id];
            const lastRead = getLastReadPage(ap.id);

            const validChapters = ap.chapters.filter(c => c.validationStatus !== 'fora-edital');
            const doneCount = validChapters.filter(c => {
              const t = c.topicId ? topicMap.get(c.topicId) : null;
              return t?.status === 'revisar' || t?.status === 'dominado';
            }).length;
            const pct = validChapters.length > 0 ? Math.round((doneCount / validChapters.length) * 100) : 0;

            const codeLabel =
              scope === 'tecnico'
                ? ap.codeTec || ap.codeAnl || 'Apostila'
                : ap.codeAnl || ap.codeTec || 'Apostila';
            const weightLabel =
              scope === 'tecnico'
                ? ap.weightTec || ap.weightAnl
                : ap.weightAnl || ap.weightTec;
            const isHighWeight =
              scope === 'tecnico' ? Boolean(ap.highWeightTec) : Boolean(ap.highWeightAnl);

            const firstPending =
              validChapters.find(c => {
                const t = c.topicId ? topicMap.get(c.topicId) : null;
                return t?.status !== 'revisar' && t?.status !== 'dominado';
              }) || ap.chapters[0];

            return (
              <article key={ap.id} className={`apostila-card ${isHighWeight ? 'high-weight' : ''}`}>
                <div className="apostila-card-head">
                  <div className="apostila-head-main">
                    <div className="apostila-badges">
                      <span className="ap-code-pill">{codeLabel}</span>
                      {weightLabel && (
                        <span className={`ap-weight-pill ${isHighWeight ? 'gold' : ''}`}>
                          {weightLabel}
                        </span>
                      )}
                      <span className={`ap-source-pill ${stored ? 'offline' : 'drive'}`}>
                        {stored ? `PDF Offline · ${formatBytes(stored.size)}` : 'Google Drive'}
                      </span>
                      <span className="ap-pages-pill mono">{ap.totalPages} págs</span>
                    </div>
                    <h2 className="apostila-title">{ap.title}</h2>
                    <p className="apostila-desc">{ap.editalSummary}</p>
                  </div>

                  <div className="apostila-head-actions">
                    <div className="apostila-progress-col">
                      <div className="apostila-progress-label">
                        <span>{doneCount}/{validChapters.length} capítulos</span>
                        <strong className="mono">{pct}%</strong>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="apostila-btn-row">
                      <button
                        type="button"
                        className="btn-primary-sm"
                        onClick={() =>
                          onOpenReader({
                            apostilaId: ap.id,
                            pdfPage: lastRead || firstPending?.pdfPageStart || 2,
                            topicId: firstPending?.topicId,
                            preferredCargo,
                          })
                        }
                      >
                        <Icons.BookOpen size={14} />{' '}
                        {lastRead ? `Continuar (p. ${Math.max(1, lastRead - ap.pageOffset)})` : 'Abrir Apostila'}
                      </button>

                      {stored ? (
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => handleRemoveStored(ap.id)}
                          title="Remover cópia local do navegador"
                        >
                          <Icons.Trash size={14} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => {
                            setSingleTargetId(ap.id);
                            singleInputRef.current?.click();
                          }}
                        >
                          <Icons.Upload size={14} /> Vincular PDF
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => toggleExpand(ap.id)}
                        aria-expanded={isOpen}
                      >
                        Sumário ({ap.chapters.length})
                        <Icons.ChevronDown size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Printed Sumário Table */}
                {isOpen && (
                  <div className="apostila-toc-panel">
                    <div className="toc-table-header">
                      <span>CAPÍTULO &amp; MATÉRIA</span>
                      <span>EDITAL</span>
                      <span>PÁGINAS</span>
                      <span>AÇÃO</span>
                    </div>

                    <div className="toc-rows">
                      {ap.chapters.map(ch => {
                        const topic = ch.topicId ? topicMap.get(ch.topicId) : null;
                        const isDone = topic?.status === 'revisar' || topic?.status === 'dominado';
                        const isQueued = Boolean(topic?.study_queue);
                        const pageSpan = ch.printedPageEnd - ch.printedPageStart + 1;

                        return (
                          <div
                            key={`${ap.id}-${ch.chapterNumber}`}
                            className={`toc-row ${isDone ? 'is-done' : ''} ${ch.validationStatus === 'fora-edital' ? 'is-excluded' : ''}`}
                          >
                            <div className="toc-col-title">
                              <div className="toc-title-line">
                                <span className="toc-cap-num mono">
                                  {String(ch.chapterNumber).padStart(2, '0')}
                                </span>
                                <span className="toc-cap-title">{ch.title}</span>
                              </div>
                              {ch.validationNote && (
                                <div className={`toc-note status-${ch.validationStatus}`}>
                                  <Icons.AlertTriangle size={13} />
                                  <span>{ch.validationNote}</span>
                                </div>
                              )}
                            </div>

                            <div className="toc-col-edital">
                              <span className={`val-badge status-${ch.validationStatus}`}>
                                {ch.editalRef}
                              </span>
                            </div>

                            <div className="toc-col-pages mono">
                              <strong>p. {ch.printedPageStart}–{ch.printedPageEnd}</strong>
                              <span className="muted">({pageSpan} {pageSpan === 1 ? 'pág' : 'págs'})</span>
                            </div>

                            <div className="toc-col-actions">
                              {topic && ch.validationStatus !== 'fora-edital' && (
                                <button
                                  type="button"
                                  className={`toc-queue-btn ${isDone ? 'done' : isQueued ? 'queued' : ''}`}
                                  onClick={() =>
                                    onTopicAction({
                                      action: isDone ? 'toggle_done' : 'toggle_study',
                                      id: topic.id,
                                    })
                                  }
                                  title={isDone ? 'Concluído (clique para reabrir)' : isQueued ? 'Na fila de hoje' : 'Adicionar à fila de hoje'}
                                >
                                  {isDone ? <Icons.Check size={13} /> : isQueued ? 'Hoje' : '+ Fila'}
                                </button>
                              )}

                              {ch.fallbackApostilaId ? (
                                <button
                                  type="button"
                                  className="btn-primary-sm"
                                  onClick={() =>
                                    onOpenReader({
                                      apostilaId: ch.fallbackApostilaId!,
                                      pdfPage: ch.fallbackPdfPage || 2,
                                      topicId: ch.topicId,
                                      preferredCargo,
                                    })
                                  }
                                >
                                  Ler em Legislação
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-read-page"
                                  onClick={() =>
                                    onOpenReader({
                                      apostilaId: ap.id,
                                      pdfPage: ch.pdfPageStart,
                                      topicId: ch.topicId,
                                      chapterTitle: ch.title,
                                      preferredCargo,
                                    })
                                  }
                                >
                                  <Icons.BookOpen size={13} /> Ler p. {ch.printedPageStart}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {(ap.questionsPrintedPage || ap.answerKeyPrintedPage) && (
                      <div className="toc-panel-footer">
                        <span className="muted">Atalhos rápidos desta apostila:</span>
                        <div className="toc-footer-btns">
                          {ap.questionsPrintedPage && (
                            <button
                              type="button"
                              className="btn-ghost"
                              onClick={() =>
                                onOpenReader({
                                  apostilaId: ap.id,
                                  pdfPage: ap.questionsPrintedPage! + ap.pageOffset,
                                  preferredCargo,
                                })
                              }
                            >
                              Abrir Questões (p. {ap.questionsPrintedPage})
                            </button>
                          )}
                          {ap.answerKeyPrintedPage && (
                            <button
                              type="button"
                              className="btn-ghost"
                              onClick={() =>
                                onOpenReader({
                                  apostilaId: ap.id,
                                  pdfPage: ap.answerKeyPrintedPage! + ap.pageOffset,
                                  preferredCargo,
                                })
                              }
                            >
                              Abrir Gabarito (p. {ap.answerKeyPrintedPage})
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
