'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';

interface DraftPlanData {
  ready: boolean;
  reply: string;
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
  fileName?: string;
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
      text: `Olá, ${displayName}. Para o que você vai estudar?\n\nVocê pode anexar o PDF do edital, a ementa da faculdade ou a sua apostila no clipe abaixo e me dizer o cargo ou objetivo.`,
    },
  ]);
  const [input, setInput] = useState('');
  // Pending file ready to be sent with the user's message (so they can specify the cargo!)
  const [pendingFile, setPendingFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  // Persisted file in memory across turns so follow-up answers ("Quero para o cargo Analista Ambiental Perfil X") still send the PDF to Gemini!
  const [persistedFile, setPersistedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);

  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [latestDraft, setLatestDraft] = useState<DraftPlanData | null>(null);
  const [expandedDraftId, setExpandedDraftId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 18 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 18 MB.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
      const fileObj = { name: file.name, base64, mimeType };
      setPendingFile(fileObj);
      setPersistedFile(fileObj);
      inputRef.current?.focus();
    };
    reader.readAsDataURL(file);
  }

  async function sendToAgent(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    const fileToSend = pendingFile || persistedFile;
    if ((!text && !pendingFile) || busy) return;

    const displayedFileName = pendingFile?.name;
    if (!overrideText) setInput('');
    setPendingFile(null);
    setError('');

    const userMsg: SetupMsg = {
      id: Date.now(),
      role: 'user',
      text: text || `Analise o documento ${displayedFileName} e extraia todas as disciplinas.`,
      fileName: displayedFileName,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setBusy(true);

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          action: 'analyze',
          messages: nextHistory.map(m => ({ role: m.role, text: m.text })),
          fileBase64: fileToSend?.base64 || '',
          fileName: fileToSend?.name || '',
          mimeType: fileToSend?.mimeType || '',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Não foi possível analisar o documento agora.');
        return;
      }

      const data = json.data as DraftPlanData;
      if (data?.ready && data?.plan) {
        setLatestDraft(data);
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: data?.reply || 'Organizei seus conteúdos. Confira as disciplinas abaixo:',
          draft: data?.ready && data?.plan ? data : undefined,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de conexão.');
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
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Erro ao salvar plano no banco.');
        setSaving(false);
        return;
      }
      await onPlanCreated(json.planId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de rede.');
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: 720,
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
        {messages.map(m => {
          if (m.role === 'user') {
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="mentor-msg-user">
                  {m.fileName && (
                    <div className="flex-row" style={{ gap: 6, fontSize: 12, opacity: 0.9, marginBottom: 4 }}>
                      <Icons.Paperclip size={13} /> <strong>{m.fileName}</strong>
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            );
          }

          // Group extracted topics by discipline/subject so the user sees ALL disciplines extracted from the Edital
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

          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="mentor-msg-assistant" style={{ maxWidth: '94%', padding: '16px 20px' }}>
                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: 14 }}>{m.text}</div>

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

                    {/* All Extracted Disciplines Summary Chips */}
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
                              maxHeight: 260,
                              overflowY: 'auto',
                              padding: 10,
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
                      Faltou alguma disciplina ou quer outro cargo deste PDF? Basta pedir no campo abaixo que eu complemento antes de criar!
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

        {busy && (
          <div className="mentor-msg-assistant muted text-sm" style={{ padding: '14px 18px' }}>
            Lendo todas as páginas do documento e extraindo todas as disciplinas do conteúdo programático...
          </div>
        )}

        {error && <div className="inline-alert error">{error}</div>}
        <div ref={endRef} />
      </div>

      {/* Bottom Starter Cards & Unified Pill Composer */}
      <div className="space-y-sm" style={{ paddingTop: 6 }}>
        {messages.length <= 1 && !busy && !pendingFile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <button
              onClick={() =>
                sendToAgent(
                  'Vou estudar Banco de Dados II na faculdade (provas P1, P2 e projeto prático SQL), tenho 1h30 por dia e minha P1 é daqui a 18 dias.'
                )
              }
              className="ds-card"
              style={{ padding: '11px 14px', textAlign: 'left', borderRadius: 16 }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Banco de Dados II · Faculdade</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Montar ementa com P1, P2 e trabalho
              </div>
            </button>

            <button
              onClick={() =>
                sendToAgent(
                  'Vou estudar para o concurso da SEMA-MT, extraia todas as disciplinas de Conhecimentos Básicos, Gerais e Específicos.'
                )
              }
              className="ds-card"
              style={{ padding: '11px 14px', textAlign: 'left', borderRadius: 16 }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Concurso SEMA / Edital</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Extrair todas as disciplinas do cargo
              </div>
            </button>

            <button
              onClick={() =>
                sendToAgent(
                  'Estou fazendo um cursinho para a Certificação AWS Solutions Architect (SAA-C03), tenho 1h45 por dia e quero foco em módulos e simulados.'
                )
              }
              className="ds-card"
              style={{ padding: '11px 14px', textAlign: 'left', borderRadius: 16 }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Certificação AWS Architect</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Módulos do curso + simulados
              </div>
            </button>
          </div>
        )}

        {/* Attached PDF Staging Pill: allows the user to type the exact Cargo before clicking Enviar */}
        {(pendingFile || persistedFile) && (
          <div
            className="flex-row"
            style={{
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderRadius: 14,
              background: 'var(--c-surface-2)',
              border: '1px solid var(--c-border)',
              fontSize: 12,
            }}
          >
            <div className="flex-row" style={{ gap: 6 }}>
              <Icons.Paperclip size={14} />
              <strong>{(pendingFile || persistedFile)?.name}</strong>
              {pendingFile && (
                <span className="muted">
                  — digite abaixo para qual cargo/área vai estudar (ou clique direto em Enviar)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingFile(null);
                setPersistedFile(null);
              }}
              className="text-xs muted"
              title="Remover arquivo"
            >
              ✕
            </button>
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
            title="Anexar PDF (edital, ementa da faculdade ou apostila)"
          >
            <Icons.Paperclip size={16} />
            <input
              type="file"
              accept=".pdf,.txt,.md"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e.target.files)}
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
              pendingFile
                ? `Informe seu cargo no ${pendingFile.name} (ex: Analista Ambiental - Perfil X) e envie...`
                : 'Anexe o PDF no clipe e informe seu cargo ou objetivo...'
            }
            style={{ paddingLeft: 4 }}
          />

          <button
            disabled={busy || saving}
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
