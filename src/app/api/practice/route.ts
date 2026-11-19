import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { addDaysISO, DEFAULT_PLAN_ID, ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const action = String(body.action || '');
    const planId = String(body.plan_id || DEFAULT_PLAN_ID);

    // Answer a practice question
    if (action === 'answer_question') {
      const qid = String(body.id || '');
      const choice = String(body.choice || '').toUpperCase();
      const rows = await sql`SELECT * FROM practice_questions WHERE id = ${qid}`;
      const q = rows[0];
      if (!q) return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });

      const prevChoice = String(q.user_choice || '');
      const prevCorrect = Boolean(q.is_correct);
      const isCorrect = choice === String(q.answer).toUpperCase();

      await sql`
        UPDATE practice_questions
        SET user_choice = ${choice}, is_correct = ${isCorrect}
        WHERE id = ${qid}
      `;

      const qPlanId = String(q.plan_id || planId);
      const tRows = await sql`
        SELECT id, q_right, q_total FROM topics
        WHERE plan_id = ${qPlanId} AND subject = ${q.subject}
        ORDER BY sort_order ASC LIMIT 1
      `;
      if (tRows[0]) {
        const tid = tRows[0].id;
        const deltaTotal = prevChoice ? 0 : 1;
        let deltaRight = 0;
        if (!prevChoice) {
          deltaRight = isCorrect ? 1 : 0;
        } else if (prevCorrect !== isCorrect) {
          deltaRight = isCorrect ? 1 : -1;
        }
        await sql`
          UPDATE topics
          SET q_total = GREATEST(0, q_total + ${deltaTotal}),
              q_right = GREATEST(0, q_right + ${deltaRight}),
              status = CASE WHEN status = 'nao-iniciado' THEN 'estudando' ELSE status END
          WHERE id = ${tid}
        `;
      }

      return NextResponse.json({ ok: true, isCorrect, answer: q.answer });
    }

    // Reset answers for a subject within the active plan
    if (action === 'reset_questions') {
      const subj = String(body.subject || '');
      if (subj && subj !== 'all') {
        await sql`UPDATE practice_questions SET user_choice = '', is_correct = NULL WHERE plan_id = ${planId} AND subject = ${subj}`;
      } else {
        await sql`UPDATE practice_questions SET user_choice = '', is_correct = NULL WHERE plan_id = ${planId}`;
      }
      return NextResponse.json({ ok: true });
    }

    // Review a flashcard
    if (action === 'review_flashcard') {
      const fcid = String(body.id || '');
      const grade = String(body.grade || 'good');
      const today = todayISO();
      const days = grade === 'again' ? 1 : grade === 'good' ? 3 : 7;
      const nextBox = grade === 'again' ? 1 : grade === 'good' ? 2 : 3;
      const nextDate = addDaysISO(today, days);
      await sql`
        UPDATE flashcards
        SET box = ${nextBox}, next_review_date = ${nextDate}
        WHERE id = ${fcid}
      `;
      return NextResponse.json({ ok: true, nextDate });
    }

    // Create custom flashcard
    if (action === 'create_flashcard') {
      const id = `fc-custom-${Date.now()}`;
      const subject = String(body.subject || 'Geral').slice(0, 120);
      const front = String(body.front || '').trim().slice(0, 500);
      const back = String(body.back || '').trim().slice(0, 800);
      const tag = String(body.tag || 'Personalizado').slice(0, 80);
      if (!front || !back) return NextResponse.json({ error: 'Preencha frente e verso' }, { status: 400 });

      await sql`
        INSERT INTO flashcards (id, plan_id, subject, front, back, tag, box, next_review_date)
        VALUES (${id}, ${planId}, ${subject}, ${front}, ${back}, ${tag}, 1, ${todayISO()})
      `;
      return NextResponse.json({ ok: true, id });
    }

    // Delete custom flashcard
    if (action === 'delete_flashcard') {
      const fcid = String(body.id || '');
      await sql`DELETE FROM flashcards WHERE id = ${fcid}`;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 });
  }
}
