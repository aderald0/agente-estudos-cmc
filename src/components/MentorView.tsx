'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { ChatMsg, StudyPlan, Topic } from '../lib/types';
import { Icons } from './Icons';

interface MentorViewProps {
  activePlan?: StudyPlan | null;
  chat: ChatMsg[];
  topics: Topic[];
  chatInput: string;
  chatBusy: boolean;
  onChangeInput: (val: string) => void;
  onSend: (overrideText?: string, fileObj?: { name: string; base64: string; mimeType: string }) => void;
  onClear: () => void;
  onStartFocus: (topic: Topic) => void;
}

function renderRichAssistantText(md: string) {
  return md
    .split('\n')
    .filter(line => !/^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line) && line.trim() !== '---')
    .map((line, i) => {
      const clean = line.replace(/^#{1,4}\s+/, '');
      const html = clean
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      if (clean.startsWith('- ') || clean.startsWith('* ')) {
        return <li key={i} dangerouslySetInnerHTML={{ __html: html.slice(2) }} />;
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
    });
}

export function MentorView({
  activePlan,
  chat,
  topics,
  chatInput,
  chatBusy,
  onChangeInput,
  onSend,
  onClear,
  onStartFocus,
}: MentorViewProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, chatBusy]);

  const activeQueue = useMemo(() => topics.filter(t => t.study_queue), [topics]);

  function handleFileAttach(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > 12 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      const base64 = res.includes(',') ? res.split(',')[1] : res;
      const mimeType = f.type || (f.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
      onSend(
        chatInput.trim() || `Analise o documento anexado (${f.name}) e adicione novos tópicos ou cartões relevantes ao meu estudo.`,
        { name: f.name, base64, mimeType }
      );
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="mentor-layout">
      {/* Context Strip */}
      <div className="mentor-header">
        <div className="flex-row">
          <span className="mentor-avatar"><Icons.Sparkles size={15} /></span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Mentor · {activePlan?.title || 'Câmara de Cuiabá 2026'}</div>
            <div className="text-xs muted">{activePlan?.subtitle || 'Organiza sua rotina, questões e revisões automaticamente'}</div>
          </div>
        </div>
        <button onClick={onClear} className="ds-btn ds-btn-ghost ds-btn-sm">Limpar conversa</button>
      </div>

      {/* Main Conversation Stream */}
      <div className="mentor-stream">
        {chat.length === 0 ? (
          <div className="mentor-welcome">
            <div className="empty-icon"><Icons.Sparkles size={22} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Como posso ajudar no seu estudo agora?</h2>
            <p className="text-sm muted" style={{ maxWidth: 460, margin: '4px auto 0' }}>
              Peça para reorganizar seu dia, gere questões sobre o assunto atual, anexe um PDF novo no clipe ou registre o que acabou de estudar.
            </p>
          </div>
        ) : (
          chat.map(m => {
            if (m.role === 'tool_trace') {
              let items: string[] = [];
              try { items = JSON.parse(m.content); } catch {}
              return (
                <div key={m.id} className="mentor-trace">
                  {items.map((it, idx) => (
                    <span key={idx} className="ds-badge ds-badge-green"><Icons.Check size={12} /> {it}</span>
                  ))}
                </div>
              );
            }
            if (m.role === 'user') {
              return (
                <div key={m.id} className="mentor-msg-user">
                  {m.content}
                </div>
              );
            }
            return (
              <div key={m.id} className="mentor-msg-assistant">
                <div className="mentor-msg-badge"><Icons.Sparkles size={12} /> Mentor</div>
                <div className="mentor-msg-content">{renderRichAssistantText(m.content)}</div>
              </div>
            );
          })
        )}

        {/* Interactive Plan Cards when study queue is active */}
        {activeQueue.length > 0 && (
          <div className="mentor-plan-deck">
            <div className="text-xs muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Separado para hoje ({activeQueue.length})
            </div>
            <div className="mentor-plan-grid">
              {activeQueue.map(t => (
                <div key={t.id} className="plan-mini-card">
                  <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                    <span className="ds-badge ds-badge-indigo">{t.subject}</span>
                    <span className="text-xs muted">{t.priority === 'alta' ? '45 min' : '30 min'}</span>
                  </div>
                  <div className="text-sm" style={{ fontWeight: 600, margin: '6px 0 10px' }}>{t.title}</div>
                  <button onClick={() => onStartFocus(t)} className="ds-btn ds-btn-primary ds-btn-sm" style={{ width: '100%' }}>
                    <Icons.Play size={12} /> Começar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatBusy && (
          <div className="mentor-msg-assistant muted text-sm">
            Analisando e atualizando seu estudo...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Actions */}
      <div className="mentor-quick-bar">
        <button className="quick-chip" onClick={() => onSend('O que devo priorizar hoje?')}>O que estudar hoje?</button>
        <button className="quick-chip" onClick={() => onSend('Tenho 1 hora disponível agora. Reorganize meu plano de hoje.')}>Tenho 1 hora</button>
        <button className="quick-chip" onClick={() => onSend('Crie 3 questões inéditas sobre o tema que estou estudando hoje.')}>Gerar questões</button>
        <button className="quick-chip" onClick={() => onSend('Identifique meus pontos fracos com base nos meus acertos e erros.')}>Pontos fracos</button>
        <button className="quick-chip" onClick={() => onSend('Quais conteúdos preciso revisar hoje?')}>Revisar conteúdos</button>
      </div>

      {/* Composer with Paperclip PDF attachment */}
      <div className="mentor-composer">
        <label
          className="ds-icon-btn"
          style={{ background: 'var(--c-surface-2)', cursor: 'pointer', flexShrink: 0 }}
          title="Anexar PDF ou material de estudo"
        >
          <Icons.Paperclip size={16} />
          <input
            type="file"
            accept=".pdf,.txt,.md"
            style={{ display: 'none' }}
            onChange={e => handleFileAttach(e.target.files)}
          />
        </label>
        <textarea
          rows={1}
          value={chatInput}
          onChange={e => onChangeInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Converse com o mentor ou anexe um PDF no clipe..."
        />
        <button disabled={chatBusy} onClick={() => onSend()} className="ds-btn ds-btn-primary" aria-label="Enviar mensagem">
          <Icons.Send size={16} /> <span className="hide-mobile">Enviar</span>
        </button>
      </div>
    </div>
  );
}
