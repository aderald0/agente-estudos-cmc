'use client';

import React, { useMemo, useState } from 'react';
import { SUBJECT_META, SubjectMeta, TEC_ESPECIFICOS_TOC_META } from '../lib/syllabus';
import { fmtBR, StudyPlan, Topic } from '../lib/types';
import { Icons } from './Icons';

interface EditalViewProps {
  activePlan?: StudyPlan | null;
  topics: Topic[];
  onStartFocus: (topic: Topic) => void;
  onEditTopic: (topic: Topic) => void;
  onCreateCustom: () => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
}

interface GroupedApostila {
  key: string;
  apostilaTag?: string;
  name: string;
  overlap: string;
  subtitle: string;
  items: Topic[];
  done: number;
  defaultOpen: boolean;
}

export function EditalView({
  activePlan,
  topics,
  onStartFocus,
  onEditTopic,
  onCreateCustom,
  onTopicAction,
}: EditalViewProps) {
  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'analista' | 'tecnico' | 'all' | 'comum'>('analista');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Build subject/apostila groups matching the exact Drive apostilas for Analista (01-09) and Técnico (01-08)
  const rawGroups = useMemo(() => {
    if (!isCmcPlan) {
      const uniqueNames = Array.from(new Set(topics.map(t => t.subject)));
      return uniqueNames.map(name => ({
        key: name,
        apostilaTag: undefined as string | undefined,
        name,
        overlap: 'ambos-identico',
        subtitle: '',
        matchTopics: (all: Topic[]) => all.filter(t => t.subject === name),
      }));
    }

    if (viewMode === 'analista') {
      return SUBJECT_META.filter(sm => typeof sm.orderAnl === 'number')
        .sort((a, b) => (a.orderAnl || 99) - (b.orderAnl || 99))
        .map(sm => ({
          key: `anl-${sm.name}`,
          apostilaTag: sm.apostilaAnl,
          name: sm.name,
          overlap: sm.overlap,
          subtitle: `Analista TI: ${sm.wAnl}${sm.apostilaTec ? ` · Também cai no Técnico (${sm.apostilaTec})` : ' · Exclusiva Analista TI'}`,
          matchTopics: (all: Topic[]) =>
            all.filter(t => t.subject === sm.name && t.overlap !== 'exclusivo-tecnico'),
        }));
    }

    if (viewMode === 'tecnico') {
      // Exact 8 apostilas of pasta tecnico/ (01 to 08):
      // Apostila 07 merges Adm. Pública + Exclusivos in exact printed Sumário order (16 chapters, p. 1–102)
      const tecOrder: Array<{
        key: string;
        apostilaTag: string;
        name: string;
        overlap: string;
        subtitle: string;
        subjects: string[];
      }> = [
        { key: 'tec-01', apostilaTag: 'Apostila 01', name: 'Língua Portuguesa', overlap: 'ambos-identico', subtitle: 'Técnico: Básicos (1,00) · Idêntica à Apostila 01 do Analista', subjects: ['Língua Portuguesa'] },
        { key: 'tec-02', apostilaTag: 'Apostila 02', name: 'Raciocínio Lógico e Matemático', overlap: 'ponte-peso', subtitle: 'Técnico: Básicos (1,00) · Contida na Apostila 02 do Analista', subjects: ['Raciocínio Lógico e Matemático'] },
        { key: 'tec-03', apostilaTag: 'Apostila 03', name: 'Noções de Informática', overlap: 'ambos-identico', subtitle: 'Técnico: Básicos (1,00) · Idêntica à Apostila 03 do Analista', subjects: ['Noções de Informática'] },
        { key: 'tec-04', apostilaTag: 'Apostila 04', name: 'História e Geografia de MT', overlap: 'ambos-identico', subtitle: 'Técnico: Gerais (1,00) · Idêntica à Apostila 08 do Analista', subjects: ['História e Geografia de MT'] },
        { key: 'tec-05', apostilaTag: 'Apostila 05', name: 'Noções de Ética e Filosofia', overlap: 'ambos-identico', subtitle: 'Técnico: Gerais (1,00) · Idêntica à Apostila 04 do Analista', subjects: ['Noções de Ética e Filosofia'] },
        { key: 'tec-06', apostilaTag: 'Apostila 06', name: 'Relações Interpessoais', overlap: 'ambos-identico', subtitle: 'Técnico: Gerais (1,00)+Esp · Idêntica à Apostila 05 do Analista', subjects: ['Relações Interpessoais'] },
        { key: 'tec-07', apostilaTag: 'Apostila 07', name: 'Conhecimentos Específicos — Técnico', overlap: 'exclusivo-tecnico', subtitle: 'Técnico: Específicos (1,75+Disc) · Sumário completo (16 capítulos, págs. 1 a 102)', subjects: ['Noções de Administração Pública', 'Conhecimentos Específicos — Técnico'] },
        { key: 'tec-08', apostilaTag: 'Apostila 08', name: 'Legislação Municipal', overlap: 'ponte-peso', subtitle: 'Técnico: Básicos (1,00) · Idêntica à Apostila 09 do Analista (1,75)', subjects: ['Legislação Municipal'] },
      ];

      return tecOrder.map(g => ({
        key: g.key,
        apostilaTag: g.apostilaTag,
        name: g.name,
        overlap: g.overlap,
        subtitle: g.subtitle,
        matchTopics: (all: Topic[]) => {
          const matched = all.filter(t => g.subjects.includes(t.subject) && t.overlap !== 'exclusivo-analista');
          if (g.key === 'tec-07') {
            return [...matched].sort(
              (a, b) => (TEC_ESPECIFICOS_TOC_META[a.id]?.order ?? 99) - (TEC_ESPECIFICOS_TOC_META[b.id]?.order ?? 99)
            );
          }
          return matched;
        },
      }));
    }

    // 'all' or 'comum': unified 10 disciplines with both apostila references
    return SUBJECT_META.map((sm: SubjectMeta) => ({
      key: `all-${sm.name}`,
      apostilaTag: undefined as string | undefined,
      name: sm.name,
      overlap: sm.overlap,
      subtitle: [
        sm.apostilaAnl ? `Analista: ${sm.apostilaAnl} (${sm.wAnl})` : null,
        sm.apostilaTec ? `Técnico: ${sm.apostilaTec} (${sm.wTec})` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      matchTopics: (all: Topic[]) =>
        all.filter(t => {
          if (t.subject !== sm.name) return false;
          if (viewMode === 'comum' && t.overlap !== 'ambos-identico' && t.overlap !== 'ponte-peso') return false;
          return true;
        }),
    }));
  }, [isCmcPlan, topics, viewMode]);

  const filteredBySubject: GroupedApostila[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rawGroups
      .map((g, groupIdx) => {
        if (filterSubject !== 'all' && g.name !== filterSubject) return null;
        const items = g.matchTopics(topics).filter(t => {
          if (q && !`${t.title} ${t.subject} ${t.notes}`.toLowerCase().includes(q)) return false;
          if (filterStatus === 'study' && !t.study_queue) return false;
          if (filterStatus === 'review' && !t.review_queue) return false;
          if (filterStatus !== 'all' && filterStatus !== 'study' && filterStatus !== 'review' && t.status !== filterStatus) return false;
          return true;
        });
        if (items.length === 0) return null;
        const done = items.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
        return {
          key: g.key,
          apostilaTag: g.apostilaTag,
          name: g.name,
          overlap: g.overlap,
          subtitle: g.subtitle,
          items,
          done,
          defaultOpen: groupIdx < 1,
        };
      })
      .filter(Boolean) as GroupedApostila[];
  }, [topics, rawGroups, search, filterSubject, filterStatus]);

  const totalVisibleTopics = useMemo(
    () => filteredBySubject.reduce((acc, g) => acc + g.items.length, 0),
    [filteredBySubject]
  );

  function toggleExpand(key: string, currentOpen: boolean) {
    setExpanded(prev => ({ ...prev, [key]: !currentOpen }));
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
      {/* Apostila / Folder Selector for CMC 2026 */}
      {isCmcPlan && (
        <div className="flex-row" style={{ justifyContent: 'space-between', gap: 12 }}>
          <div className="segmented" role="tablist" aria-label="Separar por apostilas">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'analista'}
              className={`seg-btn ${viewMode === 'analista' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('analista');
                setFilterSubject('all');
              }}
            >
              Apostilas Analista TI (01–09)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'tecnico'}
              className={`seg-btn ${viewMode === 'tecnico' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('tecnico');
                setFilterSubject('all');
              }}
            >
              Apostilas Técnico (01–08)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'all'}
              className={`seg-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('all');
                setFilterSubject('all');
              }}
            >
              Todas unificadas
            </button>
          </div>

          <span className="text-xs muted">
            {filteredBySubject.length} {viewMode === 'analista' || viewMode === 'tecnico' ? 'apostilas' : 'disciplinas'} · {totalVisibleTopics} capítulos
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="ds-card ds-card-body">
        <div className="edital-toolbar" style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
          <div className="search-wrap">
            <Icons.Search size={15} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar capítulo ou assunto..."
            />
          </div>

          <select aria-label="Matéria" className="ds-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="all">{viewMode === 'analista' || viewMode === 'tecnico' ? 'Apostila: Todas' : 'Matéria: Todas'}</option>
            {rawGroups.map(s => (
              <option key={s.key} value={s.name}>
                {s.apostilaTag ? `${s.apostilaTag} · ${s.name}` : s.name}
              </option>
            ))}
          </select>

          <select aria-label="Status" className="ds-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Status: Todos</option>
            <option value="study">No plano de Hoje</option>
            <option value="review">Em Revisão</option>
            <option value="nao-iniciado">Não Iniciados</option>
            <option value="dominado">Dominados</option>
          </select>

          <button onClick={onCreateCustom} className="ds-btn ds-btn-primary ds-btn-sm">
            <Icons.Plus size={14} /> Novo Tópico
          </button>
        </div>
      </div>

      {/* Tree / Accordion por Apostila ou Matéria */}
      {filteredBySubject.length === 0 ? (
        <div className="ds-card empty-box">
          <div className="empty-title">Nenhum conteúdo encontrado</div>
          <p className="empty-desc">Tente limpar os filtros ou pesquisar outro termo.</p>
        </div>
      ) : (
        <div className="subject-tree">
          {filteredBySubject.map(group => {
            const explicit = expanded[group.key];
            const isOpen = Boolean(
              search.trim() ||
              filterSubject !== 'all' ||
              filterStatus !== 'all' ||
              (explicit !== undefined ? explicit : group.defaultOpen)
            );
            const pct = group.items.length ? Math.round((group.done / group.items.length) * 100) : 0;
            const ov = overlapLabel(group.overlap);

            return (
              <section key={group.key} className="ds-card">
                <button className="tree-header" onClick={() => toggleExpand(group.key, isOpen)}>
                  <div className="tree-title-group">
                    <div className="flex-row" style={{ gap: 8 }}>
                      {group.apostilaTag && (
                        <span className="ds-badge ds-badge-neutral" style={{ fontWeight: 700 }}>
                          {group.apostilaTag}
                        </span>
                      )}
                      <span className="tree-subject-name">{group.name}</span>
                      {isCmcPlan && <span className={`ds-badge ${ov.cls}`}>{ov.txt}</span>}
                    </div>
                    {group.subtitle && (
                      <div className="text-xs muted" style={{ marginTop: 3 }}>
                        {group.subtitle}
                      </div>
                    )}
                  </div>

                  <div className="tree-right">
                    <div className="tree-prog-wrap">
                      <span className="text-xs muted">{group.done}/{group.items.length} ({pct}%)</span>
                      <div className="ds-progress" style={{ width: 84 }}>
                        <div className="ds-progress-fill indigo" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`chevron-rot ${isOpen ? 'open' : ''}`}><Icons.ChevronDown size={16} /></span>
                  </div>
                </button>

                {isOpen && (
                  <div className="tree-children">
                    {group.items.map((t, idx) => {
                      const st = statusLabel(t.status);
                      const lowAcc = t.q_total >= 4 && (t.q_right / t.q_total) < 0.6;
                      const priBadge =
                        isCmcPlan
                          ? t.overlap === 'ponte-peso'
                            ? 'Peso 1,75×'
                            : t.overlap === 'exclusivo-analista' || t.overlap === 'exclusivo-tecnico'
                            ? 'Peso 1,75×'
                            : 'Peso 1,0×'
                          : t.priority === 'alta'
                          ? 'Alta prioridade'
                          : 'Média';

                      const pageNum = group.key === 'tec-07' ? TEC_ESPECIFICOS_TOC_META[t.id]?.page : undefined;

                      return (
                        <div key={t.id} className="tree-row">
                          <div className="tree-row-main">
                            <div className="tree-row-title">
                              <span className="muted" style={{ fontSize: 11.5, fontWeight: 600, marginRight: 6 }}>
                                Cap. {String(idx + 1).padStart(2, '0')}
                                {pageNum ? ` · p. ${pageNum}` : ''}
                              </span>
                              {t.title}
                            </div>
                            <div className="tree-row-meta">
                              <span className={`ds-badge ${st.cls}`}>{st.txt}</span>
                              <span className="ds-badge ds-badge-indigo">{priBadge}</span>
                              {lowAcc && <span className="ds-badge ds-badge-red">Reforçar (&lt;60%)</span>}
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
                              {t.study_queue ? 'No dia' : '+ Hoje'}
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
