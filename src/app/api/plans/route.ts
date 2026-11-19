import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { DEFAULT_PLAN_ID, ensureSchema, getSql, todayISO } from '../../../lib/db';

interface ExtractedPlanPayload {
  ready: boolean;
  reply: string;
  plan?: {
    title: string;
    subtitle: string;
    category: 'faculdade' | 'concurso' | 'cursinho' | 'livre';
    syllabus_label: 'Edital' | 'Ementa' | 'Módulos' | 'Conteúdos';
    has_essay: boolean;
    target_date: string;
    daily_hours: string;
    hero_title: string;
    context_cards: Array<{ tag: string; title: string; sub: string; pill: string }>;
  };
  topics?: Array<{ subject: string; title: string; priority: 'alta' | 'media' | 'baixa' }>;
  questions?: Array<{
    subject: string;
    stem: string;
    options: Array<{ letter: string; text: string }>;
    answer: string;
  }>;
  flashcards?: Array<{ subject: string; front: string; back: string; tag: string }>;
}

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const action = String(body.action || 'analyze');

    // Delete a custom study plan
    if (action === 'delete') {
      const planId = String(body.plan_id || '');
      if (!planId || planId === DEFAULT_PLAN_ID) {
        return NextResponse.json({ error: 'O plano padrão não pode ser removido.' }, { status: 400 });
      }
      await Promise.all([
        sql`DELETE FROM topics WHERE plan_id = ${planId}`,
        sql`DELETE FROM study_logs WHERE plan_id = ${planId}`,
        sql`DELETE FROM error_entries WHERE plan_id = ${planId}`,
        sql`DELETE FROM essays WHERE plan_id = ${planId}`,
        sql`DELETE FROM chat_messages WHERE plan_id = ${planId}`,
        sql`DELETE FROM practice_questions WHERE plan_id = ${planId}`,
        sql`DELETE FROM flashcards WHERE plan_id = ${planId}`,
        sql`DELETE FROM study_plans WHERE id = ${planId}`,
      ]);
      return NextResponse.json({ ok: true });
    }

    // Save a prepared study plan directly into Neon Postgres
    if (action === 'create') {
      const draft = body.draft as ExtractedPlanPayload;
      if (!draft?.plan || !Array.isArray(draft.topics) || draft.topics.length === 0) {
        return NextResponse.json({ error: 'Estrutura do estudo incompleta.' }, { status: 400 });
      }

      const planId = `plan-${Date.now()}`;
      const today = todayISO();
      const p = draft.plan;

      const configJson = JSON.stringify({
        heroTitle: p.hero_title || `Sua programação de ${p.title} está pronta.`,
        contextCards: Array.isArray(p.context_cards) ? p.context_cards.slice(0, 3) : [],
      });

      await sql`
        INSERT INTO study_plans (id, title, subtitle, category, syllabus_label, has_essay, target_date, daily_hours, config_json)
        VALUES (
          ${planId},
          ${String(p.title || 'Novo Estudo').slice(0, 120)},
          ${String(p.subtitle || '').slice(0, 180)},
          ${String(p.category || 'livre')},
          ${String(p.syllabus_label || 'Conteúdos')},
          ${Boolean(p.has_essay)},
          ${String(p.target_date || '')},
          ${String(p.daily_hours || '2h por dia')},
          ${configJson}
        )
      `;

      // Insert topics and pre-populate the first 3 into Today's Study Queue so the user immediately has a daily schedule
      for (let i = 0; i < draft.topics.length; i++) {
        const t = draft.topics[i];
        const tid = `${planId}-t-${i + 1}`;
        const inTodayQueue = i < 3;
        const pri = t.priority === 'alta' || t.priority === 'media' || t.priority === 'baixa' ? t.priority : (i < 3 ? 'alta' : 'media');
        await sql`
          INSERT INTO topics (id, plan_id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
          VALUES (
            ${tid},
            ${planId},
            ${String(t.subject || p.title).slice(0, 120)},
            ${String(t.title || `Tópico ${i + 1}`).slice(0, 220)},
            'ambos-identico',
            ${pri},
            ${inTodayQueue ? 'estudando' : 'nao-iniciado'},
            ${inTodayQueue},
            ${inTodayQueue ? today : ''},
            ${i}
          )
        `;
      }

      // Insert extracted/generated practice questions
      const qs = Array.isArray(draft.questions) ? draft.questions : [];
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i];
        const qid = `${planId}-q-${i + 1}`;
        const opts = Array.isArray(q.options) && q.options.length >= 2
          ? q.options
          : [
              { letter: 'A', text: 'Alternativa A' },
              { letter: 'B', text: 'Alternativa B' },
              { letter: 'C', text: 'Alternativa C' },
              { letter: 'D', text: 'Alternativa D' },
            ];
        await sql`
          INSERT INTO practice_questions (id, plan_id, subject, qnum, stem, options_json, answer)
          VALUES (
            ${qid},
            ${planId},
            ${String(q.subject || p.title).slice(0, 120)},
            ${i + 1},
            ${String(q.stem || '')},
            ${JSON.stringify(opts)},
            ${String(q.answer || 'A').toUpperCase().slice(0, 1)}
          )
        `;
      }

      // Insert extracted/generated flashcards
      const fcs = Array.isArray(draft.flashcards) ? draft.flashcards : [];
      for (let i = 0; i < fcs.length; i++) {
        const fc = fcs[i];
        const fcid = `${planId}-fc-${i + 1}`;
        await sql`
          INSERT INTO flashcards (id, plan_id, subject, front, back, tag, box, next_review_date)
          VALUES (
            ${fcid},
            ${planId},
            ${String(fc.subject || p.title).slice(0, 120)},
            ${String(fc.front || '').slice(0, 500)},
            ${String(fc.back || '').slice(0, 800)},
            ${String(fc.tag || 'Conceito').slice(0, 80)},
            1,
            ${today}
          )
        `;
      }

      // Seed initial welcome assistant message in the new study plan's Mentor chat
      await sql`
        INSERT INTO chat_messages (plan_id, role, content)
        VALUES (
          ${planId},
          'assistant',
          ${`Plano de ${p.title} criado! Já organizei seus primeiros blocos na tela Hoje. Quando quiser reorganizar o dia, tirar dúvidas ou gerar novas questões, é só falar comigo.`}
        )
      `;

      return NextResponse.json({ ok: true, planId });
    }

    // Default action: 'analyze' — Multimodal PDF & Conversational Onboarding with Gemini
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada na Vercel.' }, { status: 400 });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const fileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64 : '';
    const fileName = typeof body.fileName === 'string' ? body.fileName : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'application/pdf';

    const systemInstruction = `Você é o assistente de configuração inicial de estudos do aplicativo Pierre.
Sua função é conversar de forma natural, humana e sem jargões técnicos para entender o que o usuário quer estudar (ou ler o documento PDF/texto anexado por ele) e montar um plano de estudos orgânico e realista.

REGRAS OBRIGATÓRIAS:
1. Se o usuário anexou um arquivo (PDF de edital, plano de ensino/ementa de faculdade, apostila de cursinho ou slides) OU já informou o tema/objetivo que deseja estudar (ex: "Cálculo II na faculdade", "Concurso Polícia Federal", "Certificação AWS", "Inglês"), defina "ready": true e preencha IMEDIATAMENTE toda a estrutura do estudo ("plan", "topics", "questions", "flashcards") para que o aluno já veja a programação pronta sem burocracia!
2. Só defina "ready": false se a mensagem do usuário for apenas um cumprimento vago (ex: "oi", "olá") sem nenhum tema e sem arquivo anexado. Nesse caso, pergunte de forma simples o que ele vai estudar ou peça para anexar o PDF.
3. Adapte o estudo organicamente à realidade de cada caso:
   - Matéria de faculdade: category = "faculdade", syllabus_label = "Ementa", has_essay = false (faculdade não tem redação de banca 20-30 linhas!). Nos context_cards, destaque P1, P2, Trabalhos/Listas e Média.
   - Concurso público SEM discursiva: category = "concurso", syllabus_label = "Edital", has_essay = false.
   - Concurso público COM discursiva/redação explícita: category = "concurso", syllabus_label = "Edital", has_essay = true.
   - Cursinho / Certificação / Estudo livre: category = "cursinho" (ou "livre"), syllabus_label = "Módulos", has_essay = false (exceto ENEM/vestibular com redação).
4. Extraia entre 6 e 16 tópicos reais e bem organizados em "topics" (agrupados por disciplina/unidade em "subject"), crie 4 a 6 questões práticas de múltipla escolha (A, B, C, D) sobre o conteúdo real em "questions", e 4 a 6 cartões de memória em "flashcards".
5. Em "reply", escreva uma mensagem curta, natural e acolhedora dizendo o que você identificou e que os primeiros blocos de hoje já estão separados, perguntando apenas se ele quer ajustar a carga horária diária ou abrir o painel agora.

Retorne EXCLUSIVAMENTE um objeto JSON válido com este formato:
{
  "ready": true,
  "reply": "Texto natural para o usuário...",
  "plan": {
    "title": "Nome curto do estudo (ex: Banco de Dados II · UFMT)",
    "subtitle": "Resumo curto (ex: Ciência da Computação · P1, P2 e Projeto)",
    "category": "faculdade",
    "syllabus_label": "Ementa",
    "has_essay": false,
    "target_date": "YYYY-MM-DD ou vazio",
    "daily_hours": "1h30 por dia",
    "hero_title": "Frase curta motivadora para o topo do painel Hoje",
    "context_cards": [
      { "tag": "P1", "title": "Prova P1", "sub": "Unidades 1 e 2", "pill": "Prioridade" },
      { "tag": "LAB", "title": "Listas & Prática", "sub": "Exercícios extraídos", "pill": "Ativo" },
      { "tag": "META", "title": "Ritmo Diário", "sub": "Blocos organizados", "pill": "1h30/dia" }
    ]
  },
  "topics": [
    { "subject": "Unidade 1 · Fundamentos", "title": "Título específico do capítulo/aula", "priority": "alta" }
  ],
  "questions": [
    {
      "subject": "Unidade 1 · Fundamentos",
      "stem": "Enunciado completo da questão...",
      "options": [
        { "letter": "A", "text": "..." },
        { "letter": "B", "text": "..." },
        { "letter": "C", "text": "..." },
        { "letter": "D", "text": "..." }
      ],
      "answer": "B"
    }
  ],
  "flashcards": [
    { "subject": "Unidade 1 · Fundamentos", "front": "Pergunta direta?", "back": "Resposta objetiva.", "tag": "Conceito" }
  ]
}`;

    const contents = messages.map((m: { role: string; text: string }, idx: number) => {
      const isLast = idx === messages.length - 1;
      if (isLast && fileBase64) {
        return {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: fileBase64 } },
            { text: m.text || `Analise o documento anexado (${fileName}) e monte meu plano de estudos completo.` },
          ],
        };
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.text || '') }],
      };
    });

    if (contents.length === 0 && fileBase64) {
      contents.push({
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: fileBase64 } },
          { text: `Analise o arquivo anexado (${fileName}) e monte meu plano de estudos completo.` },
        ],
      });
    }

    const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
    const candidateModels = Array.from(new Set([primaryModel, 'gemini-3.8-flash', 'gemini-flash-latest']));

    let res: Response | null = null;
    let errTxt = '';

    for (const m of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
      });
      if (res.ok) break;
      errTxt = await res.text();
      if (res.status !== 404) break;
    }

    if (!res || !res.ok) {
      throw new Error(`Gemini API HTTP ${res?.status || 500}: ${errTxt.slice(0, 240)}`);
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const rawJson = parts
      .filter((p: Record<string, unknown>) => typeof p.text === 'string' && !p.thought)
      .map((p: Record<string, unknown>) => String(p.text))
      .join('\n')
      .trim();

    let parsed: ExtractedPlanPayload;
    try {
      const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        ready: false,
        reply: rawJson || 'Me conte um pouco mais sobre o que você quer estudar ou anexe o PDF da sua ementa/edital.',
      };
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro ao processar estudo' }, { status: 500 });
  }
}
