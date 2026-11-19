'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ESSAY_PROMPTS, SUBJECT_META } from '../lib/syllabus';
import { ErrorEntry, EssayEntry, fmtBR, StudyLog, StudyPlan, Topic } from '../lib/types';
import { Icons } from './Icons';

interface NotebookViewProps {
  activePlan?: StudyPlan | null;
  topics: Topic[];
  errors: ErrorEntry[];
  essays: EssayEntry[];
  logs: StudyLog[];
  onAddError: (payload: { subject: string; topic: string; mistake: string; correction: string }) => Promise<void>;
  onDeleteError: (id: number) => Promise<void>;
  onSaveEssay: (payload: { cargo: string; title: string; text: string }) => Promise<void>;
  onCorrectEssayWithMentor: (promptText: string) => void;
}

export function NotebookView({
  activePlan,
  topics,
  errors,
  essays,
  logs,
  onAddError,
  onDeleteError,
  onSaveEssay,
  onCorrectEssayWithMentor,
}: NotebookViewProps) {
  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';
  const hasEssay = activePlan ? Boolean(activePlan.has_essay) : true;

  const availableSubjects = useMemo(() => {
    if (isCmcPlan) return SUBJECT_META.map(s => s.name);
    const s = Array.from(new Set(topics.map(t => t.subject)));
    return s.length > 0 ? s : ['Geral'];
  }, [isCmcPlan, topics]);

  const [tab, setTab] = useState<'erros' | 'discursiva' | 'notebooklm'>('erros');
  const [errSub, setErrSub] = useState(availableSubjects[0] || 'Geral');
  const [errTop, setErrTop] = useState('');
  const [errMis, setErrMis] = useState('');
  const [errCor, setErrCor] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [essayId, setEssayId] = useState(ESSAY_PROMPTS[0].id);
  const [customEssayTitle, setCustomEssayTitle] = useState('');
  const [essayText, setEssayText] = useState('');

  const [nlmTopicId, setNlmTopicId] = useState(topics[0]?.id || '');
  const [nlmMode, setNlmMode] = useState('podcast');
  const [nlmCopied, setNlmCopied] = useState('');

  useEffect(() => {
    if (!hasEssay && tab === 'discursiva') {
      setTab('erros');
    }
    setErrSub(availableSubjects[0] || 'Geral');
    if (topics[0]) setNlmTopicId(topics[0].id);
  }, [hasEssay, tab, availableSubjects, topics]);

  const today = new Date().toISOString().slice(0, 10);

  const essayLines = useMemo(() => {
    if (!essayText.trim()) return 0;
    return essayText.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / 82)), 0);
  }, [essayText]);

  const nlmPrompt = useMemo(() => {
    const t = topics.find(x => x.id === nlmTopicId) || topics[0];
    if (!t) return '';
    const studyName = activePlan?.title || 'Câmara Municipal de Cuiabá 2026';
    const map: Record<string, string> = {
      podcast: `[Personalizar Audio Overview]\nRevisão direta em português para ${studyName}. Tema: ${t.subject} — ${t.title}. Conceitos essenciais, pegadinhas e 3 perguntas rápidas no final.`,
      feynman: `Explique "${t.title}" (${t.subject}) para meu estudo de ${studyName} de forma simples e direta, com os 5 pontos mais cobrados em provas.`,
      leiseca: `Extraia todos os conceitos, regras, fórmulas ou artigos essenciais sobre "${t.title}" (${t.subject}).`,
      quiz: `Crie 10 questões práticas sobre "${t.title}" (${t.subject}) com gabarito comentado ao final.`,
    };
    return map[nlmMode] || '';
  }, [topics, nlmTopicId, nlmMode, activePlan]);

  function downloadFile(name: string, content: string, mime = 'text/markdown') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  async function submitError(e: React.FormEvent) {
    e.preventDefault();
    if (!errMis.trim() || !errCor.trim()) {
      setErrMsg('Descreva a dúvida/erro e o conceito correto.');
      return;
    }
    setErrMsg('');
    await onAddError({
      subject: errSub,
      topic: errTop.trim() || 'Geral',
      mistake: errMis.trim(),
      correction: errCor.trim(),
    });
    setErrTop(''); setErrMis(''); setErrCor('');
  }

  return (
    <div className="ds-container">
      {/* Organic Subnavigation: Only displays Discursiva if the study plan actually has a discursive exam */}
      <div className="ds-segmented" style={{ maxWidth: hasEssay ? 480 : 340 }}>
        <button className={`ds-seg-item ${tab === 'erros' ? 'active' : ''}`} onClick={() => setTab('erros')}>
          Caderno de Erros ({errors.length})
        </button>
        {hasEssay && (
          <button className={`ds-seg-item ${tab === 'discursiva' ? 'active' : ''}`} onClick={() => setTab('discursiva')}>
            Discursiva (20–30l)
          </button>
        )}
        <button className={`ds-seg-item ${tab === 'notebooklm' ? 'active' : ''}`} onClick={() => setTab('notebooklm')}>
          Fontes &amp; Histórico
        </button>
      </div>

      {tab === 'erros' && (
        <div className="bento-two">
          <form onSubmit={submitError} className="ds-card">
            <div className="ds-card-header">
              <div>
                <h2 className="ds-card-title">Registrar ponto de atenção</h2>
                <p className="ds-card-desc">Transforme questões erradas em revisão rápida antes da prova</p>
              </div>
            </div>
            <div className="ds-card-body space-y">
              <div>
                <label className="field-label">Matéria / Unidade</label>
                <select className="ds-select" value={errSub} onChange={e => setErrSub(e.target.value)}>
                  {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Assunto específico</label>
                <input className="ds-input" type="text" value={errTop} onChange={e => setErrTop(e.target.value)} placeholder="Ex: Índices B+ Tree / Art. 37 CF" />
              </div>
              <div>
                <label className="field-label">O que você errou ou teve dúvida</label>
                <input className="ds-input" type="text" value={errMis} onChange={e => setErrMis(e.target.value)} placeholder="Ex: Confundi o conceito..." />
              </div>
              <div>
                <label className="field-label">Conceito correto</label>
                <input className="ds-input" type="text" value={errCor} onChange={e => setErrCor(e.target.value)} placeholder="Ex: A regra correta é..." />
              </div>
              {errMsg && <div className="inline-alert error">{errMsg}</div>}
              <button type="submit" className="ds-btn ds-btn-primary" style={{ width: '100%' }}>Salvar no Caderno</button>
            </div>
          </form>

          <section className="ds-card">
            <div className="ds-card-header">
              <div>
                <h2 className="ds-card-title">Erros Salvos ({errors.length})</h2>
                <p className="ds-card-desc">Pontos salvos automaticamente nas questões ou adicionados por você</p>
              </div>
              <button
                onClick={() => {
                  let md = `# Caderno de Erros — ${activePlan?.title || 'Estudos'} (${today})\n\n`;
                  errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** ${e.mistake} → ${e.correction}\n`; });
                  downloadFile(`caderno_erros_${today}.md`, md);
                }}
                className="ds-btn ds-btn-secondary ds-btn-sm"
              >
                Exportar .MD
              </button>
            </div>
            {errors.length === 0 ? (
              <div className="ds-card-body muted text-sm">
                Nenhum erro registrado ainda. Ao errar uma questão na aba Prática e pedir explicação ao Mentor, ela entra aqui automaticamente.
              </div>
            ) : (
              <div className="activity-list">
                {errors.map(e => (
                  <div key={e.id} className="activity-row" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="text-xs muted">{e.subject} · {e.topic} · {fmtBR(e.date)}</div>
                      <div className="text-sm" style={{ color: 'var(--c-error)', marginTop: 3 }}>Erro: {e.mistake}</div>
                      <div className="text-sm" style={{ color: 'var(--c-success)', marginTop: 2 }}>Correto: {e.correction}</div>
                    </div>
                    <button onClick={() => onDeleteError(e.id)} className="ds-icon-btn" aria-label="Remover erro">
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {hasEssay && tab === 'discursiva' && (
        <section className="ds-card">
          <div className="ds-card-header">
            <div>
              <h2 className="ds-card-title">Treino de Discursiva (20 a 30 Linhas)</h2>
              <p className="ds-card-desc">Critério de avaliação: 80 pts Conteúdo + 20 pts Correção Formal</p>
            </div>
            <span className={`ds-badge ${essayLines >= 20 && essayLines <= 30 ? 'ds-badge-green' : 'ds-badge-neutral'}`}>
              {essayLines} / 30 linhas
            </span>
          </div>
          <div className="ds-card-body space-y">
            {isCmcPlan ? (
              <>
                <select className="ds-select" value={essayId} onChange={e => setEssayId(e.target.value)}>
                  {ESSAY_PROMPTS.map(p => <option key={p.id} value={p.id}>[{p.cargo}] {p.title}</option>)}
                </select>
                <div className="prompt-callout">
                  {ESSAY_PROMPTS.find(x => x.id === essayId)?.desc}
                </div>
              </>
            ) : (
              <div>
                <label className="field-label">Tema da Discursiva / Redação</label>
                <input
                  className="ds-input"
                  type="text"
                  value={customEssayTitle}
                  onChange={e => setCustomEssayTitle(e.target.value)}
                  placeholder="Digite o tema proposto..."
                />
              </div>
            )}

            <textarea
              className="ds-textarea"
              rows={11}
              value={essayText}
              onChange={e => setEssayText(e.target.value)}
              placeholder="Redija sua resposta entre 20 e 30 linhas..."
            />
            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <span className="text-xs muted">{essayText.trim() ? essayText.trim().split(/\s+/).length : 0} palavras</span>
              <div className="flex-row">
                <button
                  onClick={async () => {
                    if (!essayText.trim()) return;
                    const p = isCmcPlan ? ESSAY_PROMPTS.find(x => x.id === essayId) : null;
                    await onSaveEssay({
                      cargo: p?.cargo || activePlan?.title || 'Discursiva',
                      title: p?.title || customEssayTitle || 'Rascunho',
                      text: essayText.trim(),
                    });
                    setEssayText('');
                  }}
                  className="ds-btn ds-btn-secondary"
                >
                  Salvar Rascunho
                </button>
                <button
                  onClick={() => {
                    if (!essayText.trim()) return;
                    const p = isCmcPlan ? ESSAY_PROMPTS.find(x => x.id === essayId) : null;
                    const tema = p?.title || customEssayTitle || activePlan?.title || 'Tema proposto';
                    onCorrectEssayWithMentor(
                      `Avalie minha Prova Discursiva no tema "${tema}" (Conteúdo 0 a 80 pts + Correção Formal 0 a 20 pts) e USE a ferramenta save_essay_evaluation para gravar minha nota no banco:\n\n${essayText.trim()}`
                    );
                  }}
                  className="ds-btn ds-btn-primary"
                >
                  <Icons.Sparkles size={14} /> Corrigir com Mentor
                </button>
              </div>
            </div>

            {essays.length > 0 && (
              <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 12 }}>
                <div className="text-xs muted" style={{ fontWeight: 600, marginBottom: 6 }}>Histórico de Correções</div>
                {essays.map(e => {
                  const total = (e.score_content || 0) + (e.score_formal || 0);
                  return (
                    <div key={e.id} className="activity-row" style={{ padding: '8px 0' }}>
                      <div>
                        <div className="text-xs muted">{fmtBR(e.date)} · <strong>[{e.cargo}]</strong> {e.title}</div>
                        {e.feedback && <div className="text-xs" style={{ marginTop: 2 }}>{e.feedback}</div>}
                      </div>
                      {total > 0 ? (
                        <span className={`ds-badge ${total >= 70 ? 'ds-badge-green' : total >= 40 ? 'ds-badge-amber' : 'ds-badge-red'}`}>
                          {total}/100 ({e.score_content}C + {e.score_formal}F)
                        </span>
                      ) : (
                        <span className="ds-badge ds-badge-neutral">Rascunho</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'notebooklm' && (() => {
        const selectedTopic = topics.find(x => x.id === nlmTopicId) || topics[0];
        let recNotebook = 'Caderno 1 - Núcleo Comum e Legislação';
        let recReason = 'Matéria comum aos dois cargos (fontes na pasta Caderno 1).';
        let recBadge = 'ds-badge-green';
        if (selectedTopic?.overlap === 'exclusivo-analista') {
          recNotebook = 'Caderno 2 - Analista TI';
          recReason = 'Conteúdo exclusivo de Tecnologia da Informação (pasta Caderno 2).';
          recBadge = 'ds-badge-indigo';
        } else if (selectedTopic?.overlap === 'exclusivo-tecnico') {
          recNotebook = 'Caderno 3 - Técnico Legislativo';
          recReason = 'Conteúdo específico de Técnico Legislativo (pasta Caderno 3).';
          recBadge = 'ds-badge-blue';
        } else if (selectedTopic?.overlap === 'ponte-peso') {
          recNotebook = 'Caderno 1 - Núcleo Comum e Legislação';
          recReason = 'Disponível no Caderno 1 (e também nos Cadernos 2 e 3 para cruzamento).';
          recBadge = 'ds-badge-amber';
        }

        return (
          <div className="bento-two">
            <section className="ds-card">
              <div className="ds-card-header">
                <div>
                  <h2 className="ds-card-title">Áudio &amp; Resumos (NotebookLM)</h2>
                  <p className="ds-card-desc">Gere roteiros de áudio e resumos a partir dos seus materiais</p>
                </div>
              </div>
              <div className="ds-card-body space-y">
                <div className="flex-row">
                  <a
                    href="https://notebooklm.google.com"
                    target="_blank"
                    rel="noopener"
                    className="ds-btn ds-btn-primary"
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    Abrir NotebookLM
                  </a>
                  {isCmcPlan && (
                    <a
                      href="https://drive.google.com/drive/folders/1RU85Ck3qASnCMvCL6TgH_V6_OmwoPNTR"
                      target="_blank"
                      rel="noopener"
                      className="ds-btn ds-btn-secondary"
                      style={{ flex: 1, textDecoration: 'none' }}
                    >
                      Pasta no Drive
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    let md = `# Progresso & Erros — ${activePlan?.title || 'Estudos'} (${today})\n\n`;
                    topics.filter(t => t.mastery <= 2 || t.study_queue || t.review_queue).forEach(t => {
                      md += `- [${t.subject}] ${t.title} (Nível ${t.mastery}/5)\n`;
                    });
                    md += '\n## Erros\n';
                    errors.forEach(e => { md += `- ${e.subject}: ${e.mistake} -> ${e.correction}\n`; });
                    downloadFile(`progresso_${today}.md`, md);
                  }}
                  className="ds-btn ds-btn-secondary"
                  style={{ width: '100%' }}
                >
                  Exportar Resumo + Erros (.md)
                </button>

                <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 12 }} className="space-y">
                  <label className="field-label">Roteiro para estudo por áudio ou resumo</label>
                  <select className="ds-select" value={nlmTopicId} onChange={e => setNlmTopicId(e.target.value)}>
                    {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 50)}</option>)}
                  </select>
                  <select className="ds-select" value={nlmMode} onChange={e => setNlmMode(e.target.value)}>
                    <option value="podcast">Resumo em Áudio (Podcast)</option>
                    <option value="feynman">Explicação Simplificada</option>
                    <option value="leiseca">Conceitos, Fórmulas &amp; Prazos</option>
                    <option value="quiz">Simulado 10 Questões</option>
                  </select>

                  {isCmcPlan && (
                    <div className="prompt-callout" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                        <span className="text-xs" style={{ fontWeight: 700, color: 'var(--c-text)' }}>Onde usar:</span>
                        <span className={`ds-badge ${recBadge}`}>{recNotebook}</span>
                      </div>
                      <span className="text-xs muted">{recReason}</span>
                    </div>
                  )}

                  <textarea className="ds-textarea mono" rows={4} readOnly value={nlmPrompt} />
                  <div className="flex-row">
                    <button
                      onClick={() => { navigator.clipboard.writeText(nlmPrompt); setNlmCopied('Copiado.'); setTimeout(() => setNlmCopied(''), 2000); }}
                      className="ds-btn ds-btn-primary ds-btn-sm"
                    >
                      Copiar Roteiro
                    </button>
                    {nlmCopied && <span className="text-xs" style={{ color: 'var(--c-success)' }}>{nlmCopied}</span>}
                  </div>
                </div>
              </div>
            </section>

            <section className="ds-card">
              <div className="ds-card-header">
                <div>
                  <h2 className="ds-card-title">Histórico de Sessões</h2>
                  <p className="ds-card-desc">Últimas atividades registradas neste estudo</p>
                </div>
                <button
                  onClick={() => downloadFile(`backup_${today}.json`, JSON.stringify({ activePlan, topics, logs, errors, essays }, null, 2), 'application/json')}
                  className="ds-btn ds-btn-ghost ds-btn-sm"
                >
                  Backup JSON
                </button>
              </div>
              {logs.length === 0 ? (
                <div className="ds-card-body muted text-sm">Nenhuma sessão registrada ainda neste estudo.</div>
              ) : (
                <div className="activity-list">
                  {logs.slice(0, 15).map(l => (
                    <div key={l.id} className="activity-row">
                      <div>
                        <div className="text-xs muted">{l.subject} · {l.kind}</div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{l.title}</div>
                      </div>
                      <span className="ds-badge ds-badge-neutral">{fmtBR(l.date)} · {l.minutes}m</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        );
      })()}
    </div>
  );
}
