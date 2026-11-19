import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { addDaysISO, DEFAULT_PLAN_ID, ensureSchema, getSql, todayISO } from '../../../lib/db';
import { EXAM_DATE } from '../../../lib/syllabus';

const AGENT_TOOLS = [{
  functionDeclarations: [
    {
      name: 'set_study_queue',
      description: 'Adiciona, remove ou substitui tópicos na fila de estudo de hoje/data específica.',
      parameters: {
        type: 'OBJECT',
        properties: {
          topic_ids: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Lista de IDs dos tópicos' },
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
      description: 'Marca a revisão agendada de um tópico como concluída e avança o ciclo (1 -> 3 -> 7 -> 15 -> dominado).',
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
      description: 'Cria um tópico personalizado extra na grade do estudo ativo.',
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
    {
      name: 'create_flashcard',
      description: 'Cria um novo cartão de memória (frente e verso) no estudo ativo.',
      parameters: {
        type: 'OBJECT',
        properties: {
          subject: { type: 'STRING' },
          front: { type: 'STRING', description: 'Pergunta curta e direta na frente do cartão' },
          back: { type: 'STRING', description: 'Resposta objetiva em 1-2 linhas no verso' },
          tag: { type: 'STRING', description: 'Tag curta' },
        },
        required: ['subject', 'front', 'back'],
      },
    },
    {
      name: 'save_essay_evaluation',
      description: 'Salva no histórico do banco a avaliação de uma prova discursiva/redação corrigida pelo Mentor (80 pts conteúdo + 20 pts correção formal).',
      parameters: {
        type: 'OBJECT',
        properties: {
          cargo: { type: 'STRING' },
          title: { type: 'STRING' },
          text: { type: 'STRING' },
          score_content: { type: 'INTEGER', description: 'Nota de conteúdo de 0 a 80' },
          score_formal: { type: 'INTEGER', description: 'Nota de correção formal de 0 a 20' },
          feedback: { type: 'STRING', description: 'Resumo do feedback em 1-2 frases' },
        },
        required: ['cargo', 'title', 'score_content', 'score_formal'],
      },
    },
  ],
}];

async function executeDbTool(planId: string, name: string, args: Record<string, unknown>) {
  const sql = getSql();
  const today = todayISO();

  if (name === 'set_study_queue') {
    const ids = Array.isArray(args.topic_ids) ? args.topic_ids.map(String) : [];
    const dt = String(args.study_date || today);
    const action = String(args.action || 'add');

    if (action === 'replace_today') {
      await sql`UPDATE topics SET study_queue = false WHERE plan_id = ${planId} AND study_queue = true`;
    }

    const updated: string[] = [];
    for (const id of ids) {
      if (action === 'remove') {
        await sql`UPDATE topics SET study_queue = false WHERE plan_id = ${planId} AND id = ${id}`;
      } else {
        const res = await sql`
          UPDATE topics
          SET study_queue = true,
              study_date = ${dt},
              status = CASE WHEN status = 'nao-iniciado' THEN 'estudando' ELSE status END
          WHERE plan_id = ${planId} AND id = ${id}
          RETURNING id
        `;
        if (res[0]) updated.push(res[0].id);
      }
    }
    return { result: { ok: true, updated }, trace: `Plano de hoje atualizado (${updated.length} item(ns))` };
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
    return { result: { ok: true, nextReviewDate: nextDate }, trace: `Revisão agendada (+${d}d): ${String(res[0].title).slice(0, 38)}` };
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
      INSERT INTO study_logs (plan_id, date, topic_id, subject, title, minutes, kind)
      VALUES (${t.plan_id || planId}, ${today}, ${t.id}, ${t.subject}, ${t.title}, 15, ${kind})
    `;
    return {
      result: { ok: true, status, nextReviewDate: nextDate },
      trace: `Revisado: ${String(t.title).slice(0, 32)}`,
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
    const kind = qt ? `Sessão + ${qr}/${qt}q` : 'Sessão registrada';
    await sql`
      INSERT INTO study_logs (plan_id, date, topic_id, subject, title, minutes, kind)
      VALUES (${t.plan_id || planId}, ${today}, ${t.id}, ${t.subject}, ${t.title}, ${min || 25}, ${kind})
    `;

    return {
      result: { ok: true, topic: t.title, qRight: Number(t.q_right) + qr, qTotal: Number(t.q_total) + qt, mastery: newMastery },
      trace: `Progresso salvo: ${String(t.title).slice(0, 30)}`,
    };
  }

  if (name === 'add_error_entry') {
    const subject = String(args.subject || 'Geral');
    const topic = String(args.topic || 'Geral');
    const mistake = String(args.mistake || '');
    const correction = String(args.correction || '');
    await sql`
      INSERT INTO error_entries (plan_id, date, subject, topic, mistake, correction)
      VALUES (${planId}, ${today}, ${subject}, ${topic}, ${mistake}, ${correction})
    `;
    return { result: { ok: true }, trace: `Salvo no Caderno: ${topic}` };
  }

  if (name === 'create_custom_topic') {
    const id = `custom-${Date.now()}`;
    const subject = String(args.subject || 'Geral');
    const title = String(args.title || 'Tópico Extra');
    const overlap = String(args.overlap || 'ambos-identico');
    const sq = args.set_for_today !== false;
    await sql`
      INSERT INTO topics (id, plan_id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
      VALUES (${id}, ${planId}, ${subject}, ${title}, ${overlap}, 'alta', ${sq ? 'estudando' : 'nao-iniciado'}, ${sq}, ${sq ? today : ''}, 999)
    `;
    return { result: { ok: true, id }, trace: `Tópico adicionado: ${title}` };
  }

  if (name === 'create_flashcard') {
    const id = `fc-agent-${Date.now()}`;
    const subject = String(args.subject || 'Geral').slice(0, 120);
    const front = String(args.front || '').slice(0, 500);
    const back = String(args.back || '').slice(0, 800);
    const tag = String(args.tag || 'Cartão').slice(0, 80);
    await sql`
      INSERT INTO flashcards (id, plan_id, subject, front, back, tag, box, next_review_date)
      VALUES (${id}, ${planId}, ${subject}, ${front}, ${back}, ${tag}, 1, ${today})
    `;
    return { result: { ok: true, id }, trace: `Cartão criado: ${tag}` };
  }

  if (name === 'save_essay_evaluation') {
    const cargo = String(args.cargo || 'Discursiva');
    const title = String(args.title || 'Treino Discursivo');
    const text = String(args.text || '');
    const sc = Math.min(80, Math.max(0, Number(args.score_content) || 0));
    const sf = Math.min(20, Math.max(0, Number(args.score_formal) || 0));
    const fb = String(args.feedback || '').slice(0, 600);
    await sql`
      INSERT INTO essays (plan_id, date, cargo, title, text, score_content, score_formal, feedback)
      VALUES (${planId}, ${today}, ${cargo}, ${title}, ${text}, ${sc}, ${sf}, ${fb})
    `;
    return { result: { ok: true, total: sc + sf }, trace: `Avaliação salva: ${sc + sf}/100 pts` };
  }

  if (name === 'bulk_add_topics') {
    const list = Array.isArray(args.topics) ? (args.topics as Array<Record<string, unknown>>) : [];
    let added = 0;
    const baseTs = Date.now();
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const subject = String(item.subject || 'Geral').slice(0, 120);
      const title = String(item.title || '').trim().slice(0, 220);
      if (!title) continue;
      const pri = item.priority === 'alta' || item.priority === 'media' || item.priority === 'baixa' ? String(item.priority) : 'alta';
      const id = `${planId}-bulk-${baseTs}-${i + 1}`;
      await sql`
        INSERT INTO topics (id, plan_id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
        VALUES (${id}, ${planId}, ${subject}, ${title}, 'ambos-identico', ${pri}, 'nao-iniciado', false, '', ${500 + i})
      `;
      added++;
    }
    return { result: { ok: true, added }, trace: `${added} tópicos adicionados à grade` };
  }

  return { result: { ok: false, error: 'Ferramenta desconhecida' }, trace: '' };
}

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada nas variáveis de ambiente da Vercel.' }, { status: 400 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const planId = String(body.plan_id || DEFAULT_PLAN_ID);
    const userText = String(body.message || '').trim();
    const fileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64 : '';
    const fileName = typeof body.fileName === 'string' ? body.fileName : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'application/pdf';

    if (!userText && !fileBase64) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    const storedUserMsg = fileName
      ? `${userText ? userText + '\n' : ''}[Arquivo anexado: ${fileName}]`
      : userText;

    await sql`INSERT INTO chat_messages (plan_id, role, content) VALUES (${planId}, 'user', ${storedUserMsg})`;

    const [planRows, topics, errors, logs, recentChat] = await Promise.all([
      sql`SELECT * FROM study_plans WHERE id = ${planId} LIMIT 1`,
      sql`SELECT id, subject, title, overlap, priority, status, study_queue, study_date, review_queue, next_review_date, review_interval, mastery, q_right, q_total, minutes_studied FROM topics WHERE plan_id = ${planId} ORDER BY sort_order ASC`,
      sql`SELECT date, subject, topic, mistake, correction FROM error_entries WHERE plan_id = ${planId} ORDER BY id DESC LIMIT 12`,
      sql`SELECT date, subject, title, minutes, kind FROM study_logs WHERE plan_id = ${planId} ORDER BY id DESC LIMIT 8`,
      sql`SELECT role, content FROM chat_messages WHERE plan_id = ${planId} AND role IN ('user','assistant') ORDER BY id DESC LIMIT 16`,
    ]);

    const activePlan = planRows[0];
    const today = todayISO();
    const targetDate = activePlan?.target_date || EXAM_DATE;
    const daysLeft = targetDate
      ? Math.max(0, Math.ceil((new Date(`${targetDate}T08:00:00`).getTime() - Date.now()) / 86400000))
      : null;

    const snapshot = {
      today,
      planTitle: activePlan?.title || 'Câmara de Cuiabá 2026',
      planCategory: activePlan?.category || 'concurso-duplo',
      targetDate,
      daysLeft,
      dailyHours: activePlan?.daily_hours || '2h/dia',
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

    const isCmc = planId === DEFAULT_PLAN_ID;
    const contextHeader = isCmc
      ? `Você é o Mentor de Estudos do usuário para o Concurso da Câmara Municipal de Cuiabá-MT (Edital nº 001/2026-CMC, banca Instituto Selecon, prova em 20/12/2026).
O usuário fará AMBOS os cargos no mesmo dia:
- MANHÃ: Analista Legislativo - Tecnologia da Informação (Básicos 15q×1,00 | Gerais 15q×1,00 | Específicos 40q×1,75 = Legislação Municipal + TI; Discursiva 100 pts 20-30 linhas).
- TARDE: Técnico Legislativo (Básicos 15q×1,00 inclui Legislação | Gerais 15q×1,00 | Específicos 40q×1,75 = Adm Pública/Dir Adm, Const arts 37-41, Poder Legislativo, Redação Oficial, Arquivologia, Contabilidade Pública, Seg. Trabalho; Discursiva 100 pts 20-30 linhas).`
      : `Você é o Mentor de Estudos do usuário para "${activePlan?.title || 'Estudo Personalizado'}" (${activePlan?.subtitle || activePlan?.category || 'Geral'}).
Meta diária configurada: ${activePlan?.daily_hours || '2h/dia'}.${targetDate ? ` Data da avaliação/prova: ${targetDate} (${daysLeft} dias restantes).` : ''}`;

    const systemPrompt = `${contextHeader}

REGRAS DE INTERAÇÃO (OBRIGATÓRIO):
1. Seja natural, humano, direto ao ponto e conciso (máximo 120 palavras por resposta, exceto quando corrigir redação/discursiva ou explicar questão).
2. PROIBIDO usar tabelas markdown ("| ... |"), PROIBIDO usar emojis, PROIBIDO usar jargões técnicos robóticos ("SRS", "NLM", "Adaptação Orgânica"). Use apenas texto limpo e listas simples ("- ").
3. Quando o usuário perguntar o que estudar hoje ou informar tempo disponível, cheque revisões pendentes (rd <= today) e tópicos prioritários, USE set_study_queue para atualizar a fila e responda em até 3 itens curtos.
4. Sempre que o usuário relatar o que estudou, acertos, revisão feita, erro cometido ou anexar um PDF/pedir para adicionar disciplinas faltantes, USE IMEDIATAMENTE as ferramentas do banco (log_study_session, mark_review_done, schedule_review, add_error_entry, create_custom_topic, bulk_add_topics, create_flashcard) e confirme de forma simples. Quando precisar adicionar vários tópicos ou disciplinas do edital, use bulk_add_topics para inserir todos de uma só vez.
5. Use apenas topic_ids existentes no JSON abaixo ao atualizar tópicos existentes.

ESTADO ATUAL DO ESTUDO (JSON):
${JSON.stringify(snapshot)}`;

    const history: Array<{ role: string; parts: Array<Record<string, unknown>> }> = recentChat.reverse().map((m, idx, arr) => {
      const isLastUser = idx === arr.length - 1 && m.role === 'user' && fileBase64;
      if (isLastUser) {
        return {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: fileBase64 } },
            { text: userText || `Analise o documento anexado (${fileName}) e extraia todos os tópicos e disciplinas faltantes usando bulk_add_topics.` },
          ],
        };
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      };
    });

    const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
    const candidateModels = Array.from(new Set([primaryModel, 'gemini-3.8-flash', 'gemini-flash-latest']));

    const traces: string[] = [];
    const collectedTexts: string[] = [];
    let finalReply = '';
    let steps = 0;

    while (steps < 5) {
      steps++;
      let res: Response | null = null;
      let errTxt = '';

      for (const m of candidateModels) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: history,
            tools: AGENT_TOOLS,
            generationConfig: { temperature: 0.35, maxOutputTokens: 8192 },
          }),
        });
        if (res.ok) break;
        errTxt = await res.text();
        if (res.status !== 404) break;
      }

      if (!res || !res.ok) {
        throw new Error(`Gemini API HTTP ${res?.status || 500}: ${errTxt.slice(0, 260)}`);
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const fnCalls = parts.filter((p: Record<string, unknown>) => p.functionCall);
      const textParts = parts
        .filter((p: Record<string, unknown>) => typeof p.text === 'string' && !p.thought)
        .map((p: Record<string, unknown>) => String(p.text).trim())
        .filter(Boolean)
        .join('\n');

      if (textParts) {
        collectedTexts.push(textParts);
      }

      if (fnCalls.length > 0) {
        history.push({ role: 'model', parts });
        const fnResponses = [];
        for (const p of fnCalls) {
          const fc = p.functionCall as { name: string; args?: Record<string, unknown> };
          const { result, trace } = await executeDbTool(planId, fc.name, fc.args || {});
          if (trace) traces.push(trace);
          fnResponses.push({
            functionResponse: { name: fc.name, response: result },
          });
        }
        history.push({ role: 'user', parts: fnResponses });
      } else {
        finalReply = collectedTexts.join('\n\n') || (traces.length > 0 ? `Atualizado: ${traces.join(' · ')}.` : 'Não foi possível gerar a resposta neste momento.');
        break;
      }
    }

    if (!finalReply) {
      finalReply = collectedTexts.join('\n\n') || (traces.length > 0 ? `Atualizado: ${traces.join(' · ')}.` : 'Pronto.');
    }

    if (traces.length > 0) {
      await sql`INSERT INTO chat_messages (plan_id, role, content) VALUES (${planId}, 'tool_trace', ${JSON.stringify(traces)})`;
    }
    await sql`INSERT INTO chat_messages (plan_id, role, content) VALUES (${planId}, 'assistant', ${finalReply})`;

    return NextResponse.json({ ok: true, reply: finalReply, traces });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  try {
    await ensureSchema();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId')?.trim() || DEFAULT_PLAN_ID;
    await sql`DELETE FROM chat_messages WHERE plan_id = ${planId}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 500 });
  }
}
