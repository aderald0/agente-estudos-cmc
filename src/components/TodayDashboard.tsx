'use client';

import React, { useMemo, useState } from 'react';
import {
  EDITAL_INFO,
  findChapterForTopic,
  getApostilaById,
} from '../lib/apostilasCatalog';
import { StoredApostilaMeta } from '../lib/pdfStorage';
import {
  fmtBR,
  NavTab,
  PracticeQuestion,
  ReaderTarget,
  StudyPlan,
  Topic,
} from '../lib/types';
import { Icons } from './Icons';

interface TodayDashboardProps {
  activePlan?: StudyPlan | null;
  topics: Topic[];
  questions: PracticeQuestion[];
  storedMap: Record<string, StoredApostilaMeta>;
  loading: boolean;
  onStartFocus: (topic: Topic) => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
  onAskMentorPlan: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenReader: (target: ReaderTarget) => void;
}

export function TodayDashboard({
  activePlan,
  topics,
  questions,
  storedMap,
  loading,
  onStartFocus,
  onTopicAction,
  onAskMentorPlan,
  onNavigate,
  onOpenReader,
}: TodayDashboardProps) {
  const [revFilter, setRevFilter] = useState<'hoje' | 'proximas' | 'dominadas'>('hoje');
  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';
  const today = new Date().toISOString().slice(0, 10);

  const daysLeft = useMemo(() => {
    const target = activePlan?.target_date || EDITAL_INFO.examDate;
    const diff = Math.ceil((new Date(`${target}T12:00:00`).getTime() - Date.now()) / 86400000);
    return Math.max(0, diff);
  }, [activePlan]);

  const metrics = useMemo(() => {
    const valid = topics.filter(t => t.id !== 'tec-cap-9');
    const anl = valid.filter(t => t.overlap !== 'exclusivo-tecnico');
    const tec = valid.filter(t => t.overlap !== 'exclusivo-analista');
    const isDone = (t: Topic) => t.status === 'revisar' || t.status === 'dominado';

    const anlDone = anl.filter(isDone).length;
    const tecDone = tec.filter(isDone).length;
    const totalDone = valid.filter(isDone).length;

    let qRight = 0;
    let qTotal = 0;
    let mins = 0;
    valid.forEach(t => {
      qRight += t.q_right || 0;
      qTotal += t.q_total || 0;
      mins += t.minutes_studied || 0;
    });
    if (qTotal === 0) {
      questions.filter(q => q.user_choice).forEach(q => {
        qTotal += 1;
        if (q.is_correct) qRight += 1;
      });
    }

    return {
      anlDone,
      anlTotal: anl.length,
      anlPct: anl.length ? Math.round((anlDone / anl.length) * 100) : 0,
      tecDone,
      tecTotal: tec.length,
      tecPct: tec.length ? Math.round((tecDone / tec.length) * 100) : 0,
      totalDone,
      totalTopics: valid.length,
      overallPct: valid.length ? Math.round((totalDone / valid.length) * 100) : 0,
      qRight,
      qTotal,
      accPct: qTotal ? Math.round((qRight / qTotal) * 100) : 0,
      hours: Math.floor(mins / 60),
      minsRem: mins % 60,
    };
  }, [topics, questions]);

  const studyQueue = useMemo(
    () => topics.filter(t => t.study_queue && t.id !== 'tec-cap-9'),
    [topics]
  );

  const reviewItems = useMemo(() => {
    if (revFilter === 'dominadas') {
      return topics.filter(t => t.status === 'dominado');
    }
    const inRev = topics.filter(t => t.review_queue);
    if (revFilter === 'hoje') {
      return inRev.filter(t => !t.next_review_date || t.next_review_date <= today);
    }
    return inRev.filter(t => t.next_review_date && t.next_review_date > today);
  }, [topics, revFilter, today]);

  const dueTodayCount = useMemo(
    () => topics.filter(t => t.review_queue && (!t.next_review_date || t.next_review_date <= today)).length,
    [topics, today]
  );

  const highWeightApostilas = useMemo(() => {
    const ids = ['ap-legislacao', 'ap-especificos-ti', 'ap-especificos-tecnico'];
    return ids.map(id => getApostilaById(id)).filter(Boolean);
  }, []);

  if (loading && topics.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="spinner" />
        <p>Carregando seu plano de estudos...</p>
      </div>
    );
  }

  return (
    <div className="today-view">
      {/* Editorial Hero Strip */}
      <section className="today-hero">
        <div className="today-hero-left">
          <span className="eyebrow">
            {isCmcPlan ? 'CÂMARA MUNICIPAL DE CUIABÁ · PROVA 20/12/2026' : activePlan?.subtitle || 'PLANO DE ESTUDOS'}
          </span>
          <h1 className="editorial-h1">
            {isCmcPlan ? 'Painel de Estudo & Leitura Direta' : activePlan?.title || 'Hoje'}
          </h1>
          <p className="today-hero-sub">
            Abra qualquer matéria da sua fila direto na página certa da apostila, cronometre a sessão e marque revisões automáticas.
          </p>
          <div className="today-hero-actions">
            <button type="button" className="btn-primary" onClick={() => onNavigate('apostilas')}>
              <Icons.Library size={16} /> Abrir Biblioteca de Apostilas
            </button>
            <button type="button" className="btn-ghost" onClick={() => onNavigate('edital')}>
              <Icons.ShieldCheck size={15} /> Ver Edital &amp; Validação
            </button>
            <button type="button" className="btn-ghost" onClick={onAskMentorPlan}>
              <Icons.Sparkles size={15} /> Montar meta com Mentor
            </button>
          </div>
        </div>

        <div className="today-kpi-strip">
          <div className="kpi-tile">
            <span className="kpi-label">Contagem</span>
            <strong className="kpi-value mono">{daysLeft}d</strong>
            <span className="kpi-sub">até {isCmcPlan ? '20/12/2026' : fmtBR(activePlan?.target_date || '')}</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Analista TI</span>
            <strong className="kpi-value mono">{metrics.anlPct}%</strong>
            <span className="kpi-sub">{metrics.anlDone}/{metrics.anlTotal} capítulos</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Técnico Leg.</span>
            <strong className="kpi-value mono">{metrics.tecPct}%</strong>
            <span className="kpi-sub">{metrics.tecDone}/{metrics.tecTotal} capítulos</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Tempo &amp; Questões</span>
            <strong className="kpi-value mono">
              {metrics.hours}h{String(metrics.minsRem).padStart(2, '0')}
            </strong>
            <span className="kpi-sub">
              {metrics.qTotal > 0 ? `${metrics.accPct}% em ${metrics.qTotal}q` : '0 questões ainda'}
            </span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Workspace: Today's Study Queue + Reviews */}
      <div className="today-grid">
        {/* Left: Study Queue with 1-click Open in Apostila */}
        <section className="panel-card">
          <div className="panel-head">
            <div>
              <h2>Fila de Estudo de Hoje</h2>
              <p className="muted">
                {studyQueue.length === 0
                  ? 'Nenhum capítulo na fila hoje — escolha matérias na Biblioteca de Apostilas.'
                  : `${studyQueue.length} capítulo(s) selecionado(s) para estudar agora`}
              </p>
            </div>
            <button type="button" className="btn-ghost" onClick={() => onNavigate('apostilas')}>
              + Escolher capítulos
            </button>
          </div>

          {studyQueue.length === 0 ? (
            <div className="empty-inline">
              <p>Sua fila está limpa. Abra o sumário das apostilas e adicione os próximos capítulos de peso 1,75.</p>
              <button type="button" className="btn-primary-sm" onClick={() => onNavigate('apostilas')}>
                Ir para Apostilas
              </button>
            </div>
          ) : (
            <div className="queue-list">
              {studyQueue.map(t => {
                const match = isCmcPlan ? findChapterForTopic(t.id, t.overlap === 'exclusivo-tecnico' ? 'tecnico' : 'analista') : null;
                const targetApId = match?.chapter.fallbackApostilaId || match?.apostila.id;
                const targetPdfPage = match?.chapter.fallbackPdfPage || match?.chapter.pdfPageStart || 2;
                const printedStart = match?.chapter.printedPageStart;
                const printedEnd = match?.chapter.printedPageEnd;

                return (
                  <div key={t.id} className="queue-item">
                    <div className="queue-item-main">
                      <div className="queue-item-meta">
                        <span className="ap-code-pill">{t.subject}</span>
                        {match && (
                          <span className="mono muted">
                            Cap. {String(match.chapter.chapterNumber).padStart(2, '0')} · p. {printedStart}–{printedEnd}
                          </span>
                        )}
                      </div>
                      <h3 className="queue-item-title">{t.title}</h3>
                      {match?.chapter.validationNote && (
                        <p className="queue-item-warn">
                          <Icons.AlertTriangle size={12} /> {match.chapter.validationNote}
                        </p>
                      )}
                    </div>

                    <div className="queue-item-actions">
                      {targetApId && (
                        <button
                          type="button"
                          className="btn-primary-sm"
                          onClick={() =>
                            onOpenReader({
                              apostilaId: targetApId,
                              pdfPage: targetPdfPage,
                              topicId: t.id,
                              chapterTitle: t.title,
                              preferredCargo: t.overlap === 'exclusivo-tecnico' ? 'tecnico' : 'analista',
                            })
                          }
                        >
                          <Icons.BookOpen size={14} /> Abrir Apostila
                        </button>
                      )}
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
                        onClick={() => onTopicAction({ action: 'complete_study', id: t.id, minutes: 30 })}
                        title="Marcar estudo concluído e agendar revisão +1d"
                      >
                        <Icons.Check size={14} /> Concluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right: Spaced Reviews */}
        <section className="panel-card">
          <div className="panel-head">
            <div>
              <h2>Revisões Espaçadas</h2>
              <p className="muted">Ciclo automático 1d → 3d → 7d → 15d → Dominado</p>
            </div>
            <div className="seg-group compact">
              <button
                type="button"
                className={`seg-btn ${revFilter === 'hoje' ? 'active' : ''}`}
                onClick={() => setRevFilter('hoje')}
              >
                Hoje ({dueTodayCount})
              </button>
              <button
                type="button"
                className={`seg-btn ${revFilter === 'proximas' ? 'active' : ''}`}
                onClick={() => setRevFilter('proximas')}
              >
                Próximas
              </button>
              <button
                type="button"
                className={`seg-btn ${revFilter === 'dominadas' ? 'active' : ''}`}
                onClick={() => setRevFilter('dominadas')}
              >
                Dominadas
              </button>
            </div>
          </div>

          {reviewItems.length === 0 ? (
            <div className="empty-inline">
              <p>
                {revFilter === 'hoje'
                  ? 'Nenhuma revisão atrasada para hoje. Conclua capítulos na fila para iniciar o ciclo.'
                  : revFilter === 'proximas'
                  ? 'Sem revisões agendadas para os próximos dias.'
                  : 'Nenhum tópico dominado ainda (ciclo completo até +15d).'}
              </p>
            </div>
          ) : (
            <div className="queue-list">
              {reviewItems.slice(0, 8).map(t => {
                const match = isCmcPlan ? findChapterForTopic(t.id) : null;
                return (
                  <div key={t.id} className="queue-item compact">
                    <div className="queue-item-main">
                      <div className="queue-item-meta">
                        <span className="ap-code-pill">{t.subject}</span>
                        <span className="mono muted">
                          {t.next_review_date ? `Rev. ${fmtBR(t.next_review_date)}` : 'Dominado'}
                        </span>
                      </div>
                      <h3 className="queue-item-title">{t.title}</h3>
                    </div>
                    <div className="queue-item-actions">
                      {match && (
                        <button
                          type="button"
                          className="btn-read-page"
                          onClick={() =>
                            onOpenReader({
                              apostilaId: match.chapter.fallbackApostilaId || match.apostila.id,
                              pdfPage: match.chapter.fallbackPdfPage || match.chapter.pdfPageStart,
                              topicId: t.id,
                            })
                          }
                        >
                          <Icons.BookOpen size={13} /> p. {match.chapter.printedPageStart}
                        </button>
                      )}
                      {revFilter !== 'dominadas' && (
                        <>
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => onTopicAction({ action: 'complete_review', id: t.id, grade: 'hard' })}
                          >
                            Reforçar
                          </button>
                          <button
                            type="button"
                            className="btn-primary-sm"
                            onClick={() => onTopicAction({ action: 'complete_review', id: t.id, grade: 'good' })}
                          >
                            <Icons.Check size={13} /> Rev. feita
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* High-Weight Apostilas Quick Launch (70% of Exam Score) */}
      {isCmcPlan && (
        <section className="priority-shelf">
          <div className="panel-head">
            <div>
              <h2>Núcleo de Peso 1,75 (70% da Prova + Discursiva)</h2>
              <p className="muted">Acesso imediato às três apostilas decisivas da manhã e da tarde</p>
            </div>
            <button type="button" className="btn-ghost" onClick={() => onNavigate('apostilas')}>
              Ver todas as 11 apostilas →
            </button>
          </div>

          <div className="priority-cards-grid">
            {highWeightApostilas.map(ap => {
              if (!ap) return null;
              const stored = storedMap[ap.id];
              const validCh = ap.chapters.filter(c => c.validationStatus !== 'fora-edital');
              const done = validCh.filter(c => {
                const t = topics.find(x => x.id === c.topicId);
                return t?.status === 'revisar' || t?.status === 'dominado';
              }).length;
              const pct = validCh.length ? Math.round((done / validCh.length) * 100) : 0;

              return (
                <div key={ap.id} className="priority-ap-card">
                  <div className="apostila-badges">
                    <span className="ap-code-pill">{ap.codeAnl || ap.codeTec}</span>
                    <span className="ap-weight-pill gold">Peso 1,75</span>
                    <span className={`ap-source-pill ${stored ? 'offline' : 'drive'}`}>
                      {stored ? 'Offline' : 'Drive'}
                    </span>
                  </div>
                  <h3>{ap.title}</h3>
                  <p className="muted">{validCh.length} capítulos válidos · {ap.totalPages} páginas</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="priority-ap-footer">
                    <span className="mono">{done}/{validCh.length} ({pct}%)</span>
                    <button
                      type="button"
                      className="btn-primary-sm"
                      onClick={() =>
                        onOpenReader({
                          apostilaId: ap.id,
                          pdfPage: 2,
                          preferredCargo: ap.cargoScope === 'tecnico' ? 'tecnico' : 'analista',
                        })
                      }
                    >
                      <Icons.BookOpen size={14} /> Abrir agora
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
