'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fmtBR, NavTab, PracticeQuestion, StudyPlan, StudyPlanContextCard, Topic } from '../lib/types';
import { Icons } from './Icons';

interface TodayDashboardProps {
  activePlan?: StudyPlan | null;
  topics: Topic[];
  questions: PracticeQuestion[];
  loading: boolean;
  onStartFocus: (topic: Topic) => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
  onAskMentorPlan: () => void;
  onNavigate: (tab: NavTab) => void;
}

export function TodayDashboard({
  activePlan,
  topics,
  questions,
  loading,
  onStartFocus,
  onTopicAction,
  onAskMentorPlan,
  onNavigate,
}: TodayDashboardProps) {
  const [revFilter, setRevFilter] = useState<'hoje' | 'proximas' | 'concluidas'>('hoje');
  const [timerPreset, setTimerPreset] = useState<15 | 25 | 50>(25);
  const [timerSec, setTimerSec] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';

  useEffect(() => {
    if (topics.length > 0) {
      const exists = topics.some(t => t.id === selectedTopicId);
      if (!selectedTopicId || !exists) {
        const firstQueue = topics.find(t => t.study_queue) || topics[0];
        setSelectedTopicId(firstQueue.id);
      }
    }
  }, [topics, selectedTopicId]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSec(prev => (prev <= 1 ? (setTimerRunning(false), 0) : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const today = new Date().toISOString().slice(0, 10);

  const planConfig = useMemo(() => {
    if (!activePlan?.config_json) return { heroTitle: '', contextCards: [] as StudyPlanContextCard[] };
    try {
      const parsed = JSON.parse(activePlan.config_json);
      return {
        heroTitle: String(parsed.heroTitle || ''),
        contextCards: Array.isArray(parsed.contextCards) ? (parsed.contextCards as StudyPlanContextCard[]) : [],
      };
    } catch {
      return { heroTitle: '', contextCards: [] as StudyPlanContextCard[] };
    }
  }, [activePlan]);

  // Subject accuracy calculator combining topic manual stats + practice_questions
  const readiness = useMemo(() => {
    function getAreaStats(subjects: string[]) {
      let right = 0;
      let total = 0;
      topics.filter(t => subjects.includes(t.subject)).forEach(t => {
        right += t.q_right || 0;
        total += t.q_total || 0;
      });
      if (total === 0) {
        questions.filter(q => subjects.includes(q.subject) && q.user_choice).forEach(q => {
          total += 1;
          if (q.is_correct) right += 1;
        });
      }
      return { right, total, acc: total > 0 ? right / total : 0 };
    }

    // Analista TI areas (Item 9.1.3)
    const anlBasicos = getAreaStats(['Língua Portuguesa', 'Raciocínio Lógico e Matemático', 'Noções de Informática']);
    const anlGerais = getAreaStats(['História e Geografia de MT', 'Noções de Ética e Filosofia', 'Relações Interpessoais', 'Noções de Administração Pública']);
    const anlEspec = getAreaStats(['Legislação Municipal', 'Conhecimentos Específicos — Analista TI']);
    const anlScore = Math.round((anlBasicos.acc * 15 + anlGerais.acc * 15 + anlEspec.acc * 70) * 10) / 10;
    const anlZeroArea = anlBasicos.total === 0 || anlGerais.total === 0 || anlEspec.total === 0;

    // Técnico Legislativo areas (Item 9.1.3)
    const tecBasicos = getAreaStats(['Língua Portuguesa', 'Raciocínio Lógico e Matemático', 'Noções de Informática', 'Legislação Municipal']);
    const tecGerais = getAreaStats(['História e Geografia de MT', 'Noções de Ética e Filosofia', 'Relações Interpessoais']);
    const tecEspec = getAreaStats(['Noções de Administração Pública', 'Conhecimentos Específicos — Técnico']);
    const tecScore = Math.round((tecBasicos.acc * 15 + tecGerais.acc * 15 + tecEspec.acc * 70) * 10) / 10;
    const tecZeroArea = tecBasicos.total === 0 || tecGerais.total === 0 || tecEspec.total === 0;

    return {
      anlScore,
      anlBasicosPts: Math.round(anlBasicos.acc * 15 * 10) / 10,
      anlGeraisPts: Math.round(anlGerais.acc * 15 * 10) / 10,
      anlEspecPts: Math.round(anlEspec.acc * 70 * 10) / 10,
      anlZeroArea,
      tecScore,
      tecBasicosPts: Math.round(tecBasicos.acc * 15 * 10) / 10,
      tecGeraisPts: Math.round(tecGerais.acc * 15 * 10) / 10,
      tecEspecPts: Math.round(tecEspec.acc * 70 * 10) / 10,
      tecZeroArea,
    };
  }, [topics, questions]);

  const metrics = useMemo(() => {
    const anl = topics.filter(t => t.overlap !== 'exclusivo-tecnico');
    const tec = topics.filter(t => t.overlap !== 'exclusivo-analista');
    const anlDone = anl.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const tecDone = tec.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const totalDone = topics.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const highPri = topics.filter(t => t.priority === 'alta');
    const highPriDone = highPri.filter(t => t.status === 'revisar' || t.status === 'dominado').length;

    let qRight = 0;
    let qTotal = 0;
    let mins = 0;
    topics.forEach(t => {
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
      anlPct: anl.length ? Math.round((anlDone / anl.length) * 100) : 0,
      anlDone,
      anlTotal: anl.length,
      tecPct: tec.length ? Math.round((tecDone / tec.length) * 100) : 0,
      tecDone,
      tecTotal: tec.length,
      highPriPct: highPri.length ? Math.round((highPriDone / highPri.length) * 100) : 0,
      highPriDone,
      highPriTotal: highPri.length,
      overallPct: topics.length ? Math.round((totalDone / topics.length) * 100) : 0,
      totalDone,
      totalTopics: topics.length,
      qRight,
      qTotal,
      accPct: qTotal ? Math.round((qRight / qTotal) * 100) : 0,
      hours: Math.floor(mins / 60),
      minsRem: mins % 60,
    };
  }, [topics, questions]);

  const studyQueue = useMemo(() => topics.filter(t => t.study_queue), [topics]);
  const dueReviews = useMemo(
    () => topics.filter(t => t.review_queue && (!t.next_review_date || t.next_review_date <= today)),
    [topics, today]
  );
  const upcomingReviews = useMemo(
    () => topics.filter(t => t.review_queue && t.next_review_date > today).sort((a, b) => a.next_review_date.localeCompare(b.next_review_date)),
    [topics, today]
  );
  const completedReviews = useMemo(
    () => topics.filter(t => t.status === 'dominado'),
    [topics]
  );

  const visibleReviews = revFilter === 'hoje' ? dueReviews : revFilter === 'proximas' ? upcomingReviews : completedReviews;

  const totalPresetSec = timerPreset * 60;
  const timerProgress = totalPresetSec > 0 ? ((totalPresetSec - timerSec) / totalPresetSec) * 100 : 0;
  const ringRadius = 46;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (timerProgress / 100) * ringCirc;

  function selectPreset(mins: 15 | 25 | 50) {
    setTimerRunning(false);
    setTimerPreset(mins);
    setTimerSec(mins * 60);
  }

  async function finishTimerSession() {
    const elapsedMin = Math.max(1, Math.round((totalPresetSec - timerSec) / 60) || timerPreset);
    setTimerRunning(false);
    setTimerSec(totalPresetSec);
    if (selectedTopicId) {
      await onTopicAction({ action: 'log_timer', id: selectedTopicId, minutes: elapsedMin });
    }
  }

  const syllabusWord = activePlan?.syllabus_label || 'Edital';

  return (
    <div className="ds-container">
      {/* 0. PIERRE EDITORIAL HERO & CONTEXT CARDS */}
      <section className="pierre-hero">
        <div className="pierre-hero-top">
          <div>
            <div className="pierre-eyebrow">
              <span className="pierre-live-dot" />
              <span>{activePlan?.subtitle || 'Seus agentes trabalhando pela sua aprovação · Instituto Selecon'}</span>
            </div>
            <h1 className="pierre-hero-title">
              {planConfig.heroTitle || 'Você foca na leitura. O Mentor organiza sua nota.'}
            </h1>
          </div>
          <div className="flex-row">
            <button onClick={() => onNavigate('pratica')} className="ds-btn ds-btn-secondary">
              <Icons.Check size={15} /> {questions.length > 0 ? `Questões (${questions.length})` : 'Prática'}
            </button>
            <button onClick={onAskMentorPlan} className="ds-btn ds-btn-primary">
              <Icons.Sparkles size={15} /> Ajustar com Mentor
            </button>
          </div>
        </div>

        {isCmcPlan ? (
          <div className="pierre-agents-strip">
            <div className="pierre-agent-pill">
              <div className="flex-row" style={{ gap: 10 }}>
                <span className="agent-dot-avatar">TI</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Manhã · Analista de TI</div>
                  <div className="text-xs muted">Legislação + TI valem 70% da prova (peso 1,75)</div>
                </div>
              </div>
              <span className="ds-badge ds-badge-green">{readiness.anlScore} pts</span>
            </div>

            <div className="pierre-agent-pill">
              <div className="flex-row" style={{ gap: 10 }}>
                <span className="agent-dot-avatar">TL</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Tarde · Técnico Legislativo</div>
                  <div className="text-xs muted">Adm. Pública + Específicos valem 70% (peso 1,75)</div>
                </div>
              </div>
              <span className="ds-badge ds-badge-green">{readiness.tecScore} pts</span>
            </div>

            <div className="pierre-agent-pill">
              <div className="flex-row" style={{ gap: 10 }}>
                <span className="agent-dot-avatar">REV</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Revisões Agendadas</div>
                  <div className="text-xs muted">
                    {dueReviews.length > 0 ? `${dueReviews.length} revisão(ões) pendente(s) hoje` : 'Revisões em dia'}
                  </div>
                </div>
              </div>
              <span className={`ds-badge ${dueReviews.length > 0 ? 'ds-badge-amber' : 'ds-badge-neutral'}`}>
                {dueReviews.length} hoje
              </span>
            </div>
          </div>
        ) : (
          <div className="pierre-agents-strip">
            {(planConfig.contextCards.length > 0
              ? planConfig.contextCards
              : [
                  { tag: 'FOCO', title: 'Prioridades', sub: `${metrics.highPriDone}/${metrics.highPriTotal} tópicos essenciais`, pill: `${metrics.highPriPct}%` },
                  { tag: 'PRAT', title: 'Exercícios & Cartões', sub: `${questions.length} questões disponíveis`, pill: `${metrics.accPct}% acerto` },
                  { tag: 'REV', title: 'Para revisar hoje', sub: dueReviews.length ? `${dueReviews.length} pendente(s)` : 'Em dia', pill: `${dueReviews.length} hoje` },
                ]
            ).map((c, idx) => (
              <div key={idx} className="pierre-agent-pill">
                <div className="flex-row" style={{ gap: 10 }}>
                  <span className="agent-dot-avatar">{c.tag}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                    <div className="text-xs muted">{c.sub}</div>
                  </div>
                </div>
                <span className="ds-badge ds-badge-green">{c.pill}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 1. CABEÇALHO DE DESEMPENHO (ORGÂNICO CONFORME O ESTUDO) */}
      {isCmcPlan ? (
        <div className="kpi-bento">
          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Analista de TI</span>
              <span className="ds-badge ds-badge-indigo">{metrics.anlDone}/{metrics.anlTotal}</span>
            </div>
            <div className="kpi-value">{metrics.anlPct}%</div>
            <div className="ds-progress"><div className="ds-progress-fill indigo" style={{ width: `${metrics.anlPct}%` }} /></div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Técnico Legislativo</span>
              <span className="ds-badge ds-badge-blue">{metrics.tecDone}/{metrics.tecTotal}</span>
            </div>
            <div className="kpi-value">{metrics.tecPct}%</div>
            <div className="ds-progress"><div className="ds-progress-fill blue" style={{ width: `${metrics.tecPct}%` }} /></div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Desempenho Geral</span>
              <span className="ds-badge ds-badge-green">Edital</span>
            </div>
            <div className="kpi-value">{metrics.overallPct}%</div>
            <div className="ds-progress"><div className="ds-progress-fill green" style={{ width: `${metrics.overallPct}%` }} /></div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Questões &amp; Acertos</span>
              <span className="ds-badge ds-badge-neutral">{metrics.qTotal} feitas</span>
            </div>
            <div className="kpi-value">{metrics.qTotal > 0 ? `${metrics.accPct}%` : '—'}</div>
            <div className="kpi-sub">{metrics.qRight} acertos registrados</div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Tempo Total</span>
              <span className="ds-badge ds-badge-neutral">Foco</span>
            </div>
            <div className="kpi-value">{metrics.hours}h {String(metrics.minsRem).padStart(2, '0')}m</div>
            <div className="kpi-sub">Acumulado em sessões</div>
          </div>
        </div>
      ) : (
        <div className="kpi-bento">
          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Tópicos Prioritários</span>
              <span className="ds-badge ds-badge-indigo">{metrics.highPriDone}/{metrics.highPriTotal}</span>
            </div>
            <div className="kpi-value">{metrics.highPriPct}%</div>
            <div className="ds-progress"><div className="ds-progress-fill indigo" style={{ width: `${metrics.highPriPct}%` }} /></div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">{syllabusWord} Concluída</span>
              <span className="ds-badge ds-badge-green">{metrics.totalDone}/{metrics.totalTopics}</span>
            </div>
            <div className="kpi-value">{metrics.overallPct}%</div>
            <div className="ds-progress"><div className="ds-progress-fill green" style={{ width: `${metrics.overallPct}%` }} /></div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Taxa de Acerto</span>
              <span className="ds-badge ds-badge-neutral">{metrics.qTotal} feitas</span>
            </div>
            <div className="kpi-value">{metrics.qTotal > 0 ? `${metrics.accPct}%` : '—'}</div>
            <div className="kpi-sub">{metrics.qRight} acertos registrados</div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Meta Diária</span>
              <span className="ds-badge ds-badge-blue">Rotina</span>
            </div>
            <div className="kpi-value" style={{ fontSize: 22 }}>{activePlan?.daily_hours || '2h/dia'}</div>
            <div className="kpi-sub">{studyQueue.length} atividade(s) para hoje</div>
          </div>

          <div className="kpi-tile">
            <div className="kpi-top">
              <span className="kpi-label">Tempo Estudado</span>
              <span className="ds-badge ds-badge-neutral">Foco</span>
            </div>
            <div className="kpi-value">{metrics.hours}h {String(metrics.minsRem).padStart(2, '0')}m</div>
            <div className="kpi-sub">Acumulado neste estudo</div>
          </div>
        </div>
      )}

      {/* 1.5 TERMÔMETRO DE NOTA PROJETADA (SOMENTE PARA CMC 2026 OU ESTUDOS COM QUESTÕES) */}
      {isCmcPlan && (
        <div className="bento-two">
          <div className="ds-card ds-card-body">
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Nota Projetada · Analista TI (100 pts)</div>
                <div className="text-xs muted">Básicos {readiness.anlBasicosPts}/15 · Gerais {readiness.anlGeraisPts}/15 · Específicos {readiness.anlEspecPts}/70 (peso 1,75)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{readiness.anlScore}</span>
                <span className="text-xs muted"> /100</span>
              </div>
            </div>
            <div className="ds-progress" style={{ height: 8, marginBottom: 8 }}>
              <div className="ds-progress-fill indigo" style={{ width: `${Math.min(100, readiness.anlScore)}%` }} />
            </div>
            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <span className={`ds-badge ${readiness.anlScore >= 75 ? 'ds-badge-green' : readiness.anlScore >= 40 && !readiness.anlZeroArea ? 'ds-badge-amber' : 'ds-badge-neutral'}`}>
                {readiness.anlScore >= 75 ? 'Competitivo (Top 100)' : readiness.anlScore >= 40 && !readiness.anlZeroArea ? 'Acima do corte (40 pts)' : 'Pratique questões nas 3 áreas'}
              </span>
              <button onClick={() => onNavigate('pratica')} className="ds-btn ds-btn-ghost ds-btn-sm">Praticar 200 Questões →</button>
            </div>
          </div>

          <div className="ds-card ds-card-body">
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Nota Projetada · Técnico Leg. (100 pts)</div>
                <div className="text-xs muted">Básicos {readiness.tecBasicosPts}/15 · Gerais {readiness.tecGeraisPts}/15 · Específicos {readiness.tecEspecPts}/70 (peso 1,75)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{readiness.tecScore}</span>
                <span className="text-xs muted"> /100</span>
              </div>
            </div>
            <div className="ds-progress" style={{ height: 8, marginBottom: 8 }}>
              <div className="ds-progress-fill blue" style={{ width: `${Math.min(100, readiness.tecScore)}%` }} />
            </div>
            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <span className={`ds-badge ${readiness.tecScore >= 75 ? 'ds-badge-green' : readiness.tecScore >= 40 && !readiness.tecZeroArea ? 'ds-badge-amber' : 'ds-badge-neutral'}`}>
                {readiness.tecScore >= 75 ? 'Competitivo (Top 220)' : readiness.tecScore >= 40 && !readiness.tecZeroArea ? 'Acima do corte (40 pts)' : 'Pratique questões nas 3 áreas'}
              </span>
              <button onClick={() => onNavigate('pratica')} className="ds-btn ds-btn-ghost ds-btn-sm">Cartões de Memória →</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BENTO PRINCIPAL: PLANO DE HOJE + POMODORO */}
      <div className="bento-main">
        {/* SEU PLANO DE HOJE */}
        <section className="ds-card">
          <div className="ds-card-header">
            <div>
              <h2 className="ds-card-title">Seu plano de hoje</h2>
              <p className="ds-card-desc">
                {isCmcPlan ? 'Atividades priorizadas para os dois cargos' : `Atividades organizadas para ${activePlan?.title || 'seu estudo'}`}
              </p>
            </div>
            <div className="flex-row">
              <button onClick={() => onNavigate('edital')} className="ds-btn ds-btn-ghost ds-btn-sm">
                <Icons.Plus size={14} /> Escolher em {syllabusWord}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="ds-card-body space-y">
              <div className="ds-skeleton" style={{ height: 60 }} />
              <div className="ds-skeleton" style={{ height: 60 }} />
            </div>
          ) : studyQueue.length === 0 ? (
            <div className="empty-box">
              <div className="empty-icon"><Icons.Sparkles size={20} /></div>
              <div className="empty-title">Nenhum bloco definido para hoje</div>
              <p className="empty-desc">
                Peça ao Mentor para montar seu plano diário com base nas suas prioridades e revisões pendentes.
              </p>
              <button onClick={onAskMentorPlan} className="ds-btn ds-btn-primary">
                <Icons.Sparkles size={15} /> Gerar meu plano de hoje
              </button>
            </div>
          ) : (
            <div className="activity-list">
              {studyQueue.map(t => {
                const estMin = t.priority === 'alta' ? 45 : 30;
                const priCls = t.priority === 'alta' ? 'ds-badge-amber' : 'ds-badge-neutral';
                const priTxt = t.priority === 'alta' ? 'Alta prioridade' : t.priority === 'media' ? 'Média' : 'Revisão rápida';
                return (
                  <div key={t.id} className="activity-row">
                    <div className="activity-info">
                      <div className="activity-meta">
                        <span className="activity-subject">{t.subject}</span>
                        <span className={`ds-badge ${priCls}`}>{priTxt}</span>
                        <span className="ds-badge ds-badge-neutral"><Icons.Clock size={12} /> {estMin} min</span>
                      </div>
                      <div className="activity-title">{t.title}</div>
                    </div>
                    <div className="activity-actions">
                      <button onClick={() => onStartFocus(t)} className="ds-btn ds-btn-primary ds-btn-sm">
                        <Icons.Play size={13} /> Começar
                      </button>
                      <button
                        onClick={() => onTopicAction({ action: 'complete_study', id: t.id, minutes: estMin })}
                        className="ds-btn ds-btn-secondary ds-btn-sm"
                        title="Concluir e agendar revisão para amanhã"
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

        {/* POMODORO FOCUS WIDGET */}
        <section className="ds-card pomodoro-card">
          <div className="ds-card-header">
            <div>
              <h2 className="ds-card-title">Sessão de foco</h2>
              <p className="ds-card-desc">Registre seu tempo de estudo com um toque</p>
            </div>
            <div className="preset-group">
              {([15, 25, 50] as const).map(m => (
                <button
                  key={m}
                  onClick={() => selectPreset(m)}
                  className={`preset-pill ${timerPreset === m ? 'active' : ''}`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="ds-card-body pomodoro-body">
            <div className="pomodoro-ring-wrap">
              <svg width="116" height="116" viewBox="0 0 116 116">
                <circle className="ring-bg" cx="58" cy="58" r={ringRadius} strokeWidth="7" fill="none" />
                <circle
                  className={`ring-fg ${timerRunning ? 'running' : ''}`}
                  cx="58"
                  cy="58"
                  r={ringRadius}
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={ringCirc}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 58 58)"
                />
              </svg>
              <div className="ring-time">
                {String(Math.floor(timerSec / 60)).padStart(2, '0')}:{String(timerSec % 60).padStart(2, '0')}
              </div>
            </div>

            <div className="pomodoro-controls">
              <label className="field-label" htmlFor="pomo-topic">Assunto da sessão</label>
              <select
                id="pomo-topic"
                className="ds-select"
                value={selectedTopicId}
                onChange={e => setSelectedTopicId(e.target.value)}
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 48)}</option>
                ))}
              </select>

              <div className="flex-row" style={{ marginTop: 10 }}>
                <button onClick={() => setTimerRunning(r => !r)} className="ds-btn ds-btn-primary" style={{ flex: 1 }}>
                  {timerRunning ? <><Icons.Pause size={14} /> Pausar</> : <><Icons.Play size={14} /> Iniciar</>}
                </button>
                <button onClick={finishTimerSession} className="ds-btn ds-btn-secondary">
                  Salvar tempo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. REVISÕES AGENDADAS */}
      <section className="ds-card">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Para revisar</h2>
            <p className="ds-card-desc">Conteúdos estudados anteriormente que precisam ser reforçados</p>
          </div>
          <div className="ds-segmented">
            <button className={`ds-seg-item ${revFilter === 'hoje' ? 'active' : ''}`} onClick={() => setRevFilter('hoje')}>
              Hoje ({dueReviews.length})
            </button>
            <button className={`ds-seg-item ${revFilter === 'proximas' ? 'active' : ''}`} onClick={() => setRevFilter('proximas')}>
              Próximas ({upcomingReviews.length})
            </button>
            <button className={`ds-seg-item ${revFilter === 'concluidas' ? 'active' : ''}`} onClick={() => setRevFilter('concluidas')}>
              Dominadas ({completedReviews.length})
            </button>
          </div>
        </div>

        {visibleReviews.length === 0 ? (
          <div className="ds-card-body muted text-sm">
            {revFilter === 'hoje'
              ? 'Nenhuma revisão pendente para hoje. Conclua uma atividade acima para agendar a revisão de amanhã.'
              : revFilter === 'proximas'
              ? 'Nenhuma revisão futura agendada ainda.'
              : 'Nenhum conteúdo concluído no ciclo final ainda.'}
          </div>
        ) : (
          <div className="timeline-list">
            {visibleReviews.map(t => {
              const step = t.review_interval || 1;
              const lowAcc = t.q_total >= 4 && (t.q_right / t.q_total) < 0.6;
              return (
                <div key={t.id} className="timeline-row">
                  <div className="timeline-step">
                    <span className={`step-dot ${lowAcc ? 'warn' : revFilter === 'hoje' ? 'warn' : revFilter === 'concluidas' ? 'green' : 'indigo'}`} />
                    <span className="step-label">{revFilter === 'concluidas' ? 'Dominado' : `+${step}d`}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="text-xs muted">
                      {t.subject} {t.next_review_date ? `· ${fmtBR(t.next_review_date)}` : ''}
                      {lowAcc && <span className="ds-badge ds-badge-red" style={{ marginLeft: 6 }}>Reforçar</span>}
                    </div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                  </div>
                  <div className="timeline-actions">
                    {revFilter !== 'concluidas' && (
                      <>
                        <button
                          onClick={() => onTopicAction({ action: 'complete_review', id: t.id, grade: 'hard' })}
                          className="ds-btn ds-btn-ghost ds-btn-sm"
                          title="Rever novamente amanhã"
                        >
                          Rever amanhã
                        </button>
                        <button onClick={() => onTopicAction({ action: 'complete_review', id: t.id, grade: 'good' })} className="ds-btn ds-btn-secondary ds-btn-sm">
                          <Icons.Check size={14} /> Revisado
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
  );
}
