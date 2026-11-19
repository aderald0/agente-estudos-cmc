'use client';

import React, { useMemo, useState } from 'react';
import { ESSAY_PROMPTS, SUBJECT_META } from '../lib/syllabus';
import { ErrorEntry, EssayEntry, fmtBR, StudyLog, Topic } from '../lib/types';
import { Icons } from './Icons';

interface NotebookViewProps {
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
  topics,
  errors,
  essays,
  logs,
  onAddError,
  onDeleteError,
  onSaveEssay,
  onCorrectEssayWithMentor,
}: NotebookViewProps) {
  const [tab, setTab] = useState<'erros' | 'discursiva' | 'notebooklm'>('erros');
  const [errSub, setErrSub] = useState(SUBJECT_META[0].name);
  const [errTop, setErrTop] = useState('');
  const [errMis, setErrMis] = useState('');
  const [errCor, setErrCor] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [essayId, setEssayId] = useState(ESSAY_PROMPTS[0].id);
  const [essayText, setEssayText] = useState('');

  const [nlmTopicId, setNlmTopicId] = useState(topics[0]?.id || '');
  const [nlmMode, setNlmMode] = useState('podcast');
  const [nlmCopied, setNlmCopied] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const essayLines = useMemo(() => {
    if (!essayText.trim()) return 0;
    return essayText.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / 82)), 0);
  }, [essayText]);

  const nlmPrompt = useMemo(() => {
    const t = topics.find(x => x.id === nlmTopicId) || topics[0];
    if (!t) return '';
    const map: Record<string, string> = {
      podcast: `[Personalizar Audio Overview]\nRevisão direta em português para o concurso CMC 2026 (Selecon). Tema: ${t.subject} — ${t.title}. Prazos, exceções e 3 perguntas V/F no final.`,
      feynman: `Explique "${t.title}" (${t.subject}) para o concurso CMC 2026 (Selecon) de forma simples, com 5 pegadinhas e resumo rápido.`,
      leiseca: `Extraia todos os PRAZOS, QUÓRUNS e artigos exatos sobre "${t.title}" (${t.subject}).`,
      quiz: `Crie 10 questões estilo Selecon sobre "${t.title}" (${t.subject}) com gabarito comentado ao final.`,
    };
    return map[nlmMode] || '';
  }, [topics, nlmTopicId, nlmMode]);

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
      setErrMsg('Descreva o erro cometido e a regra correta.');
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
      <div className="ds-segmented" style={{ maxWidth: 460 }}>
        <button className={`ds-seg-item ${tab === 'erros' ? 'active' : ''}`} onClick={() => setTab('erros')}>
          Caderno de Erros ({errors.length})
        </button>
        <button className={`ds-seg-item ${tab === 'discursiva' ? 'active' : ''}`} onClick={() => setTab('discursiva')}>
          Discursiva (20–30l)
        </button>
        <button className={`ds-seg-item ${tab === 'notebooklm' ? 'active' : ''}`} onClick={() => setTab('notebooklm')}>
          NotebookLM &amp; Logs
        </button>
      </div>

      {tab === 'erros' && (
        <div className="bento-two">
          <form onSubmit={submitError} className="ds-card">
            <div className="ds-card-header">
              <div>
                <h2 className="ds-card-title">Novo Registro de Erro</h2>
                <p className="ds-card-desc">Transforme questões erradas em revisão ativa</p>
              </div>
            </div>
            <div className="ds-card-body space-y">
              <div>
                <label className="field-label">Disciplina</label>
                <select className="ds-select" value={errSub} onChange={e => setErrSub(e.target.value)}>
                  {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Assunto ou Artigo de Lei</label>
                <input className="ds-input" type="text" value={errTop} onChange={e => setErrTop(e.target.value)} placeholder="Ex: Art. 37 CF ou Quórum LOM" />
              </div>
              <div>
                <label className="field-label">O que você errou / Pegadinha</label>
                <input className="ds-input" type="text" value={errMis} onChange={e => setErrMis(e.target.value)} placeholder="Ex: Confundi anulação com revogação..." />
              </div>
              <div>
                <label className="field-label">Regra Correta</label>
                <input className="ds-input" type="text" value={errCor} onChange={e => setErrCor(e.target.value)} placeholder="Ex: Anulação = ilegalidade (ex tunc)..." />
              </div>
              {errMsg && <div className="inline-alert error">{errMsg}</div>}
              <button type="submit" className="ds-btn ds-btn-primary" style={{ width: '100%' }}>Salvar no Caderno</button>
            </div>
          </form>

          <section className="ds-card">
            <div className="ds-card-header">
              <div>
                <h2 className="ds-card-title">Erros Registrados ({errors.length})</h2>
                <p className="ds-card-desc">Exporte para gerar podcasts focados no NotebookLM</p>
              </div>
              <button
                onClick={() => {
                  let md = `# Caderno de Erros CMC 2026 (${today})\n\n`;
                  errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** ${e.mistake} → ${e.correction}\n`; });
                  downloadFile(`erros_cmc_${today}.md`, md);
                }}
                className="ds-btn ds-btn-secondary ds-btn-sm"
              >
                Exportar .MD
              </button>
            </div>
            {errors.length === 0 ? (
              <div className="ds-card-body muted text-sm">Nenhum erro registrado ainda.</div>
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

      {tab === 'discursiva' && (
        <section className="ds-card">
          <div className="ds-card-header">
            <div>
              <h2 className="ds-card-title">Laboratório Discursiva (20 a 30 Linhas)</h2>
              <p className="ds-card-desc">Critério oficial do Edital: 80 pts Conteúdo + 20 pts Correção Formal</p>
            </div>
            <span className={`ds-badge ${essayLines >= 20 && essayLines <= 30 ? 'ds-badge-green' : 'ds-badge-neutral'}`}>
              {essayLines} / 30 linhas
            </span>
          </div>
          <div className="ds-card-body space-y">
            <select className="ds-select" value={essayId} onChange={e => setEssayId(e.target.value)}>
              {ESSAY_PROMPTS.map(p => <option key={p.id} value={p.id}>[{p.cargo}] {p.title}</option>)}
            </select>
            <div className="prompt-callout">
              {ESSAY_PROMPTS.find(x => x.id === essayId)?.desc}
            </div>
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
                    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
                    await onSaveEssay({ cargo: p?.cargo || '', title: p?.title || 'Rascunho', text: essayText.trim() });
                    setEssayText('');
                  }}
                  className="ds-btn ds-btn-secondary"
                >
                  Salvar Rascunho
                </button>
                <button
                  onClick={() => {
                    if (!essayText.trim()) return;
                    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
                    onCorrectEssayWithMentor(`Corrija minha discursiva (${p?.cargo} — ${p?.title}) pela regra 80/20 do Edital:\n\n${essayText.trim()}`);
                  }}
                  className="ds-btn ds-btn-primary"
                >
                  <Icons.Sparkles size={14} /> Corrigir com Mentor
                </button>
              </div>
            </div>

            {essays.length > 0 && (
              <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 12 }}>
                <div className="text-xs muted" style={{ fontWeight: 600, marginBottom: 6 }}>Rascunhos salvos</div>
                {essays.map(e => (
                  <div key={e.id} className="text-xs muted" style={{ padding: '4px 0' }}>
                    {fmtBR(e.date)} · <strong>[{e.cargo}]</strong> {e.title}
                  </div>
                ))}
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
                <h2 className="ds-card-title">Hub NotebookLM &amp; Drive</h2>
                <p className="ds-card-desc">3 cadernos organizados sem PDFs duplicados</p>
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
                <a
                  href="https://drive.google.com/drive/folders/1RU85Ck3qASnCMvCL6TgH_V6_OmwoPNTR"
                  target="_blank"
                  rel="noopener"
                  className="ds-btn ds-btn-secondary"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  Pasta no Drive
                </a>
              </div>

              <button
                onClick={() => {
                  let md = `# Progresso & Erros CMC 2026 (${today})\n\n`;
                  topics.filter(t => t.mastery <= 2 || t.study_queue || t.review_queue).forEach(t => {
                    md += `- [${t.subject}] ${t.title} (Nível ${t.mastery}/5)\n`;
                  });
                  md += '\n## Erros\n';
                  errors.forEach(e => { md += `- ${e.subject}: ${e.mistake} -> ${e.correction}\n`; });
                  downloadFile(`progresso_notebooklm_${today}.md`, md);
                }}
                className="ds-btn ds-btn-secondary"
                style={{ width: '100%' }}
              >
                Exportar Progresso + Erros (.md) p/ subir como fonte
              </button>

              <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 12 }} className="space-y">
                <label className="field-label">Gerador de Prompt para NotebookLM</label>
                <select className="ds-select" value={nlmTopicId} onChange={e => setNlmTopicId(e.target.value)}>
                  {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 50)}</option>)}
                </select>
                <select className="ds-select" value={nlmMode} onChange={e => setNlmMode(e.target.value)}>
                  <option value="podcast">Audio Overview (Podcast)</option>
                  <option value="feynman">Explicação Feynman</option>
                  <option value="leiseca">Prazos &amp; Quóruns</option>
                  <option value="quiz">Simulado 10 Questões</option>
                </select>

                {/* Indicação exata do Caderno */}
                <div className="prompt-callout" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                    <span className="text-xs" style={{ fontWeight: 700, color: 'var(--c-text)' }}>Onde colar este prompt:</span>
                    <span className={`ds-badge ${recBadge}`}>{recNotebook}</span>
                  </div>
                  <span className="text-xs muted">{recReason}</span>
                </div>

                <textarea className="ds-textarea mono" rows={4} readOnly value={nlmPrompt} />
                <div className="flex-row">
                  <button
                    onClick={() => { navigator.clipboard.writeText(nlmPrompt); setNlmCopied('Prompt copiado.'); setTimeout(() => setNlmCopied(''), 2000); }}
                    className="ds-btn ds-btn-primary ds-btn-sm"
                  >
                    Copiar Prompt
                  </button>
                  {nlmCopied && <span className="text-xs" style={{ color: 'var(--c-success)' }}>{nlmCopied}</span>}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: 12 }} className="text-xs muted space-y">
                <div style={{ fontWeight: 600, color: 'var(--c-text)' }}>Mapa rápido dos seus 3 cadernos:</div>
                <div><strong>1. Núcleo Comum e Legislação:</strong> Português, RLM, Informática, Hist./Geo. MT, Ética, Relações, Adm. Pública e Legislação Municipal.</div>
                <div><strong>2. Analista TI:</strong> Conhecimentos Específicos TI + Legislação Municipal + Adm. Pública.</div>
                <div><strong>3. Técnico Legislativo:</strong> Conhecimentos Específicos Técnico + Legislação Municipal + Português.</div>
              </div>
            </div>
          </section>

          <section className="ds-card">
            <div className="ds-card-header">
              <div>
                <h2 className="ds-card-title">Histórico de Sessões</h2>
                <p className="ds-card-desc">Últimas atividades registradas no Neon</p>
              </div>
              <button
                onClick={() => downloadFile(`backup_cmc_${today}.json`, JSON.stringify({ topics, logs, errors, essays }, null, 2), 'application/json')}
                className="ds-btn ds-btn-ghost ds-btn-sm"
              >
                Backup JSON
              </button>
            </div>
            {logs.length === 0 ? (
              <div className="ds-card-body muted text-sm">Nenhuma sessão registrada ainda.</div>
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
