import { NextResponse } from 'next/server';
import { checkPin, ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    await sql`
      INSERT INTO error_entries (date, subject, topic, mistake, correction)
      VALUES (${todayISO()}, ${body.subject || 'Geral'}, ${body.topic || 'Geral'}, ${body.mistake}, ${body.correction})
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const { id } = await req.json();
    await sql`DELETE FROM error_entries WHERE id = ${Number(id)}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}
