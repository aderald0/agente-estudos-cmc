import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const sc = Math.min(80, Math.max(0, Number(body.score_content) || 0));
    const sf = Math.min(20, Math.max(0, Number(body.score_formal) || 0));
    await sql`
      INSERT INTO essays (date, cargo, title, text, score_content, score_formal, feedback)
      VALUES (${todayISO()}, ${String(body.cargo || '')}, ${String(body.title || 'Rascunho')}, ${String(body.text || '')}, ${sc}, ${sf}, ${String(body.feedback || '')})
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}
