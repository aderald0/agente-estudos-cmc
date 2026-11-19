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
      text: `Olá, ${displayName}. Para o que você vai estudar?\n\nVocê pode anexar o PDF do edital, a ementa da faculdade ou a sua apostila no clipe abaixo — ou simplesmente me contar o seu objetivo.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [lastFileName, setLastFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [latestDraft, setLatestDraft] = useState<DraftPlanData | null>(null);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 12 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 12 MB.');
      return;
    }
    setError('');
    setLastFileName(file.name);
    const reader = new FileReader();
    reader.onload = async () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
      await sendToAgent('', { name: file.name, base64, mimeType });
    };
    reader.readAsDataURL(file);
  }

  async function sendToAgent(
    overrideText?: string,
    overrideFile?: { name: string; base64: string; mimeType: string } | null
  ) {
    const text = (overrideText ?? input).trim();
    const fileToUse = overrideFile || null;
    if ((!text && !fileToUse) || busy) return;

    if (!overrideText) setInput('');
    setError('');

    const userMsg: SetupMsg = {
      id: Date.now(),
      role: 'user',
      text: text || `Anexei ${fileToUse?.name}`,
      fileName: fileToUse?.name,
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
          fileBase64: fileToUse?.base64 || '',
          fileName: fileToUse?.name || '',
          mimeType: fileToUse?.mimeType || '',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Não foi possível analisar agora.');
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
          text: data?.reply || 'Organizei seus conteúdos. Deseja abrir o painel agora?',
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
        maxWidth: 680,
        margin: '0 auto',
        padding: '20px 18px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {/* Top Minimal Header (Matches Prototype screenSetup) */}
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
                    <div className="flex-row" style={{ gap: 6, fontSize: 12, opacity: 0.9, marginBottom: 2 }}>
                      <Icons.Paperclip size={13} /> <strong>{m.fileName}</strong>
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="mentor-msg-assistant" style={{ maxWidth: '92%', padding: '16px 20px' }}>
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
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.draft.plan.title}</div>
                        <div className="text-xs muted">{m.draft.plan.subtitle}</div>
                      </div>
                      <span className="ds-badge ds-badge-green">{m.draft.plan.daily_hours}</span>
                    </div>

                    {Array.isArray(m.draft.topics) && m.draft.topics.length > 0 && (
                      <div className="text-xs muted" style={{ paddingTop: 6 }}>
                        <strong style={{ color: 'var(--c-text)' }}>
                          Conteúdos organizados ({m.draft.plan.syllabus_label}):
                        </strong>
                        <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 5 }}>
                          {m.draft.topics.slice(0, 5).map((t, idx) => (
                            <li key={idx}>
                              <strong style={{ color: 'var(--c-text)' }}>{t.subject}:</strong> {t.title}
                              {idx < 3 && (
                                <span
                                  className="ds-badge ds-badge-green"
                                  style={{ marginLeft: 6, padding: '1px 7px', fontSize: 10.5 }}
                                >
                                  Hoje
                                </span>
                              )}
                            </li>
                          ))}
                          {m.draft.topics.length > 5 && (
                            <li>+ {m.draft.topics.length - 5} outros tópicos na sua grade...</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div
                      className="flex-row"
                      style={{
                        marginTop: 12,
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
                        {saving ? 'Abrindo seu painel...' : 'Abrir meu painel agora →'}
                      </button>
                      <button
                        disabled={saving || busy}
                        onClick={() => sendToAgent('Ajuste minha rotina para 1h30 por dia.')}
                        className="ds-btn ds-btn-secondary"
                      >
                        Tenho 1h30 por dia
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
            Lendo documento e organizando seus conteúdos...
          </div>
        )}

        {error && <div className="inline-alert error">{error}</div>}
        <div ref={endRef} />
      </div>

      {/* Bottom Starter Cards & Unified Pill Composer (Matches Prototype screenSetup) */}
      <div className="space-y-sm" style={{ paddingTop: 6 }}>
        {messages.length <= 1 && !busy && (
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
              style={{
                padding: '11px 14px',
                textAlign: 'left',
                borderRadius: 16,
                transition: 'border-color 150ms ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Banco de Dados II · Faculdade</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Montar ementa com P1, P2 e trabalho
              </div>
            </button>

            <button
              onClick={() =>
                sendToAgent(
                  'Vou estudar para o concurso de Analista Judiciário de TI do TRT (banca FCC, apenas prova objetiva sem discursiva), tenho 2h por dia.'
                )
              }
              className="ds-card"
              style={{
                padding: '11px 14px',
                textAlign: 'left',
                borderRadius: 16,
                transition: 'border-color 150ms ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Analista Judiciário · TRT</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Concurso só com prova objetiva
              </div>
            </button>

            <button
              onClick={() =>
                sendToAgent(
                  'Estou fazendo um cursinho para a Certificação AWS Solutions Architect (SAA-C03), tenho 1h45 por dia e quero foco em módulos e simulados.'
                )
              }
              className="ds-card"
              style={{
                padding: '11px 14px',
                textAlign: 'left',
                borderRadius: 16,
                transition: 'border-color 150ms ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>Certificação AWS Architect</div>
              <div className="text-xs muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                Módulos do curso + simulados
              </div>
            </button>
          </div>
        )}

        {lastFileName && (
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
              <strong>{lastFileName}</strong>
            </div>
            <span style={{ color: 'var(--c-success)', fontWeight: 600, fontSize: 11.5 }}>
              {busy ? 'Lendo arquivo...' : 'Lido com sucesso'}
            </span>
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
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendToAgent();
              }
            }}
            placeholder="Conte o que vai estudar ou anexe o PDF no clipe..."
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
