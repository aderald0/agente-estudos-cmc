'use client';

import React, { useEffect, useRef, useState } from 'react';
import { extractDocumentClient, ParsedDocument } from '../lib/pdfClient';
import { Icons } from './Icons';

interface DraftPlanData {
  ready: boolean;
  reply: string;
  quick_options?: string[];
  plan?: {
    title: string;
    subtitle: string;
    category: string;
    syllabus_label: string;
    has_essay: boolean;
    target_date: string;
    daily_hours: string;
    hero_title: string;
    context_cards: Array<{ tag: string; title: string; sub: string; pill: string }>;
  };
  topics?: Array<{ subject: string; title: string; priority: 'alta' | 'media' | 'baixa' }>;
  questions?: Array<Record<string, unknown>>;
  flashcards?: Array<Record<string, unknown>>;
}

interface SetupMsg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  fileNames?: string[];
  quickOptions?: string[];
  draft?: DraftPlanData;
}

interface NewStudyViewProps {
  username: string | null;
  hasExistingPlans: boolean;
  onCancel: () => void;
  onPlanCreated: (newPlanId: string) => Promise<void>;
}

export function NewStudyView({
  username,
  hasExistingPlans,
  onCancel,
  onPlanCreated,
}: NewStudyViewProps) {
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Aderaldo';
  const [messages, setMessages] = useState<SetupMsg[]>([
    {
      id: 1,
      role: 'assistant',
      text: `Olá, ${displayName}. Para o que você vai estudar?\n\nAnexe o PDF do edital, a ementa da faculdade ou suas apostilas no clipe abaixo — vou ler o documento completo e fazer algumas perguntas rápidas (como o cargo e sua rotina) para montar seu plano sob medida.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [attachedDocs, setAttachedDocs] = useState<ParsedDocument[]>([]);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [latestDraft, setLatestDraft] = useState<DraftPlanData | null>(null);
  const [expandedDraftId, setExpandedDraftId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy, parsingPdf]);

  async function safeParseJson(res: Response): Promise<{ ok: boolean; data: Record<string, unknown> | null; errorMsg: string }> {
    const rawText = await res.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : null;
    } catch {
      parsed = null;
    }
    if (res.ok && parsed) {
      return { ok: true, data: parsed, errorMsg: '' };
    }
    if (res.status === 504 || res.status === 502) {
      return {
        ok: false,
        data: null,
        errorMsg: 'A leitura do documento grande excedeu o tempo limite do servidor. Clique em "Tentar novamente" — seus arquivos continuam anexados.',
      };
    }
    const serverErr = parsed && typeof parsed.error === 'string' ? parsed.error : '';
    return {
      ok: false,
      data: parsed,
      errorMsg: serverErr || `Erro ao processar requisição (HTTP ${res.status}). Tente novamente.`,
    };
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');
    setLastFailedText(null);
    setParsingPdf(true);

    try {
      const newlyParsed: ParsedDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const doc = await extractDocumentClient(files[i]);
        newlyParsed.push(doc);
      }

      const updatedDocs = [...attachedDocs, ...newlyParsed];
      setAttachedDocs(updatedDocs);

      // Automatically trigger Phase 1 (Interview & Cargo Discovery) right after reading the PDF
      await sendToAgent(
        input.trim() ||
          `Anexei ${newlyParsed.map(d => `${d.name}${d.pageCount ? ` (${d.pageCount} páginas)` : ''}`).join(', ')}. Analise o documento e me faça as perguntas necessárias para montar meu plano.`,
        updatedDocs,
        newlyParsed.map(d => d.name)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível ler o arquivo selecionado.');
    } finally {
      setParsingPdf(false);
    }
  }

  async function sendToAgent(
    overrideText?: string,
    overrideDocs?: ParsedDocument[],
    newFileNames?: string[],
    isRetry = false
  ) {
    const text = (overrideText ?? input).trim();
    const docsToSend = overrideDocs ?? attachedDocs;
    if ((!text && docsToSend.length === 0) || busy) return;

    if (!overrideText) setInput('');
    setError('');
    setLastFailedText(null);

    const nextHistory = isRetry
      ? messages
      : [
          ...messages,
          {
            id: Date.now(),
            role: 'user' as const,
            text,
            fileNames: newFileNames,
          },
        ];

    if (!isRetry) {
      setMessages(nextHistory);
    }
    setBusy(true);

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'analyze',
          messages: nextHistory.map(m => ({ role: m.role, text: m.text })),
          documents: docsToSend,
        }),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        setError(parsed.errorMsg);
        setLastFailedText(text);
        return;
      }

      const data = parsed.data.data as DraftPlanData;
      if (data?.ready && data?.plan) {
        setLatestDraft(data);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: data?.reply || 'Qual cargo ou objetivo você deseja priorizar?',
          quickOptions: Array.isArray(data?.quick_options) ? data.quick_options.slice(0, 10) : undefined,
          draft: data?.ready && data?.plan ? data : undefined,
        },
      ]);
      inputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de conexão.');
      setLastFailedText(text);
    } finally {
      setBusy(false);
    }
  }

  async function confirmAndLaunch(draftToSave?: DraftPlanData | null) {
    const target = draftToSave || latestDraft;
    if (!target || !target.plan || saving) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'create',
          draft: target,
        }),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        setError(parsed.errorMsg || 'Erro ao salvar plano no banco.');
        setSaving(false);
        return;
      }
      await onPlanCreated(String(parsed.data.planId || ''));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de rede.');
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: 740,
        margin: '0 auto',
        padding: '20px 18px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {/* Top Minimal Header */}
      <header className="flex-row" style={{ justifyContent: 'space-between', padding: '4px 0' }}>
        <div className="flex-row" style={{ gap: 10 }}>
          <span className="brand-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
            <Icons.Logo size={16} />
          </span>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Novo estudo</span>
        </div>

        {hasExistingPlans && (
          <button onClick={onCancel} className="ds-btn ds-btn-ghost ds-btn-sm">
            Voltar ao painel →
          </button>
        )}
      </header>

      {/* Center Conversation Stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 2px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, msgIdx) => {
          if (m.role === 'user') {
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="mentor-msg-user">
                  {m.fileNames && m.fileNames.length > 0 && (
                    <div className="flex-row" style={{ gap: 6, fontSize: 12, opacity: 0.9, marginBottom: 4 }}>
                      <Icons.Paperclip size={13} /> <strong>{m.fileNames.join(', ')}</strong>
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            );
          }

          const isLatestMsg = msgIdx === messages.length - 1;
          const subjectMap = new Map<string, Array<{ title: string; priority: string }>>();
          if (Array.isArray(m.draft?.topics)) {
            m.draft.topics.forEach(t => {
              const s = t.subject || 'Geral';
              if (!subjectMap.has(s)) subjectMap.set(s, []);
              subjectMap.get(s)!.push({ title: t.title, priority: t.priority });
            });
          }
          const subjectEntries = Array.from(subjectMap.entries());
          const isExpanded = expandedDraftId === m.id;

          const formattedParts = m.text.split(/(\*\*[^*]+\*\*)/g);

          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="mentor-msg-assistant" style={{ maxWidth: '94%', padding: '16px 20px' }}>
                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: 14 }}>
                  {formattedParts.map((part, pIdx) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={pIdx}>{part.slice(2, -2)}</strong>
                    ) : (
                      <React.Fragment key={pIdx}>{part}</React.Fragment>
                    )
                  )}
                </div>

                {/* Clickable Interview Options (e.g., exact Cargos extracted from the Edital PDF) */}
                {isLatestMsg && !busy && m.quickOptions && m.quickOptions.length > 0 && !m.draft?.plan && (
                  <div className="flex-row" style={{ marginTop: 12, gap: 6 }}>
                    {m.quickOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendToAgent(opt)}
                        className="quick-chip"
                        style={{ color: 'var(--c-text)', borderColor: 'var(--c-border-strong)' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Complete Study Blueprint Preview */}
                {m.draft?.plan && (
                  <div
                    className="space-y-sm"
                    style={{
                      marginTop: 14,
                      padding: 16,
                      borderRadius: 18,
                      background: 'var(--c-bg)',
                      border: '1px solid var(--c-border)',
                    }}
                  >
                    <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{m.draft.plan.title}</div>
                        <div className="text-xs muted">{m.draft.plan.subtitle}</div>
                      </div>
                      <span className="ds-badge ds-badge-green">
                        {subjectEntries.length} disciplinas · {m.draft.topics?.length || 0} tópicos
                      </span>
                    </div>

                    {subjectEntries.length > 0 && (
                      <div style={{ paddingTop: 6 }}>
                        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                          <strong className="text-xs">
                            Disciplinas extraídas ({subjectEntries.length}):
                          </strong>
                          <button
                            type="button"
                            onClick={() => setExpandedDraftId(isExpanded ? null : m.id)}
                            className="text-xs"
                            style={{ fontWeight: 600, color: 'var(--c-accent)' }}
                          >
                            {isExpanded ? 'Recolher tópicos ▲' : `Ver todos os ${m.draft.topics?.length} tópicos ▼`}
                          </button>
                        </div>

                        <div className="flex-row" style={{ gap: 6 }}>
                          {subjectEntries.map(([subName, subTopics]) => (
                            <span key={subName} className="ds-badge ds-badge-indigo" style={{ padding: '4px 10px' }}>
                              {subName} ({subTopics.length})
                            </span>
                          ))}
                        </div>

                        {isExpanded && (
                          <div
                            className="space-y-sm"
                            style={{
                              marginTop: 10,
                              maxHeight: 280,
                              overflowY: 'auto',
                              padding: 12,
                              borderRadius: 12,
                              background: 'var(--c-surface)',
                              border: '1px solid var(--c-border)',
                            }}
                          >
                            {subjectEntries.map(([subName, subTopics]) => (
                              <div key={subName} style={{ marginBottom: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--c-text)' }}>
                                  {subName} ({subTopics.length} tópicos)
                                </div>
                                <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 11.5 }} className="muted">
                                  {subTopics.map((st, i) => (
                                    <li key={i}>{st.title}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs muted" style={{ paddingTop: 4 }}>
                      Faltou alguma disciplina ou quer ajustar o cargo/horário? Peça abaixo antes de confirmar.
                    </div>

                    <div
                      className="flex-row"
                      style={{
                        marginTop: 10,
                        paddingTop: 12,
                        borderTop: '1px solid var(--c-border)',
                        gap: 8,
                      }}
                    >
                      <button
                        disabled={saving}
                        onClick={() => confirmAndLaunch(m.draft)}
                        className="ds-btn ds-btn-primary"
                      >
                        {saving ? 'Abrindo seu painel...' : 'Confirmar e abrir meu painel →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {parsingPdf && (
          <div className="mentor-msg-assistant muted text-sm" style={{ padding: '14px 18px' }}>
            Extraindo o texto completo de todas as páginas do PDF...
          </div>
        )}

        {busy && (
          <div className="mentor-msg-assistant muted text-sm" style={{ padding: '14px 18px' }}>
            Analisando o conteúdo do documento...
          </div>
        )}

        {error && (
          <div className="inline-alert error flex-row" style={{ justifyContent: 'space-between', gap: 10 }}>
            <span>{error}</span>
            {lastFailedText && !busy && (
              <button
                type="button"
                onClick={() => sendToAgent(lastFailedText, attachedDocs, undefined, true)}
                className="ds-btn ds-btn-secondary ds-btn-sm"
                style={{ flexShrink: 0 }}
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Bottom Attached Files & Unified Pill Composer */}
      <div className="space-y-sm" style={{ paddingTop: 6 }}>
        {attachedDocs.length > 0 && (
          <div className="flex-row" style={{ gap: 6 }}>
            {attachedDocs.map((doc, idx) => (
              <div
                key={`${doc.name}-${idx}`}
                className="flex-row"
                style={{
                  gap: 6,
                  padding: '5px 11px',
                  borderRadius: 9999,
                  background: 'var(--c-surface-2)',
                  border: '1px solid var(--c-border)',
                  fontSize: 11.5,
                }}
              >
                <Icons.Paperclip size={12} />
                <strong>{doc.name}</strong>
                {doc.pageCount > 0 && <span className="muted">({doc.pageCount}p)</span>}
                <button
                  type="button"
                  onClick={() => setAttachedDocs(prev => prev.filter((_, i) => i !== idx))}
                  className="muted"
                  title="Remover anexo"
                  style={{ marginLeft: 2 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mentor-composer" style={{ padding: '6px 8px 6px 10px' }}>
          <label
            className="ds-icon-btn"
            style={{
              width: 36,
              height: 36,
              background: 'var(--c-surface-2)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="Anexar PDF (edital, ementa da faculdade ou apostilas)"
          >
            <Icons.Paperclip size={16} />
            <input
              type="file"
              accept=".pdf,.txt,.md"
              multiple
              style={{ display: 'none' }}
              onChange={e => {
                handleFileSelect(e.target.files);
                e.target.value = '';
              }}
            />
          </label>

          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendToAgent();
              }
            }}
            placeholder={
              attachedDocs.length > 0
                ? 'Responda às perguntas do mentor (cargo, horas/dia, nível)...'
                : 'Anexe o PDF do edital/ementa no clipe ou conte o que vai estudar...'
            }
            style={{ paddingLeft: 4 }}
          />

          <button
            disabled={busy || saving || parsingPdf}
            onClick={() => sendToAgent()}
            className="ds-btn ds-btn-primary"
            style={{ height: 36, padding: '0 16px' }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
