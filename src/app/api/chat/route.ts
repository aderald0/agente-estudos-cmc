import { NextResponse } from 'next/server';
import { addDaysISO, checkPin, ensureSchema, getSql, todayISO } from '../../../lib/db';
import { EXAM_DATE } from '../../../lib/syllabus';

const AGENT_TOOLS = [{
  functionDeclarations: [
    {
      name: 'set_study_queue',
      description: 'Adiciona, remove ou substitui tópicos na fila de estudo de hoje/data específica.',
      parameters: {
        type: 'OBJECT',
        properties: {
          topic_ids: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Lista de IDs dos tópicos do edital' },
          action: { type: 'STRING', enum: ['add', 'remove', 'replace_today'] },
          study_date: { type: 'STRING', description: 'Data YYYY-MM-DD (opcional, padrão hoje)' },
        },
        required: ['topic_ids', 'action'],
      },
    },
    {
      name: 'schedule_review',
      description: 'Agenda revisão espaçada de um tópico para N dias a partir de hoje.',
      parameters: {
        type: 'OBJECT',
        properties: {
          topic_id: { type: 'STRING' },
          days_from_now: { type: 'INTEGER' },
        },
        required: ['topic_id', 'days_from_now'],
      },
    },
    {
      name: 'mark_review_done',
      description: 'Marca a revisão agendada de um tópico como concluída e avança o ciclo SRS (1 -> 3 -> 7 -> 15 -> dominado).',
      parameters: {
        type: 'OBJECT',
        properties: { topic_id: { type: 'STRING' } },
        required: ['topic_id'],
      },
    },
    {
      name: 'log_study_session',
      description: 'Registra estudo feito em um tópico: soma minutos, soma acertos/total de questões, atualiza domínio (1-5) e notas, e opcionalmente conclui da fila agendando revisão +1d.',
      parameters: {
        type: 'OBJECT',
        properties: {
          topic_id: { type: 'STRING' },
          minutes: { type: 'INTEGER' },
          q_right: { type: 'INTEGER' },
          q_total: { type: 'INTEGER' },
          mastery: { type: 'INTEGER' },
          notes: { type: 'STRING' },
          mark_completed: { type: 'BOOLEAN' },
        },
        required: ['topic_id'],
      },
    },
    {
      name: 'add_error_entry',
      description: 'Registra uma questão errada ou lacuna no Caderno de Erros.',
      parameters: {
        type: 'OBJECT',
        properties: {
          subject: { type: 'STRING' },
          topic: { type: 'STRING' },
          mistake: { type: 'STRING' },
          correction: { type: 'STRING' },
        },
        required: ['subject', 'topic', 'mistake', 'correction'],
      },
    },
    {
      name: 'create_custom_topic',
      description: 'Cria um tópico personalizado extra no edital.',
      parameters: {
        type: 'OBJECT',
        properties: {
          subject: { type: 'STRING' },
          title: { type: 'STRING' },
          overlap: { type: 'STRING', enum: ['ambos-identico', 'exclusivo-analista', 'exclusivo-tecnico'] },
          set_for_today: { type: 'BOOLEAN' },
        },
        required: ['subject', 'title'],
      },
    },
  ],
}];

async function executeDbTool(name: string, args: Record<string, unknown>) {
  const sql = getSql();
  const today = todayISO();

  if (name === 'set_study_queue') {
    const ids = Array.isArray(args.topic_ids) ? args.topic_ids.map(String) : [];
    const dt = String(args.study_date || today);
    const action = String(args.action || 'add');

    if (action === 'replace_today') {
      await sql`UPDATE topics SET study_queue = false WHERE study_queue = true`;
    }

    const updated: string[] = [];
    for (const id of ids) {
      if (action === 'remove') {
        await sql`UPDATE topics SET study_queue = false WHERE id = ${id}`;
      } else {
        const res = await sql`
          UPDATE topics
          SET study_queue = true,
              study_date = ${dt},
              status = CASE WHEN status = 'nao-iniciado' THEN 'estudando' ELSE status END
          WHERE id = ${id}
          RETURNING id
        `;
        if (res[0]) updated.push(res[0].id);
      }
    }
    return { result: { ok: true, updated }, trace: `Fila de estudo (${action}): ${updated.join(', ') || 'atualizada'}` };
  }

  if (name === 'schedule_review') {
    const id = String(args.topic_id);
    const d = Math.max(1, Number(args.days_from_now) || 1);
    const nextDate = addDaysISO(today, d);
    const res = await sql`
      UPDATE topics
      SET review_queue = true, review_interval = ${d}, next_review_date = ${nextDate}, status = 'revisar'
      WHERE id = ${id}
      RETURNING title
    `;
    if (!res[0]) return { result: { ok: false, error: 'topic_id não encontrado' }, trace: '' };
    return { result: { ok: true, nextReviewDate: nextDate }, trace: `Revisão (+${d}d): ${String(res[0].title).slice(0, 38)}` };
  }

  if (name === 'mark_review_done') {
    const id = String(args.topic_id);
    const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
    const t = rows[0];
    if (!t) return { result: { ok: false, error: 'topic_id não encontrado' }, trace: '' };

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
      WHERE id = ${id}
    `;
    await sql`
      INSERT INTO study_logs (date, topic_id, subject, title, minutes, kind)
      VALUES (${today}, ${t.id}, ${t.subject}, ${t.title}, 15, ${kind})
    `;
    return {
      result: { ok: true, status, nextReviewDate: nextDate },
      trace: `Revisado: ${String(t.title).slice(0, 32)} (${status === 'dominado' ? 'Dominado' : 'Próx +' + nextInt + 'd'})`,
    };
  }

  if (name === 'log_study_session') {
    const id = String(args.topic_id);
    const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
    const t = rows[0];
    if (!t) return { result: { ok: false, error: 'topic_id não encontrado' }, trace: '' };

    const min = Math.max(0, Number(args.minutes) || 0);
    const qr = Math.max(0, Number(args.q_right) || 0);
    const qt = Math.max(qr, Number(args.q_total) || 0);
    const newMastery = args.mastery ? Math.min(5, Math.max(1, Number(args.mastery))) : Number(t.mastery);
    const noteAppend = args.notes ? String(args.notes) : '';
    const newNotes = noteAppend ? (t.notes ? `${t.notes}\n• ${noteAppend}` : noteAppend) : t.notes;
    const markComp = Boolean(args.mark_completed);

    const nextSq = markComp ? false : t.study_queue;
    const nextRq = markComp ? true : t.review_queue;
    const nextInt = markComp ? 1 : t.review_interval;
    const nextRevDate = markComp ? addDaysISO(today, 1) : t.next_review_date;
    const nextStatus = markComp ? 'revisar' : (t.status === 'nao-iniciado' ? 'estudando' : t.status);

    await sql`
      UPDATE topics
      SET minutes_studied = minutes_studied + ${min},
          q_right = q_right + ${qr},
          q_total = q_total + ${qt},
          mastery = ${newMastery},
          notes = ${newNotes},
          study_queue = ${nextSq},
          review_queue = ${nextRq},
          review_interval = ${nextInt},
          next_review_date = ${nextRevDate},
          status = ${nextStatus}
      WHERE id = ${id}
    `;
    const kind = qt ? `Sessão + ${qr}/${qt}q` : 'Sessão via Agente';
    await sql`
      INSERT INTO study_logs (date, topic_id, subject, title, minutes, kind)
      VALUES (${today}, ${t.id}, ${t.subject}, ${t.title}, ${min || 25}, ${kind})
    `;

    return {
      result: { ok: true, topic: t.title, qRight: Number(t.q_right) + qr, qTotal: Number(t.q_total) + qt, mastery: newMastery },
      trace: `Salvo: ${id}${qt ? ` (${qr}/${qt}q)` : ''}${min ? ` (${min}m)` : ''}`,
    };
  }

  if (name === 'add_error_entry') {
    const subject = String(args.subject || 'Geral');
    const topic = String(args.topic || 'Geral');
    const mistake = String(args.mistake || '');
    const correction = String(args.correction || '');
    await sql`
      INSERT INTO error_entries (date, subject, topic, mistake, correction)
      VALUES (${today}, ${subject}, ${topic}, ${mistake}, ${correction})
    `;
    return { result: { ok: true }, trace: `Erro registrado: ${topic}` };
  }

  if (name === 'create_custom_topic') {
    const id = `custom-${Date.now()}`;
    const subject = String(args.subject || 'Legislação Municipal');
    const title = String(args.title || 'Tópico Extra');
    const overlap = String(args.overlap || 'ambos-identico');
    const sq = args.set_for_today !== false;
    await sql`
      INSERT INTO topics (id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
      VALUES (${id}, ${subject}, ${title}, ${overlap}, 'alta', ${sq ? 'estudando' : 'nao-iniciado'}, ${sq}, ${sq ? today : ''}, 999)
    `;
    return { result: { ok: true, id }, trace: `Tópico criado: ${title}` };
  }

  return { result: { ok: false, error: 'Ferramenta desconhecida' }, trace: '' };
}

export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada nas variáveis de ambiente da Vercel.' }, { status: 400 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const { message } = await req.json();
    const userText = String(message || '').trim();
    if (!userText) return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });

    await sql`INSERT INTO chat_messages (role, content) VALUES ('user', ${userText})`;

    const [topics, errors, logs, recentChat] = await Promise.all([
      sql`SELECT id, subject, title, overlap, priority, status, study_queue, study_date, review_queue, next_review_date, review_interval, mastery, q_right, q_total, minutes_studied FROM topics ORDER BY sort_order ASC`,
      sql`SELECT date, subject, topic, mistake, correction FROM error_entries ORDER BY id DESC LIMIT 12`,
      sql`SELECT date, subject, title, minutes, kind FROM study_logs ORDER BY id DESC LIMIT 8`,
      sql`SELECT role, content FROM chat_messages WHERE role IN ('user','assistant') ORDER BY id DESC LIMIT 16`,
    ]);

    const today = todayISO();
    const daysLeft = Math.max(0, Math.ceil((new Date(`${EXAM_DATE}T08:00:00`).getTime() - Date.now()) / 86400000));
    const snapshot = {
      today,
      examDate: EXAM_DATE,
      daysLeft,
      topics: topics.map(t => ({
        id: t.id,
        sub: t.subject,
        title: t.title,
        ov: t.overlap,
        pri: t.priority,
        st: t.status,
        sq: t.study_queue,
        sd: t.study_date || undefined,
        rq: t.review_queue,
        rd: t.next_review_date || undefined,
        ri: t.review_interval,
        m: t.mastery,
        q: t.q_total ? `${t.q_right}/${t.q_total}` : undefined,
        min: t.minutes_studied || undefined,
      })),
      recentErrors: errors,
      recentLogs: logs,
    };

    const systemPrompt = `Você é o Agente Mentor Pessoal de Estudos do usuário para o Concurso da Câmara Municipal de Cuiabá-MT (Edital nº 001/2026-CMC, banca Instituto Selecon, prova em 20/12/2026).
O usuário fará AMBOS os cargos no mesmo dia (Item 10.1):
- MANHÃ: Analista Legislativo - Tecnologia da Informação (5 vagas; Básicos 15q×1,00 | Gerais 15q×1,00 | Específicos 40q×1,75 = Legislação Municipal + TI; Discursiva 100 pts 20-30 linhas; Títulos até 9 pts).
- TARDE: Técnico Legislativo (11 vagas; Básicos 15q×1,00 inclui Legislação | Gerais 15q×1,00 | Específicos 40q×1,75 = Adm Pública/Dir Adm, Const arts 37-41, Poder Legislativo, Redação Oficial, Arquivologia, Contabilidade Pública, Seg. Trabalho; Discursiva 100 pts 20-30 linhas).

Cruzamento estratégico:
- 6 apostilas são 100% idênticas (Português, Informática, Hist/Geo MT, Ética, Relações Interpessoais, Legislação Municipal).
- RLM de Analista (55 págs) cobre 100% do Técnico + Contagem/Probabilidade.
- Legislação Municipal vale 1,75 no Analista e 1,00 no Técnico.
- Administração Pública vale 1,00 no Analista e 1,75 (itens 1-4 de Específicos) no Técnico.

REGRAS DE INTERAÇÃO ORGÂNICA:
1. Responda em português brasileiro claro, prático e encorajador.
2. Quando o usuário perguntar "o que vamos estudar hoje?" ou informar tempo disponível, verifique revisões vencidas (rd <= today) e tópicos de alta prioridade nos 2 cargos, proponha um plano objetivo e USE set_study_queue para já deixar os tópicos marcados para hoje.
3. Sempre que o usuário relatar o que estudou, quantas questões acertou, uma revisão concluída ou um erro cometido, USE IMEDIATAMENTE as ferramentas (log_study_session, mark_review_done, schedule_review, add_error_entry) para persistir no banco PostgreSQL.
4. Ao aplicar quizzes estilo Selecon (A, B, C, D), corrija a resposta do usuário no turno seguinte e salve os acertos com log_study_session.
5. Use apenas topic_ids existentes no JSON abaixo.

ESTADO ATUAL DO ALUNO NO NEON (JSON):
${JSON.stringify(snapshot)}`;

    const history: Array<{ role: string; parts: Array<Record<string, unknown>> }> = recentChat.reverse().map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const traces: string[] = [];
    let finalReply = '';
    let steps = 0;

    while (steps < 5) {
      steps++;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: history,
          tools: AGENT_TOOLS,
          generationConfig: { temperature: 0.5 },
        }),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(`Gemini API HTTP ${res.status}: ${errTxt.slice(0, 260)}`);
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const fnCalls = parts.filter((p: Record<string, unknown>) => p.functionCall);
      const textParts = parts.filter((p: Record<string, unknown>) => p.text).map((p: Record<string, unknown>) => String(p.text)).join('\n');

      if (fnCalls.length > 0) {
        history.push({ role: 'model', parts });
        const fnResponses = [];
        for (const p of fnCalls) {
          const fc = p.functionCall as { name: string; args?: Record<string, unknown> };
          const { result, trace } = await executeDbTool(fc.name, fc.args || {});
          if (trace) traces.push(trace);
          fnResponses.push({
            functionResponse: { name: fc.name, response: result },
          });
        }
        history.push({ role: 'user', parts: fnResponses });
      } else {
        finalReply = textParts || 'Concluído.';
        break;
      }
    }

    if (traces.length > 0) {
      await sql`INSERT INTO chat_messages (role, content) VALUES ('tool_trace', ${JSON.stringify(traces)})`;
    }
    await sql`INSERT INTO chat_messages (role, content) VALUES ('assistant', ${finalReply})`;

    return NextResponse.json({ ok: true, reply: finalReply, traces });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: 'PIN inválido' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    await sql`DELETE FROM chat_messages`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}
