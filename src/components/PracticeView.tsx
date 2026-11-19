'use client';

import React, { useMemo, useState } from 'react';
import { SUBJECT_META } from '../lib/syllabus';
import { Flashcard, fmtBR, PracticeQuestion } from '../lib/types';
import { Icons } from './Icons';

interface PracticeViewProps {
  questions: PracticeQuestion[];
  flashcards: Flashcard[];
  onPracticeAction: (payload: Record<string, unknown>) => Promise<void>;
  onExplainWithMentor: (promptText: string) => void;
}

export function PracticeView({
  questions,
  flashcards,
  onPracticeAction,
  onExplainWithMentor,
}: PracticeViewProps) {
  const [mode, setMode] = useState<'questoes' | 'flashcards'>('questoes');
  const [selectedSubject, setSelectedSubject] = useState<string>('Legislação Municipal');
  const [onlyUnansweredOrWrong, setOnlyUnansweredOrWrong] = useState(false);

  // Flashcards state
  const [fcSubject, setFcSubject] = useState<string>('all');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [showNewFc, setShowNewFc] = useState(false);
  const [newFcSub, setNewFcSub] = useState(SUBJECT_META[6].name);
  const [newFcFront, setNewFcFront] = useState('');
  const [newFcBack, setNewFcBack] = useState('');
  const [newFcTag, setNewFcTag] = useState('');

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
            Banco 200 Questões Selecon ({questions.filter(q => q.user_choice).length}/{questions.length})
          </button>
          <button
            className={`ds-seg-item ${mode === 'flashcards' ? 'active' : ''}`}
            onClick={() => setMode('flashcards')}
          >
            Flashcards Flip ({flashcards.length})
          </button>
        </div>

        {mode === 'flashcards' && (
          <button onClick={() => setShowNewFc(s => !s)} className="ds-btn ds-btn-primary ds-btn-sm">
            <Icons.Plus size={14} /> Novo Card
          </button>
        )}
      </div>

      {/* MODO 1: BANCO DE 200 QUESTÕES DAS APOSTILAS */}
      {mode === 'questoes' && (
        <>
          <div className="ds-card ds-card-body">
            <div className="edital-toolbar" style={{ gridTemplateColumns: '1.5fr 1fr auto auto' }}>
              <select
                aria-label="Selecionar disciplina"
                className="ds-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <option value="all">Todas as 10 Apostilas (200 questões)</option>
                {SUBJECT_META.map(s => (
                  <option key={s.name} value={s.name}>{s.name} (20 questões)</option>
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

              <span className="ds-badge ds-badge-indigo">
                {qStats.correct}/{qStats.answered} certas ({qStats.pct}%)
              </span>

              <button
                onClick={() => onPracticeAction({ action: 'reset_questions', subject: selectedSubject })}
                className="ds-btn ds-btn-ghost ds-btn-sm"
              >
                Refazer Apostila
              </button>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="ds-card empty-box">
              <div className="empty-icon"><Icons.Check size={20} /></div>
              <div className="empty-title">Todas as questões deste filtro foram acertadas!</div>
              <p className="empty-desc">Desmarque o filtro ou escolha outra apostila para continuar praticando.</p>
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
                          {q.is_correct ? '✓ Você acertou' : `✗ Gabarito oficial: (${q.answer})`}
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
                            onClick={() =>
                              onExplainWithMentor(
                                `Comente de forma direta a Questão #${q.qnum} de ${q.subject}: "${q.stem.slice(0, 260)}..." na qual marquei (${q.user_choice}) e o gabarito oficial é (${q.answer}). Se eu errei, registre a regra no meu Caderno de Erros.`
                              )
                            }
                            className="ds-btn ds-btn-secondary ds-btn-sm"
                          >
                            <Icons.Sparkles size={13} /> Explicar com Mentor {q.is_correct === false ? '& Salvar Erro' : ''}
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

      {/* MODO 2: DECK DE FLASHCARDS FLIP */}
      {mode === 'flashcards' && (
        <div className="space-y">
          {showNewFc && (
            <div className="ds-card ds-card-body space-y">
              <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                <strong className="text-sm">Criar Novo Flashcard de Memorização</strong>
                <button onClick={() => setShowNewFc(false)} className="ds-icon-btn"><Icons.Close size={15} /></button>
              </div>
              <div className="bento-two">
                <div>
                  <label className="field-label">Disciplina</label>
                  <select className="ds-select" value={newFcSub} onChange={e => setNewFcSub(e.target.value)}>
                    {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Tag / Artigo</label>
                  <input className="ds-input" type="text" value={newFcTag} onChange={e => setNewFcTag(e.target.value)} placeholder="Ex: LOM Art. 14 / Quórum" />
                </div>
              </div>
              <div>
                <label className="field-label">Frente (Pergunta Direta)</label>
                <input className="ds-input" type="text" value={newFcFront} onChange={e => setNewFcFront(e.target.value)} placeholder="Qual o prazo ou diferença entre..." />
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
                    subject: newFcSub,
                    front: newFcFront,
                    back: newFcBack,
                    tag: newFcTag || 'Personalizado',
                  });
                  setNewFcFront(''); setNewFcBack(''); setNewFcTag('');
                  setShowNewFc(false);
                }}
                className="ds-btn ds-btn-primary"
              >
                Salvar Flashcard
              </button>
            </div>
          )}

          <div className="ds-card ds-card-body">
            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <select
                aria-label="Filtrar flashcards por disciplina"
                className="ds-select"
                style={{ maxWidth: 340 }}
                value={fcSubject}
                onChange={e => { setFcSubject(e.target.value); setFcIdx(0); setFcFlipped(false); }}
              >
                <option value="all">Todas as Disciplinas ({flashcards.length} cards)</option>
                {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <span className="text-xs muted">
                Card {filteredFlashcards.length ? (fcIdx % filteredFlashcards.length) + 1 : 0} de {filteredFlashcards.length}
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
                    {fcFlipped ? 'Verso · Resposta Oficial' : 'Frente · Pergunta (Clique para virar)'}
                  </div>
                  <div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.55 }}>
                    {fcFlipped ? currentCard.back : currentCard.front}
                  </div>
                </div>

                <div className="text-xs muted">Toque no cartão para {fcFlipped ? 'ver a pergunta' : 'revelar a resposta'}</div>
              </div>

              <div className="flashcard-controls">
                <button onClick={() => gradeCard('again')} className="ds-btn ds-btn-secondary" style={{ borderColor: 'var(--c-error)', color: 'var(--c-error)' }}>
                  Errei · Revisar Amanhã (+1d)
                </button>
                <button onClick={() => gradeCard('good')} className="ds-btn ds-btn-secondary">
                  Bom · +3 dias
                </button>
                <button onClick={() => gradeCard('easy')} className="ds-btn ds-btn-primary">
                  Fácil · +7 dias
                </button>
              </div>
            </div>
          ) : (
            <div className="ds-card empty-box">
              <div className="empty-title">Nenhum flashcard nesta disciplina</div>
              <p className="empty-desc">Clique em &ldquo;+ Novo Card&rdquo; ou peça ao Mentor para gerar flashcards.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
