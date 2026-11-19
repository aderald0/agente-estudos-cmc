'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { ChatMsg, Topic } from '../lib/types';
import { Icons } from './Icons';

interface MentorViewProps {
  chat: ChatMsg[];
  topics: Topic[];
  chatInput: string;
  chatBusy: boolean;
  onChangeInput: (val: string) => void;
  onSend: (overrideText?: string) => void;
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

  return (
    <div className="mentor-layout">
      {/* Context Strip */}
      <div className="mentor-header">
        <div className="flex-row">
          <span className="mentor-avatar"><Icons.Sparkles size={15} /></span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Mentor Estratégico CMC 2026</div>
            <div className="text-xs muted">Analista TI &amp; Técnico · Atualiza seu banco Neon automaticamente</div>
          </div>
        </div>
        <button onClick={onClear} className="ds-btn ds-btn-ghost ds-btn-sm">Nova conversa</button>
      </div>

      {/* Main Conversation Stream */}
      <div className="mentor-stream">
        {chat.length === 0 ? (
          <div className="mentor-welcome">
            <div className="empty-icon"><Icons.Sparkles size={22} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Como posso ajudar nos seus estudos agora?</h2>
            <p className="text-sm muted" style={{ maxWidth: 460, margin: '4px auto 0' }}>
              Peça seu plano diário, gere simulados estilo Selecon, registre quantas questões acertou ou analise seus pontos fracos.
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
              Plano ativo na sua fila ({activeQueue.length})
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
                    <Icons.Play size={12} /> Iniciar sessão
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatBusy && (
          <div className="mentor-msg-assistant muted text-sm">
            Analisando seu histórico e atualizando o plano...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Actions */}
      <div className="mentor-quick-bar">
        <button className="quick-chip" onClick={() => onSend('O que estudar hoje?')}>O que estudar hoje?</button>
        <button className="quick-chip" onClick={() => onSend('Tenho 1 hora disponível agora. Monte um bloco de estudo.')}>Tenho 1 hora</button>
        <button className="quick-chip" onClick={() => onSend('Gere 3 questões estilo Selecon sobre o tema que estou estudando.')}>Gerar questões</button>
        <button className="quick-chip" onClick={() => onSend('Identifique meus pontos fracos com base nos meus acertos e erros.')}>Identificar pontos fracos</button>
        <button className="quick-chip" onClick={() => onSend('Quais conteúdos preciso revisar hoje?')}>Revisar conteúdos</button>
      </div>

      {/* Composer */}
      <div className="mentor-composer">
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
          placeholder="Pergunte ao mentor ou relate seu estudo (ex: Fiz 17/20 em Atos Adm.)..."
        />
        <button disabled={chatBusy} onClick={() => onSend()} className="ds-btn ds-btn-primary" aria-label="Enviar mensagem">
          <Icons.Send size={16} /> <span className="hide-mobile">Enviar</span>
        </button>
      </div>
    </div>
  );
}
