'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fmtBR, NavTab, Topic } from '../lib/types';
import { Icons } from './Icons';

interface TodayDashboardProps {
  topics: Topic[];
  loading: boolean;
  onStartFocus: (topic: Topic) => void;
  onTopicAction: (payload: Record<string, unknown>) => Promise<void>;
  onAskMentorPlan: () => void;
  onNavigate: (tab: NavTab) => void;
}

export function TodayDashboard({
  topics,
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

  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      const firstQueue = topics.find(t => t.study_queue) || topics[0];
      setSelectedTopicId(firstQueue.id);
    }
  }, [topics, selectedTopicId]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSec(prev => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const today = new Date().toISOString().slice(0, 10);

  const metrics = useMemo(() => {
    const anl = topics.filter(t => t.overlap !== 'exclusivo-tecnico');
    const tec = topics.filter(t => t.overlap !== 'exclusivo-analista');
    const anlDone = anl.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const tecDone = tec.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const totalDone = topics.filter(t => t.status === 'revisar' || t.status === 'dominado').length;

    let qRight = 0;
    let qTotal = 0;
    let mins = 0;
    topics.forEach(t => {
      qRight += t.q_right || 0;
      qTotal += t.q_total || 0;
      mins += t.minutes_studied || 0;
    });

    return {
      anlPct: anl.length ? Math.round((anlDone / anl.length) * 100) : 0,
      anlDone,
      anlTotal: anl.length,
      tecPct: tec.length ? Math.round((tecDone / tec.length) * 100) : 0,
      tecDone,
      tecTotal: tec.length,
      overallPct: topics.length ? Math.round((totalDone / topics.length) * 100) : 0,
      qRight,
      qTotal,
      accPct: qTotal ? Math.round((qRight / qTotal) * 100) : 0,
      hours: Math.floor(mins / 60),
      minsRem: mins % 60,
    };
  }, [topics]);

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

  return (
    <div className="ds-container">
      {/* 1. CABEÇALHO DE DESEMPENHO */}
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

      {/* 2. BENTO PRINCIPAL: PLANO DE HOJE + POMODORO */}
      <div className="bento-main">
        {/* SEU PLANO DE HOJE */}
        <section className="ds-card">
          <div className="ds-card-header">
            <div>
              <h2 className="ds-card-title">Seu plano de hoje</h2>
              <p className="ds-card-desc">Atividades priorizadas para os dois cargos</p>
            </div>
            <div className="flex-row">
              <button onClick={() => onNavigate('edital')} className="ds-btn ds-btn-ghost ds-btn-sm">
                <Icons.Plus size={14} /> Escolher no Edital
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
                Peça ao Mentor para montar seu plano diário com base nos pesos do edital e revisões pendentes.
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
                        <span className="ds-badge ds-badge-blue">
                          {t.status === 'estudando' ? 'Em andamento' : 'Pendente'}
                        </span>
                      </div>
                      <div className="activity-title">{t.title}</div>
                    </div>
                    <div className="activity-actions">
                      <button onClick={() => onStartFocus(t)} className="ds-btn ds-btn-primary ds-btn-sm">
                        <Icons.Play size={13} /> Iniciar
                      </button>
                      <button
                        onClick={() => onTopicAction({ action: 'complete_study', id: t.id, minutes: estMin })}
                        className="ds-btn ds-btn-secondary ds-btn-sm"
                        title="Concluir e agendar revisão +1 dia"
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
              <h2 className="ds-card-title">Timer de Foco</h2>
              <p className="ds-card-desc">Ciclo Pomodoro conectado ao seu banco</p>
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
                  Finalizar e Salvar
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. REVISÕES ESPAÇADAS (TIMELINE 1 -> 3 -> 7 -> 15d) */}
      <section className="ds-card">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Revisões Espaçadas (1 → 3 → 7 → 15 dias)</h2>
            <p className="ds-card-desc">Consolidação de memória até a data da prova</p>
          </div>
          <div className="ds-segmented">
            <button className={`ds-seg-item ${revFilter === 'hoje' ? 'active' : ''}`} onClick={() => setRevFilter('hoje')}>
              Hoje / Pendentes ({dueReviews.length})
            </button>
            <button className={`ds-seg-item ${revFilter === 'proximas' ? 'active' : ''}`} onClick={() => setRevFilter('proximas')}>
              Próximas ({upcomingReviews.length})
            </button>
            <button className={`ds-seg-item ${revFilter === 'concluidas' ? 'active' : ''}`} onClick={() => setRevFilter('concluidas')}>
              Concluídas ({completedReviews.length})
            </button>
          </div>
        </div>

        {visibleReviews.length === 0 ? (
          <div className="ds-card-body muted text-sm">
            {revFilter === 'hoje'
              ? 'Nenhuma revisão pendente para hoje. Conclua um tópico acima para iniciar o ciclo de 1 dia.'
              : revFilter === 'proximas'
              ? 'Nenhuma revisão futura agendada ainda.'
              : 'Nenhum tópico atingiu o ciclo final de domínio (15d) ainda.'}
          </div>
        ) : (
          <div className="timeline-list">
            {visibleReviews.map(t => {
              const step = t.review_interval || 1;
              return (
                <div key={t.id} className="timeline-row">
                  <div className="timeline-step">
                    <span className={`step-dot ${revFilter === 'hoje' ? 'warn' : revFilter === 'concluidas' ? 'green' : 'indigo'}`} />
                    <span className="step-label">{revFilter === 'concluidas' ? 'Dominado' : `${step}d`}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="text-xs muted">{t.subject} {t.next_review_date ? `· Agendada ${fmtBR(t.next_review_date)}` : ''}</div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                  </div>
                  <div className="timeline-actions">
                    {revFilter !== 'concluidas' && (
                      <>
                        <button onClick={() => onStartFocus(t)} className="ds-btn ds-btn-ghost ds-btn-sm">Revisar em Foco</button>
                        <button onClick={() => onTopicAction({ action: 'complete_review', id: t.id })} className="ds-btn ds-btn-secondary ds-btn-sm">
                          <Icons.Check size={14} /> Concluir
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
