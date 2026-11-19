'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SUBJECT_META } from '../lib/syllabus';
import { Flashcard, fmtBR, PracticeQuestion, StudyPlan } from '../lib/types';
import { Icons } from './Icons';

interface PracticeViewProps {
  activePlan?: StudyPlan | null;
  questions: PracticeQuestion[];
  flashcards: Flashcard[];
  onPracticeAction: (payload: Record<string, unknown>) => Promise<void>;
  onExplainWithMentor: (
    promptText: string,
    autoError?: { subject: string; topic: string; mistake: string; correction: string }
  ) => void;
}

export function PracticeView({
  activePlan,
  questions,
  flashcards,
  onPracticeAction,
  onExplainWithMentor,
}: PracticeViewProps) {
  const isCmcPlan = !activePlan || activePlan.id === 'cmc-2026' || activePlan.category === 'concurso-duplo';
  const [mode, setMode] = useState<'questoes' | 'flashcards'>('questoes');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [onlyUnansweredOrWrong, setOnlyUnansweredOrWrong] = useState(false);

  const availableSubjects = useMemo(() => {
    if (isCmcPlan) return SUBJECT_META.map(s => s.name);
    const set = new Set<string>();
    questions.forEach(q => { if (q.subject) set.add(q.subject); });
    flashcards.forEach(f => { if (f.subject) set.add(f.subject); });
    return Array.from(set);
  }, [isCmcPlan, questions, flashcards]);

  // Flashcards state
  const [fcSubject, setFcSubject] = useState<string>('all');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [showNewFc, setShowNewFc] = useState(false);
  const [newFcSub, setNewFcSub] = useState(availableSubjects[0] || 'Geral');
  const [newFcFront, setNewFcFront] = useState('');
  const [newFcBack, setNewFcBack] = useState('');
  const [newFcTag, setNewFcTag] = useState('');

  useEffect(() => {
    setSelectedSubject(isCmcPlan ? 'Legislação Municipal' : 'all');
    setFcSubject('all');
    setNewFcSub(availableSubjects[0] || 'Geral');
  }, [activePlan?.id, isCmcPlan, availableSubjects]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (onlyUnansweredOrWrong && q.is_correct === true) return false;
      return true;
    });
  }, [questions, selectedSubject, onlyUnansweredOrWrong]);

  const qStats = useMemo(() => {
    const subQs = selectedSubject === 'all' ? questions : questions.filter(q => q.subject === selectedSubject);
    const answered = subQs.filter(q => q.user_choice).length;
    const correct = subQs.filter(q => q.is_correct === true).length;
    return {
      total: subQs.length,
      answered,
      correct,
      pct: answered ? Math.round((correct / answered) * 100) : 0,
    };
  }, [questions, selectedSubject]);

  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(f => fcSubject === 'all' || f.subject === fcSubject);
  }, [flashcards, fcSubject]);

  const currentCard = filteredFlashcards[fcIdx % Math.max(1, filteredFlashcards.length)] || null;

  async function gradeCard(grade: 'again' | 'good' | 'easy') {
    if (!currentCard) return;
    setFcFlipped(false);
    await onPracticeAction({ action: 'review_flashcard', id: currentCard.id, grade });
    setFcIdx(i => (i + 1) % Math.max(1, filteredFlashcards.length));
  }

  return (
    <div className="ds-container">
      {/* Mode Switcher */}
      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
        <div className="ds-segmented">
          <button
            className={`ds-seg-item ${mode === 'questoes' ? 'active' : ''}`}
            onClick={() => setMode('questoes')}
          >
            Questões ({questions.filter(q => q.user_choice).length}/{questions.length})
          </button>
          <button
            className={`ds-seg-item ${mode === 'flashcards' ? 'active' : ''}`}
            onClick={() => setMode('flashcards')}
          >
            Cartões de memória ({flashcards.length})
          </button>
        </div>

        {mode === 'flashcards' && (
          <button onClick={() => setShowNewFc(s => !s)} className="ds-btn ds-btn-primary ds-btn-sm">
            <Icons.Plus size={14} /> Novo Cartão
          </button>
        )}
      </div>

      {/* MODO 1: QUESTÕES */}
      {mode === 'questoes' && (
        <>
          <div className="ds-card ds-card-body">
            <div className="practice-toolbar">
              <select
                aria-label="Selecionar matéria"
                className="ds-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="all">Todas as matérias ({questions.length} questões)</option>
                {availableSubjects.map(subName => (
                  <option key={subName} value={subName}>
                    {subName} ({questions.filter(q => q.subject === subName).length})
                  </option>
                ))}
              </select>

              <label className="flex-row text-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyUnansweredOrWrong}
                  onChange={e => setOnlyUnansweredOrWrong(e.target.checked)}
                />
                Apenas não feitas / erradas
              </label>

              <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                <span className="ds-badge ds-badge-indigo">
                  {qStats.correct}/{qStats.answered} certas ({qStats.pct}%)
                </span>

                <button
                  onClick={() => onPracticeAction({ action: 'reset_questions', subject: selectedSubject })}
                  className="ds-btn ds-btn-ghost ds-btn-sm"
                >
                  Refazer
                </button>
              </div>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="ds-card empty-box">
              <div className="empty-icon"><Icons.Check size={20} /></div>
              <div className="empty-title">Nenhuma questão pendente neste filtro</div>
              <p className="empty-desc">Desmarque o filtro ou escolha outra matéria para continuar praticando.</p>
            </div>
          ) : (
            <div className="space-y">
              {filteredQuestions.map(q => {
                let opts: Array<{ letter: string; text: string }> = [];
                try { opts = JSON.parse(q.options_json); } catch {}
                const answered = Boolean(q.user_choice);

                return (
                  <article key={q.id} className="ds-card">
                    <div className="ds-card-header" style={{ padding: '10px 18px' }}>
                      <div className="flex-row">
                        <span className="ds-badge ds-badge-indigo">Questão #{q.qnum}</span>
                        <span className="text-xs muted" style={{ fontWeight: 600 }}>{q.subject}</span>
                      </div>
                      {answered && (
                        <span className={`ds-badge ${q.is_correct ? 'ds-badge-green' : 'ds-badge-red'}`}>
                          {q.is_correct ? '✓ Você acertou' : `✗ Gabarito: (${q.answer})`}
                        </span>
                      )}
                    </div>

                    <div className="ds-card-body space-y">
                      <p className="text-sm" style={{ margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                        {q.stem}
                      </p>

                      <div className="q-options-list">
                        {opts.map(o => {
                          const isSelected = q.user_choice === o.letter;
                          const isRightAnswer = q.answer === o.letter;
                          let cls = 'q-option-btn';
                          if (answered) {
                            if (isRightAnswer) cls += ' correct';
                            else if (isSelected && !isRightAnswer) cls += ' wrong';
                          }

                          return (
                            <button
                              key={o.letter}
                              onClick={() => onPracticeAction({ action: 'answer_question', id: q.id, choice: o.letter })}
                              className={cls}
                            >
                              <span className="q-opt-letter">{o.letter}</span>
                              <span className="q-opt-text">{o.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className="flex-row" style={{ justifyContent: 'flex-end', paddingTop: 4 }}>
                          <button
                            onClick={() => {
                              const chosenOpt = opts.find(o => o.letter === q.user_choice);
                              const rightOpt = opts.find(o => o.letter === q.answer);
                              const chosenDesc = chosenOpt ? `(${chosenOpt.letter}) ${chosenOpt.text}` : `(${q.user_choice})`;
                              const rightDesc = rightOpt ? `(${rightOpt.letter}) ${rightOpt.text}` : `(${q.answer})`;

                              const autoError =
                                q.is_correct === false
                                  ? {
                                      subject: q.subject,
                                      topic: `Questão #${q.qnum} · ${q.stem.slice(0, 90)}...`,
                                      mistake: `Marquei ${chosenDesc}`,
                                      correction: `Gabarito: ${rightDesc}`,
                                    }
                                  : undefined;

                              onExplainWithMentor(
                                `Explique de forma direta e objetiva a Questão #${q.qnum} de ${q.subject}:\nEnunciado: "${q.stem}"\nAlternativa que marquei: ${chosenDesc}\nGabarito oficial: ${rightDesc}\nExplique por que o gabarito está correto e qual o erro da alternativa marcada.`,
                                autoError
                              );
                            }}
                            className="ds-btn ds-btn-secondary ds-btn-sm"
                          >
                            <Icons.Sparkles size={13} /> Explicar com Mentor {q.is_correct === false ? '& Salvar no Caderno' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODO 2: CARTÕES DE MEMÓRIA */}
      {mode === 'flashcards' && (
        <div className="space-y">
          {showNewFc && (
            <div className="ds-card ds-card-body space-y">
              <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                <strong className="text-sm">Criar Novo Cartão de Memória</strong>
                <button onClick={() => setShowNewFc(false)} className="ds-icon-btn"><Icons.Close size={15} /></button>
              </div>
              <div className="bento-two">
                <div>
                  <label className="field-label">Matéria / Unidade</label>
                  <input
                    className="ds-input"
                    type="text"
                    value={newFcSub}
                    onChange={e => setNewFcSub(e.target.value)}
                    placeholder="Ex: Unidade 1 / Direito Constitucional"
                  />
                </div>
                <div>
                  <label className="field-label">Referência / Tag</label>
                  <input className="ds-input" type="text" value={newFcTag} onChange={e => setNewFcTag(e.target.value)} placeholder="Ex: Conceito / Fórmula / Artigo" />
                </div>
              </div>
              <div>
                <label className="field-label">Frente (Pergunta Direta)</label>
                <input className="ds-input" type="text" value={newFcFront} onChange={e => setNewFcFront(e.target.value)} placeholder="Qual a diferença entre..." />
              </div>
              <div>
                <label className="field-label">Verso (Resposta Objetiva)</label>
                <textarea className="ds-textarea" rows={2} value={newFcBack} onChange={e => setNewFcBack(e.target.value)} placeholder="Resposta curta em até 2 linhas..." />
              </div>
              <button
                onClick={async () => {
                  if (!newFcFront.trim() || !newFcBack.trim()) return;
                  await onPracticeAction({
                    action: 'create_flashcard',
                    subject: newFcSub || 'Geral',
                    front: newFcFront,
                    back: newFcBack,
                    tag: newFcTag || 'Conceito',
                  });
                  setNewFcFront(''); setNewFcBack(''); setNewFcTag('');
                  setShowNewFc(false);
                }}
                className="ds-btn ds-btn-primary"
              >
                Salvar Cartão
              </button>
            </div>
          )}

          <div className="ds-card ds-card-body">
            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <select
                aria-label="Filtrar cartões por matéria"
                className="ds-select"
                style={{ maxWidth: 340 }}
                value={fcSubject}
                onChange={e => { setFcSubject(e.target.value); setFcIdx(0); setFcFlipped(false); }}
              >
                <option value="all">Todas as matérias ({flashcards.length} cartões)</option>
                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-xs muted">
                Cartão {filteredFlashcards.length ? (fcIdx % filteredFlashcards.length) + 1 : 0} de {filteredFlashcards.length}
              </span>
            </div>
          </div>

          {currentCard ? (
            <div className="flashcard-stage">
              <div
                onClick={() => setFcFlipped(f => !f)}
                className={`flashcard-box ${fcFlipped ? 'flipped' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFcFlipped(f => !f); }}
              >
                <div className="flex-row" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <span className="ds-badge ds-badge-indigo">{currentCard.subject}</span>
                  <span className="ds-badge ds-badge-neutral">{currentCard.tag} · Próx: {fmtBR(currentCard.next_review_date)}</span>
                </div>

                <div className="flashcard-content">
                  <div className="text-xs muted" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 700 }}>
                    {fcFlipped ? 'Resposta' : 'Pergunta (Toque para virar)'}
                  </div>
                  <div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.55 }}>
                    {fcFlipped ? currentCard.back : currentCard.front}
                  </div>
                </div>

                <div className="text-xs muted">Toque no cartão para {fcFlipped ? 'ver a pergunta' : 'revelar a resposta'}</div>
              </div>

              <div className="flashcard-controls">
                <button onClick={() => gradeCard('again')} className="ds-btn ds-btn-secondary" style={{ borderColor: 'var(--c-error)', color: 'var(--c-error)' }}>
                  Rever amanhã
                </button>
                <button onClick={() => gradeCard('good')} className="ds-btn ds-btn-secondary">
                  Bom · 3 dias
                </button>
                <button onClick={() => gradeCard('easy')} className="ds-btn ds-btn-primary">
                  Fácil · 7 dias
                </button>
              </div>
            </div>
          ) : (
            <div className="ds-card empty-box">
              <div className="empty-title">Nenhum cartão nesta matéria</div>
              <p className="empty-desc">Clique em &ldquo;+ Novo Cartão&rdquo; ou peça ao Mentor para criar cartões de memória.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
