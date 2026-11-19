import { NextResponse } from 'next/server';
import { checkPin, ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    await sql`
      INSERT INTO essays (date, cargo, title, text)
      VALUES (${todayISO()}, ${body.cargo || ''}, ${body.title || 'Rascunho'}, ${body.text || ''})
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}
