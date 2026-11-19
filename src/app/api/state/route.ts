import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { DEFAULT_PLAN_ID, ensureSchema, getSql } from '../../../lib/db';

export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const requestedPlanId = searchParams.get('planId')?.trim() || DEFAULT_PLAN_ID;

    const plans = await sql`SELECT * FROM study_plans ORDER BY created_at ASC`;
    const activePlan = plans.find(p => p.id === requestedPlanId) || plans[0];
    const planId = activePlan ? String(activePlan.id) : DEFAULT_PLAN_ID;

    const [topics, logs, errors, essays, chat, questions, flashcards] = await Promise.all([
      sql`SELECT * FROM topics WHERE plan_id = ${planId} ORDER BY sort_order ASC, id ASC`,
      sql`SELECT * FROM study_logs WHERE plan_id = ${planId} ORDER BY id DESC LIMIT 40`,
      sql`SELECT * FROM error_entries WHERE plan_id = ${planId} ORDER BY id DESC LIMIT 100`,
      sql`SELECT * FROM essays WHERE plan_id = ${planId} ORDER BY id DESC LIMIT 30`,
      sql`SELECT * FROM chat_messages WHERE plan_id = ${planId} ORDER BY id ASC LIMIT 60`,
      sql`SELECT * FROM practice_questions WHERE plan_id = ${planId} ORDER BY subject ASC, qnum ASC`,
      sql`SELECT * FROM flashcards WHERE plan_id = ${planId} ORDER BY next_review_date ASC, id ASC`,
    ]);

    return NextResponse.json({
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      plans,
      activePlan,
      topics,
      logs,
      errors,
      essays,
      chat,
      questions,
      flashcards,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao conectar no banco Neon.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
