import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { DEFAULT_PLAN_ID, ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const planId = String(body.plan_id || DEFAULT_PLAN_ID);
    const subject = String(body.subject || 'Geral').slice(0, 120);
    const topic = String(body.topic || 'Geral').slice(0, 160);
    const mistake = String(body.mistake || '').slice(0, 600);
    const correction = String(body.correction || '').slice(0, 600);

    const existing = await sql`
      SELECT id FROM error_entries WHERE plan_id = ${planId} AND subject = ${subject} AND topic = ${topic} LIMIT 1
    `;
    if (existing.length > 0) {
      await sql`
        UPDATE error_entries
        SET date = ${todayISO()}, mistake = ${mistake}, correction = ${correction}
        WHERE id = ${existing[0].id}
      `;
    } else {
      await sql`
        INSERT INTO error_entries (plan_id, date, subject, topic, mistake, correction)
        VALUES (${planId}, ${todayISO()}, ${subject}, ${topic}, ${mistake}, ${correction})
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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
