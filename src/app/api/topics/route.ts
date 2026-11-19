import { NextResponse } from 'next/server';
import { addDaysISO, checkPin, ensureSchema, getSql, todayISO } from '../../../lib/db';

export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();

    if (body.action === 'create') {
      const id = `custom-${Date.now()}`;
      const today = todayISO();
      const sq = body.setForToday !== false;
      await sql`
        INSERT INTO topics (id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
        VALUES (${id}, ${body.subject || 'Legislação Municipal'}, ${body.title}, ${body.overlap || 'ambos-identico'}, 'alta', ${sq ? 'estudando' : 'nao-iniciado'}, ${sq}, ${sq ? today : ''}, 999)
      `;
      return NextResponse.json({ ok: true, id });
    }

    if (body.action === 'toggle_study') {
      const rows = await sql`SELECT * FROM topics WHERE id = ${body.id}`;
      const t = rows[0];
      if (!t) return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
      const nextSq = !t.study_queue;
      const nextDate = nextSq ? (t.study_date || todayISO()) : '';
      const nextStatus = nextSq && t.status === 'nao-iniciado' ? 'estudando' : t.status;
      await sql`UPDATE topics SET study_queue = ${nextSq}, study_date = ${nextDate}, status = ${nextStatus} WHERE id = ${body.id}`;
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'toggle_review') {
      const rows = await sql`SELECT * FROM topics WHERE id = ${body.id}`;
      const t = rows[0];
      if (!t) return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
      const nextRq = !t.review_queue;
      const nextDate = nextRq ? (t.next_review_date || todayISO()) : '';
      const nextInt = nextRq && !t.review_interval ? 1 : t.review_interval;
      const nextStatus = nextRq ? 'revisar' : t.status;
      await sql`UPDATE topics SET review_queue = ${nextRq}, next_review_date = ${nextDate}, review_interval = ${nextInt}, status = ${nextStatus} WHERE id = ${body.id}`;
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'complete_study') {
      const rows = await sql`SELECT * FROM topics WHERE id = ${body.id}`;
      const t = rows[0];
      if (!t) return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
      const today = todayISO();
      const nextRev = addDaysISO(today, 1);
      const mins = Number(body.minutes) || 30;
      await sql`
        UPDATE topics
        SET study_queue = false, review_queue = true, review_interval = 1,
            next_review_date = ${nextRev}, status = 'revisar',
            minutes_studied = minutes_studied + ${mins},
            mastery = GREATEST(mastery, 2)
        WHERE id = ${body.id}
      `;
      await sql`
        INSERT INTO study_logs (date, topic_id, subject, title, minutes, kind)
        VALUES (${today}, ${t.id}, ${t.subject}, ${t.title}, ${mins}, 'Estudo concluído → Rev. +1d')
      `;
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'complete_review') {
      const rows = await sql`SELECT * FROM topics WHERE id = ${body.id}`;
      const t = rows[0];
      if (!t) return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
      const today = todayISO();
      const seq = [1, 3, 7, 15];
      const idx = seq.indexOf(Number(t.review_interval));
      let rq = true;
      let nextInt = 1;
      let nextDate = addDaysISO(today, 1);
      let status = 'revisar';
      let mastery = Number(t.mastery) || 1;
      let kind = 'Rev. feita → +1d';

      if (idx >= 0 && idx < seq.length - 1) {
        nextInt = seq[idx + 1];
        nextDate = addDaysISO(today, nextInt);
        mastery = Math.min(5, Math.max(mastery, idx + 3));
        kind = `Rev. feita → +${nextInt}d`;
      } else if (idx === seq.length - 1) {
        rq = false;
        nextInt = 15;
        nextDate = '';
        status = 'dominado';
        mastery = 5;
        kind = 'Revisão final → Dominado';
      }

      await sql`
        UPDATE topics
        SET review_queue = ${rq}, review_interval = ${nextInt}, next_review_date = ${nextDate},
            status = ${status}, mastery = ${mastery}
        WHERE id = ${body.id}
      `;
      await sql`
        INSERT INTO study_logs (date, topic_id, subject, title, minutes, kind)
        VALUES (${today}, ${t.id}, ${t.subject}, ${t.title}, 15, ${kind})
      `;
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'log_timer') {
      const rows = await sql`SELECT * FROM topics WHERE id = ${body.id}`;
      const t = rows[0];
      if (!t) return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
      const mins = Math.max(1, Number(body.minutes) || 25);
      const nextStatus = t.status === 'nao-iniciado' ? 'estudando' : t.status;
      await sql`UPDATE topics SET minutes_studied = minutes_studied + ${mins}, status = ${nextStatus} WHERE id = ${body.id}`;
      await sql`
        INSERT INTO study_logs (date, topic_id, subject, title, minutes, kind)
        VALUES (${todayISO()}, ${t.id}, ${t.subject}, ${t.title}, ${mins}, 'Timer de Foco')
      `;
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'update') {
      const qr = Math.max(0, Number(body.q_right) || 0);
      const qt = Math.max(qr, Number(body.q_total) || 0);
      const mastery = Math.min(5, Math.max(1, Number(body.mastery) || 1));
      const sq = Boolean(body.study_queue);
      const rq = Boolean(body.review_queue);
      let status = 'nao-iniciado';
      if (mastery === 5 && !sq) status = 'dominado';
      else if (rq) status = 'revisar';
      else if (sq || qt > 0) status = 'estudando';

      await sql`
        UPDATE topics
        SET study_queue = ${sq},
            study_date = ${sq ? (body.study_date || todayISO()) : ''},
            review_queue = ${rq},
            next_review_date = ${rq ? (body.next_review_date || addDaysISO(todayISO(), 1)) : ''},
            review_interval = ${rq ? Math.max(1, Number(body.review_interval) || 1) : 0},
            mastery = ${mastery},
            q_right = ${qr},
            q_total = ${qt},
            notes = ${body.notes || ''},
            status = ${status}
        WHERE id = ${body.id}
      `;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
