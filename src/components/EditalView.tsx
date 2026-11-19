'use client';

import React, { useMemo, useState } from 'react';
import { SUBJECT_META } from '../lib/syllabus';
import { fmtBR, Topic } from '../lib/types';
import { Icons } from './Icons';

interface EditalViewProps {
  topics: Topic[];
  onStartFocus: (topic: Topic) => void;
  onEditTopic: (topic: Topic) => void;
  onCreateCustom: () => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
}

export function EditalView({
  topics,
  onStartFocus,
  onEditTopic,
  onCreateCustom,
  onTopicAction,
}: EditalViewProps) {
  const [search, setSearch] = useState('');
  const [filterCargo, setFilterCargo] = useState<'all' | 'comum' | 'analista' | 'tecnico'>('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Legislação Municipal': true,
    'Noções de Administração Pública': true,
  });

  const filteredBySubject = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SUBJECT_META.map(sm => {
      if (filterSubject !== 'all' && sm.name !== filterSubject) return null;
      const items = topics.filter(t => {
        if (t.subject !== sm.name) return false;
        if (q && !`${t.title} ${t.subject} ${t.notes}`.toLowerCase().includes(q)) return false;
        if (filterCargo === 'comum' && t.overlap !== 'ambos-identico' && t.overlap !== 'ponte-peso') return false;
        if (filterCargo === 'analista' && t.overlap === 'exclusivo-tecnico') return false;
        if (filterCargo === 'tecnico' && t.overlap === 'exclusivo-analista') return false;
        if (filterStatus === 'study' && !t.study_queue) return false;
        if (filterStatus === 'review' && !t.review_queue) return false;
        if (filterStatus !== 'all' && filterStatus !== 'study' && filterStatus !== 'review' && t.status !== filterStatus) return false;
        return true;
      });
      if (items.length === 0) return null;
      const done = items.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
      return { meta: sm, items, done };
    }).filter(Boolean) as Array<{ meta: typeof SUBJECT_META[number]; items: Topic[]; done: number }>;
  }, [topics, search, filterCargo, filterSubject, filterStatus]);

  function toggleExpand(name: string) {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  }

  function statusLabel(st: string) {
    if (st === 'dominado') return { txt: 'Dominado', cls: 'ds-badge-green' };
    if (st === 'revisar') return { txt: 'Em revisão', cls: 'ds-badge-amber' };
    if (st === 'estudando') return { txt: 'Estudando', cls: 'ds-badge-blue' };
    return { txt: 'Não iniciado', cls: 'ds-badge-neutral' };
  }

  function overlapLabel(ov: string) {
    if (ov === 'ambos-identico') return { txt: 'Comum 2 Cargos', cls: 'ds-badge-green' };
    if (ov === 'ponte-peso') return { txt: 'Ponte (Muda Peso)', cls: 'ds-badge-amber' };
    if (ov === 'exclusivo-analista') return { txt: 'Analista TI', cls: 'ds-badge-indigo' };
    return { txt: 'Técnico Leg.', cls: 'ds-badge-blue' };
  }

  return (
    <div className="ds-container">
      {/* Toolbar */}
      <div className="ds-card ds-card-body">
        <div className="edital-toolbar">
          <div className="search-wrap">
            <Icons.Search size={15} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar tópico, lei ou assunto do edital..."
            />
          </div>

          <select aria-label="Cargo" className="ds-select" value={filterCargo} onChange={e => setFilterCargo(e.target.value as 'all' | 'comum' | 'analista' | 'tecnico')}>
            <option value="all">Cargo: Todos</option>
            <option value="comum">Comuns aos 2 Cargos</option>
            <option value="analista">Analista TI</option>
            <option value="tecnico">Técnico Legislativo</option>
          </select>

          <select aria-label="Disciplina" className="ds-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="all">Disciplina: Todas</option>
            {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>

          <select aria-label="Status" className="ds-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Status: Todos</option>
            <option value="study">Na fila de Hoje</option>
            <option value="review">Em Revisão</option>
            <option value="nao-iniciado">Não Iniciados</option>
            <option value="dominado">Dominados</option>
          </select>

          <button onClick={onCreateCustom} className="ds-btn ds-btn-primary ds-btn-sm">
            <Icons.Plus size={14} /> Novo Tópico
          </button>
        </div>
      </div>

      {/* Tree / Accordion por Disciplina */}
      {filteredBySubject.length === 0 ? (
        <div className="ds-card empty-box">
          <div className="empty-title">Nenhum conteúdo encontrado</div>
          <p className="empty-desc">Tente limpar os filtros ou pesquisar outro termo do edital.</p>
        </div>
      ) : (
        <div className="subject-tree">
          {filteredBySubject.map(({ meta, items, done }) => {
            const isOpen = Boolean(search.trim() || filterSubject !== 'all' || filterStatus !== 'all' || expanded[meta.name]);
            const pct = items.length ? Math.round((done / items.length) * 100) : 0;
            const ov = overlapLabel(meta.overlap);

            return (
              <section key={meta.name} className="ds-card">
                <button className="tree-header" onClick={() => toggleExpand(meta.name)}>
                  <div className="tree-title-group">
                    <div className="flex-row" style={{ gap: 8 }}>
                      <span className="tree-subject-name">{meta.name}</span>
                      <span className={`ds-badge ${ov.cls}`}>{ov.txt}</span>
                    </div>
                    <div className="text-xs muted" style={{ marginTop: 3 }}>
                      Analista: {meta.wAnl} · Técnico: {meta.wTec}
                    </div>
                  </div>

                  <div className="tree-right">
                    <div className="tree-prog-wrap">
                      <span className="text-xs muted">{done}/{items.length} ({pct}%)</span>
                      <div className="ds-progress" style={{ width: 84 }}>
                        <div className="ds-progress-fill indigo" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`chevron-rot ${isOpen ? 'open' : ''}`}><Icons.ChevronDown size={16} /></span>
                  </div>
                </button>

                {isOpen && (
                  <div className="tree-children">
                    {items.map(t => {
                      const st = statusLabel(t.status);
                      return (
                        <div key={t.id} className="tree-row">
                          <div className="tree-row-main">
                            <div className="tree-row-title">{t.title}</div>
                            <div className="tree-row-meta">
                              <span className={`ds-badge ${st.cls}`}>{st.txt}</span>
                              <span className="mastery-dots" title={`Domínio ${t.mastery} de 5`}>
                                {[1, 2, 3, 4, 5].map(n => (
                                  <span key={n} className={`m-dot ${n <= t.mastery ? 'filled' : ''}`} />
                                ))}
                              </span>
                              {t.q_total > 0 && (
                                <span className="text-xs muted">{t.q_right}/{t.q_total}q ({Math.round((t.q_right / t.q_total) * 100)}%)</span>
                              )}
                              {t.review_queue && t.next_review_date && (
                                <span className="text-xs muted">Rev. {fmtBR(t.next_review_date)}</span>
                              )}
                            </div>
                          </div>

                          <div className="tree-row-actions">
                            <button
                              onClick={() => onTopicAction({ action: 'toggle_study', id: t.id })}
                              className={`ds-btn ds-btn-sm ${t.study_queue ? 'ds-btn-primary' : 'ds-btn-ghost'}`}
                            >
                              {t.study_queue ? 'Na fila' : '+ Estudar'}
                            </button>
                            <button
                              onClick={() => onTopicAction({ action: 'toggle_review', id: t.id })}
                              className={`ds-btn ds-btn-sm ${t.review_queue ? 'ds-btn-secondary' : 'ds-btn-ghost'}`}
                            >
                              {t.review_queue ? 'Revisando' : '+ Revisar'}
                            </button>
                            <button onClick={() => onStartFocus(t)} className="ds-btn ds-btn-secondary ds-btn-sm">
                              <Icons.Play size={12} /> Foco
                            </button>
                            <button onClick={() => onEditTopic(t)} className="ds-btn ds-btn-ghost ds-btn-sm">
                              Editar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
