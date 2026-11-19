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
  const displayName = username || 'Candidato';
  const [messages, setMessages] = useState<SetupMsg[]>([
    {
      id: 1,
      role: 'assistant',
      text: `Olá, ${displayName}. Para o que você vai estudar?\n\nVocê pode anexar o PDF do edital, a ementa da faculdade ou a sua apostila no clipe abaixo — ou simplesmente me contar o seu objetivo e quanto tempo tem por dia.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
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
    const reader = new FileReader();
    reader.onload = async () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
      const fileObj = { name: file.name, base64, mimeType };
      setAttachedFile(fileObj);
      // Automatically send the file for analysis right away so the user doesn't have to click twice
      await sendToAgent('', fileObj);
    };
    reader.readAsDataURL(file);
  }

  async function sendToAgent(overrideText?: string, overrideFile?: { name: string; base64: string; mimeType: string } | null) {
    const text = (overrideText ?? input).trim();
    const fileToUse = overrideFile !== undefined ? overrideFile : attachedFile;
    if ((!text && !fileToUse) || busy) return;

    if (!overrideText) setInput('');
    setAttachedFile(null);
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
    <div className="ds-container" style={{ maxWidth: 740, minHeight: 'calc(100dvh - 96px)', justifyContent: 'space-between' }}>
      {/* Top Header */}
      <div className="flex-row" style={{ justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--c-border)' }}>
        <div className="flex-row" style={{ gap: 10 }}>
          <span className="brand-icon" style={{ width: 30, height: 30 }}><Icons.Logo size={15} /></span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Novo estudo</div>
            <div className="text-xs muted">Anexe seu edital, ementa ou apostila em PDF ou conte seu objetivo</div>
          </div>
        </div>
        {hasExistingPlans && (
          <button onClick={onCancel} className="ds-btn ds-btn-secondary ds-btn-sm">
            Voltar ao painel
          </button>
        )}
      </div>

      {/* Conversation Stream */}
      <div className="space-y" style={{ flex: 1, overflowY: 'auto', padding: '16px 2px' }}>
        {messages.map(m => {
          if (m.role === 'user') {
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="mentor-msg-user">
                  {m.fileName && (
                    <div className="flex-row" style={{ gap: 6, fontSize: 12, opacity: 0.9, marginBottom: m.text ? 4 : 0 }}>
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
              <div className="mentor-msg-assistant" style={{ maxWidth: '92%' }}>
                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.55 }}>{m.text}</div>

                {m.draft?.plan && (
                  <div
                    className="space-y-sm"
                    style={{
                      marginTop: 14,
                      padding: 14,
                      borderRadius: 16,
                      background: 'var(--c-bg)',
                      border: '1px solid var(--c-border)',
                    }}
                  >
                    <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{m.draft.plan.title}</div>
                        <div className="text-xs muted">{m.draft.plan.subtitle}</div>
                      </div>
                      <span className="ds-badge ds-badge-green">{m.draft.plan.daily_hours}</span>
                    </div>

                    {Array.isArray(m.draft.topics) && m.draft.topics.length > 0 && (
                      <div className="text-xs muted" style={{ paddingTop: 4 }}>
                        <strong style={{ color: 'var(--c-text)' }}>
                          {m.draft.topics.length} conteúdos organizados ({m.draft.plan.syllabus_label}):
                        </strong>
                        <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 4 }}>
                          {m.draft.topics.slice(0, 5).map((t, idx) => (
                            <li key={idx}>
                              <strong>{t.subject}:</strong> {t.title}
                              {idx < 3 && (
                                <span className="ds-badge ds-badge-green" style={{ marginLeft: 6, padding: '1px 7px', fontSize: 10.5 }}>
                                  Separado para hoje
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

                    <div className="flex-row" style={{ paddingTop: 8 }}>
                      <button
                        disabled={saving}
                        onClick={() => confirmAndLaunch(m.draft)}
                        className="ds-btn ds-btn-primary"
                      >
                        {saving ? 'Preparando seu painel...' : 'Abrir meu painel agora →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {busy && (
          <div className="mentor-msg-assistant muted text-sm">
            Lendo informações e montando sua programação...
          </div>
        )}

        {error && <div className="inline-alert error">{error}</div>}
        <div ref={endRef} />
      </div>

      {/* Bottom Starters & Unified Composer */}
      <div className="space-y-sm" style={{ paddingTop: 8 }}>
        {messages.length <= 1 && !busy && (
          <div className="mentor-quick-bar">
            <button
              className="quick-chip"
              onClick={() =>
                sendToAgent('Vou estudar uma matéria da faculdade (Banco de Dados II), tenho 1h30 por dia e minha P1 é daqui a 20 dias.')
              }
            >
              Matéria da faculdade
            </button>
            <button
              className="quick-chip"
              onClick={() =>
                sendToAgent('Vou estudar para um concurso público (apenas prova objetiva), tenho 2h por dia.')
              }
            >
              Concurso público
            </button>
            <button
              className="quick-chip"
              onClick={() =>
                sendToAgent('Estou fazendo um cursinho preparatório / certificação de tecnologia, tenho 1h30 por dia.')
              }
            >
              Curso ou certificação
            </button>
          </div>
        )}

        <div className="mentor-composer">
          <label
            className="ds-icon-btn"
            style={{ background: 'var(--c-surface-2)', cursor: 'pointer', flexShrink: 0 }}
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
          />

          <button
            disabled={busy || saving}
            onClick={() => sendToAgent()}
            className="ds-btn ds-btn-primary"
          >
            <Icons.Send size={15} /> <span className="hide-mobile">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
