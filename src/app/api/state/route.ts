import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { ensureSchema, getSql } from '../../../lib/db';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    await ensureSchema();
    const sql = getSql();

    const [topics, logs, errors, essays, chat] = await Promise.all([
      sql`SELECT * FROM topics ORDER BY sort_order ASC, id ASC`,
      sql`SELECT * FROM study_logs ORDER BY id DESC LIMIT 40`,
      sql`SELECT * FROM error_entries ORDER BY id DESC LIMIT 100`,
      sql`SELECT * FROM essays ORDER BY id DESC LIMIT 30`,
      sql`SELECT * FROM chat_messages ORDER BY id ASC LIMIT 60`,
    ]);

    return NextResponse.json({
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      topics,
      logs,
      errors,
      essays,
      chat,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao conectar no banco Neon.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
