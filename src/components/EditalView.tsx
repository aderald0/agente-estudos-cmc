'use client';

import React, { useMemo, useState } from 'react';
import {
  CargoKey,
  EDITAL_AUDIT_FINDINGS,
  EDITAL_CARGOS,
  EDITAL_INFO,
  findChapterForTopic,
  getApostilasForCargo,
} from '../lib/apostilasCatalog';
import { fmtBR, ReaderTarget, StudyPlan, Topic } from '../lib/types';
import { Icons } from './Icons';

interface EditalViewProps {
  activePlan?: StudyPlan | null;
  topics: Topic[];
  onStartFocus: (topic: Topic) => void;
  onEditTopic: (topic: Topic) => void;
  onCreateCustom: () => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
  onOpenReader: (target: ReaderTarget) => void;
}

export function EditalView({
  activePlan,
  topics,
  onStartFocus,
  onEditTopic,
  onCreateCustom,
  onTopicAction,
  onOpenReader,
}: EditalViewProps) {
  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';
  const [cargoTab, setCargoTab] = useState<'analista' | 'tecnico' | 'all'>('analista');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'estudando' | 'concluido'>('all');
  const [showAudit, setShowAudit] = useState(true);

  const topicMap = useMemo(() => {
    const m = new Map<string, Topic>();
    for (const t of topics) m.set(t.id, t);
    return m;
  }, [topics]);

  const preferredCargo: CargoKey = cargoTab === 'tecnico' ? 'tecnico' : 'analista';

  // Build validated discipline groups from APOSTILAS_CATALOG for CMC, or generic groups for custom plans
  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!isCmcPlan) {
      const subjects = Array.from(new Set(topics.map(t => t.subject)));
      return subjects
        .map(subject => {
          const items = topics.filter(t => {
            if (t.subject !== subject) return false;
            if (statusFilter === 'pendente' && t.status !== 'nao-iniciado') return false;
            if (statusFilter === 'estudando' && t.status !== 'estudando') return false;
            if (statusFilter === 'concluido' && t.status !== 'revisar' && t.status !== 'dominado') return false;
            if (q && !t.title.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return false;
            return true;
          });
          return {
            key: subject,
            code: '',
            title: subject,
            weight: '',
            highWeight: false,
            apostilaId: '',
            items: items.map(t => ({
              topic: t,
              chapterNumber: 0,
              printedPageStart: 0,
              printedPageEnd: 0,
              pdfPageStart: 0,
              editalRef: '',
              validationStatus: 'validado' as const,
              validationNote: undefined as string | undefined,
              fallbackApostilaId: undefined as string | undefined,
              fallbackPdfPage: undefined as number | undefined,
            })),
          };
        })
        .filter(g => g.items.length > 0);
    }

    const apostilas = getApostilasForCargo(cargoTab, false);
    return apostilas
      .map(ap => {
        const rows = ap.chapters
          .map(ch => {
            const topic = ch.topicId ? topicMap.get(ch.topicId) : null;
            if (!topic) return null;
            if (statusFilter === 'pendente' && topic.status !== 'nao-iniciado') return null;
            if (statusFilter === 'estudando' && topic.status !== 'estudando') return null;
            if (statusFilter === 'concluido' && topic.status !== 'revisar' && topic.status !== 'dominado') return null;
            if (
              q &&
              !ch.title.toLowerCase().includes(q) &&
              !ap.title.toLowerCase().includes(q) &&
              !ch.editalRef.toLowerCase().includes(q)
            ) {
              return null;
            }
            return {
              topic,
              chapterNumber: ch.chapterNumber,
              printedPageStart: ch.printedPageStart,
              printedPageEnd: ch.printedPageEnd,
              pdfPageStart: ch.pdfPageStart,
              editalRef: ch.editalRef,
              validationStatus: ch.validationStatus,
              validationNote: ch.validationNote,
              fallbackApostilaId: ch.fallbackApostilaId,
              fallbackPdfPage: ch.fallbackPdfPage,
            };
          })
          .filter(Boolean) as Array<{
            topic: Topic;
            chapterNumber: number;
            printedPageStart: number;
            printedPageEnd: number;
            pdfPageStart: number;
            editalRef: string;
            validationStatus: 'validado' | 'atencao' | 'lacuna' | 'fora-edital';
            validationNote?: string;
            fallbackApostilaId?: string;
            fallbackPdfPage?: number;
          }>;

        return {
          key: ap.id,
          code: cargoTab === 'tecnico' ? ap.codeTec || ap.codeAnl || '' : ap.codeAnl || ap.codeTec || '',
          title: ap.title,
          weight: cargoTab === 'tecnico' ? ap.weightTec || ap.weightAnl || '' : ap.weightAnl || ap.weightTec || '',
          highWeight: cargoTab === 'tecnico' ? Boolean(ap.highWeightTec) : Boolean(ap.highWeightAnl),
          apostilaId: ap.id,
          items: rows,
        };
      })
      .filter(g => g.items.length > 0);
  }, [isCmcPlan, cargoTab, search, statusFilter, topics, topicMap]);

  const stats = useMemo(() => {
    const valid = topics.filter(t => t.id !== 'tec-cap-9');
    const done = valid.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const studying = valid.filter(t => t.status === 'estudando').length;
    return {
      total: valid.length,
      done,
      studying,
      pct: valid.length > 0 ? Math.round((done / valid.length) * 100) : 0,
    };
  }, [topics]);

  return (
    <div className="edital-view">
      {/* Header */}
      <header className="section-head">
        <div>
          <span className="eyebrow">{isCmcPlan ? EDITAL_INFO.number : activePlan?.syllabus_label || 'Conteúdo Programático'}</span>
          <h1 className="editorial-h1">
            {isCmcPlan ? 'Edital Verticalizado & Validação' : activePlan?.title || 'Edital'}
          </h1>
          <p className="section-sub">
            {isCmcPlan
              ? `${EDITAL_INFO.organ} · Banca ${EDITAL_INFO.banca} · Prova ${EDITAL_INFO.examDateBR}`
              : `${stats.done}/${stats.total} tópicos concluídos (${stats.pct}%)`}
          </p>
        </div>
        <div className="section-head-actions">
          <div className="edital-progress-pill">
            <span>Edital concluído</span>
            <strong className="mono">{stats.done}/{stats.total} ({stats.pct}%)</strong>
          </div>
          <button type="button" className="btn-ghost" onClick={onCreateCustom}>
            <Icons.Plus size={14} /> Novo tópico
          </button>
        </div>
      </header>

      {/* Official Two-Cargo Comparison Cards */}
      {isCmcPlan && (
        <section className="cargo-grid" aria-label="Estrutura oficial das provas">
          {(['analista', 'tecnico'] as CargoKey[]).map(key => {
            const c = EDITAL_CARGOS[key];
            return (
              <div key={c.key} className="cargo-card">
                <div className="cargo-card-top">
                  <div>
                    <span className="cargo-turno-badge">{c.turno} · {c.duration} · {c.code}</span>
                    <h2 className="cargo-name">{c.name}</h2>
                  </div>
                  <div className="cargo-salary">
                    <strong className="mono">{c.totalMensal}</strong>
                    <span>{c.vencimento} + auxílios</span>
                  </div>
                </div>

                <div className="cargo-meta-line">
                  <span>{c.vagasDetail}</span>
                  <span>·</span>
                  <span>{c.jornada}</span>
                  <span>·</span>
                  <span>Mínimo: {c.minObjetiva}</span>
                </div>

                <div className="cargo-areas-table">
                  {c.areas.map(area => (
                    <div key={area.name} className={`cargo-area-row ${area.weight > 1 ? 'highlight' : ''}`}>
                      <div className="cargo-area-name">
                        <strong>{area.name}</strong>
                        <span>{area.disciplines.join(' · ')}</span>
                      </div>
                      <div className="cargo-area-pts mono">
                        <strong>{area.totalPoints} pts</strong>
                        <span>{area.questions}q × {area.weight.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Validation Audit Findings */}
      {isCmcPlan && (
        <section className="audit-panel">
          <div className="audit-panel-head">
            <div className="audit-title-group">
              <Icons.ShieldCheck size={18} />
              <div>
                <h3>Auditoria Edital × Apostilas Disponíveis</h3>
                <p>Cruzamento real do Anexo V do Edital com os 13 PDFs do Google Drive.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowAudit(v => !v)}
              aria-expanded={showAudit}
            >
              {showAudit ? 'Ocultar auditoria' : 'Mostrar auditoria (5 achados)'}
            </button>
          </div>

          {showAudit && (
            <div className="audit-grid">
              {EDITAL_AUDIT_FINDINGS.map(f => (
                <div key={f.id} className={`audit-card sev-${f.severity}`}>
                  <div className="audit-card-top">
                    <span className={`val-badge status-${f.severity === 'estrategia' ? 'validado' : f.severity}`}>
                      {f.severity === 'lacuna'
                        ? 'Lacuna na Apostila'
                        : f.severity === 'fora-edital'
                        ? 'Fora do Edital'
                        : f.severity === 'atencao'
                        ? 'Atenção'
                        : 'Estratégia'}
                    </span>
                    <span className="audit-cargo-tag">{f.cargo}</span>
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.summary}</p>
                  <div className="audit-action-line">
                    <strong>Recomendação:</strong> {f.action}
                  </div>
                  {f.targetApostilaId && (
                    <button
                      type="button"
                      className="btn-read-page"
                      onClick={() =>
                        onOpenReader({
                          apostilaId: f.targetApostilaId!,
                          pdfPage: f.targetPage || 2,
                          preferredCargo: f.cargo === 'Técnico Legislativo' ? 'tecnico' : 'analista',
                        })
                      }
                    >
                      <Icons.BookOpen size={13} /> Abrir na apostila recomendada
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Filters Toolbar */}
      <div className="lib-toolbar">
        {isCmcPlan && (
          <div className="seg-group" role="tablist" aria-label="Filtrar edital por cargo">
            <button
              type="button"
              role="tab"
              aria-selected={cargoTab === 'analista'}
              className={`seg-btn ${cargoTab === 'analista' ? 'active' : ''}`}
              onClick={() => setCargoTab('analista')}
            >
              Analista TI
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cargoTab === 'tecnico'}
              className={`seg-btn ${cargoTab === 'tecnico' ? 'active' : ''}`}
              onClick={() => setCargoTab('tecnico')}
            >
              Técnico Legislativo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cargoTab === 'all'}
              className={`seg-btn ${cargoTab === 'all' ? 'active' : ''}`}
              onClick={() => setCargoTab('all')}
            >
              Todos
            </button>
          </div>
        )}

        <div className="lib-toolbar-right">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os status</option>
            <option value="pendente">Não iniciados</option>
            <option value="estudando">Estudando</option>
            <option value="concluido">Concluídos</option>
          </select>

          <div className="search-field">
            <Icons.Search size={15} />
            <input
              type="search"
              placeholder="Filtrar tópico do edital..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Filtrar tópico do edital"
            />
          </div>
        </div>
      </div>

      {/* Verticalized Syllabus Matrix */}
      <div className="edital-groups">
        {groups.length === 0 ? (
          <div className="empty-state-box">
            <p>Nenhum tópico corresponde aos filtros atuais.</p>
          </div>
        ) : (
          groups.map(g => {
            const validItems = g.items.filter(i => i.validationStatus !== 'fora-edital');
            const done = validItems.filter(
              i => i.topic.status === 'revisar' || i.topic.status === 'dominado'
            ).length;
            const pct = validItems.length > 0 ? Math.round((done / validItems.length) * 100) : 0;

            return (
              <section key={g.key} className="edital-group-card">
                <div className="edital-group-head">
                  <div>
                    <div className="apostila-badges">
                      {g.code && <span className="ap-code-pill">{g.code}</span>}
                      {g.weight && (
                        <span className={`ap-weight-pill ${g.highWeight ? 'gold' : ''}`}>
                          {g.weight}
                        </span>
                      )}
                    </div>
                    <h3>{g.title}</h3>
                  </div>
                  <div className="edital-group-right">
                    <span className="mono">{done}/{validItems.length} ({pct}%)</span>
                    {g.apostilaId && (
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() =>
                          onOpenReader({
                            apostilaId: g.apostilaId,
                            pdfPage: 2,
                            preferredCargo,
                          })
                        }
                      >
                        <Icons.BookOpen size={14} /> Abrir Apostila
                      </button>
                    )}
                  </div>
                </div>

                <div className="edital-topic-list">
                  {g.items.map(row => {
                    const t = row.topic;
                    const isDone = t.status === 'revisar' || t.status === 'dominado';
                    const isExcluded = row.validationStatus === 'fora-edital';
                    const matched = !g.apostilaId ? findChapterForTopic(t.id, preferredCargo) : null;
                    const targetApId = row.fallbackApostilaId || g.apostilaId || matched?.apostila.id;
                    const targetPdfPage = row.fallbackPdfPage || row.pdfPageStart || matched?.chapter.pdfPageStart || 2;

                    return (
                      <div
                        key={`${g.key}-${t.id}`}
                        className={`edital-topic-row ${isDone ? 'is-done' : ''} ${isExcluded ? 'is-excluded' : ''}`}
                      >
                        <button
                          type="button"
                          className={`status-check ${isDone ? 'checked' : ''}`}
                          onClick={() =>
                            onTopicAction({
                              action: 'toggle_done',
                              id: t.id,
                            })
                          }
                          aria-label={isDone ? `Reabrir ${t.title}` : `Concluir ${t.title}`}
                        >
                          {isDone && <Icons.Check size={12} />}
                        </button>

                        <div className="edital-topic-main">
                          <div className="edital-topic-title">
                            {row.chapterNumber > 0 && (
                              <span className="toc-cap-num mono">
                                Cap. {String(row.chapterNumber).padStart(2, '0')}
                              </span>
                            )}
                            <span>{t.title}</span>
                          </div>
                          <div className="edital-topic-meta">
                            {row.editalRef && (
                              <span className={`val-badge status-${row.validationStatus}`}>
                                {row.editalRef}
                              </span>
                            )}
                            {row.printedPageStart > 0 && (
                              <span className="mono muted">
                                p. {row.printedPageStart}–{row.printedPageEnd}
                              </span>
                            )}
                            {t.minutes_studied > 0 && (
                              <span className="mono muted">{t.minutes_studied} min</span>
                            )}
                            {t.next_review_date && (
                              <span className="muted">Rev. {fmtBR(t.next_review_date)}</span>
                            )}
                          </div>
                          {row.validationNote && (
                            <div className={`toc-note status-${row.validationStatus}`}>
                              <Icons.AlertTriangle size={12} />
                              <span>{row.validationNote}</span>
                            </div>
                          )}
                        </div>

                        <div className="edital-topic-actions">
                          {targetApId && (
                            <button
                              type="button"
                              className="btn-read-page"
                              onClick={() =>
                                onOpenReader({
                                  apostilaId: targetApId,
                                  pdfPage: targetPdfPage,
                                  topicId: t.id,
                                  chapterTitle: t.title,
                                  preferredCargo,
                                })
                              }
                            >
                              <Icons.BookOpen size={13} />{' '}
                              {row.fallbackApostilaId
                                ? 'Ler Legislação'
                                : row.printedPageStart > 0
                                ? `Ler p. ${row.printedPageStart}`
                                : 'Apostila'}
                            </button>
                          )}
                          {!isExcluded && (
                            <>
                              <button
                                type="button"
                                className={`toc-queue-btn ${t.study_queue ? 'queued' : ''}`}
                                onClick={() => onTopicAction({ action: 'toggle_study', id: t.id })}
                              >
                                {t.study_queue ? 'Na fila' : '+ Hoje'}
                              </button>
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => onStartFocus(t)}
                              >
                                Foco
                              </button>
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => onEditTopic(t)}
                              >
                                Editar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
