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

      // Pick up to 3 high-priority topics across different subjects for Today's initial schedule
      const initialTodayIndices = new Set<number>();
      const seenSubjects = new Set<string>();
      for (let i = 0; i < draft.topics.length && initialTodayIndices.size < 3; i++) {
        const sub = String(draft.topics[i].subject || '');
        if (!seenSubjects.has(sub)) {
          seenSubjects.add(sub);
          initialTodayIndices.add(i);
        }
      }
      for (let i = 0; i < draft.topics.length && initialTodayIndices.size < 3; i++) {
        initialTodayIndices.add(i);
      }

      for (let i = 0; i < draft.topics.length; i++) {
        const t = draft.topics[i];
        const tid = `${planId}-t-${i + 1}`;
        const inTodayQueue = initialTodayIndices.has(i);
        const pri = t.priority === 'alta' || t.priority === 'media' || t.priority === 'baixa' ? t.priority : (inTodayQueue ? 'alta' : 'media');
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

      await sql`
        INSERT INTO chat_messages (plan_id, role, content)
        VALUES (
          ${planId},
          'assistant',
          ${`Plano de ${p.title} criado com ${draft.topics.length} tópicos em ${seenSubjects.size} disciplinas! Já separei seus primeiros blocos na tela Hoje.`}
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

    const systemInstruction = `Você é o assistente especialista em análise de editais, ementas universitárias e materiais de estudo do aplicativo Pierre.

ATENÇÃO MÁXIMA PARA EDITAIS LONGOS (ex: 50 a 150 páginas, como SEMA, Tribunais, Polícia, Prefeituras):
1. Quando o usuário enviar um PDF de Edital de Concurso Público:
   - Navegue até o **Quadro de Provas / Disciplinas** e até o **Anexo de Conteúdo Programático** (que geralmente fica nas páginas finais do PDF).
   - Se o edital tiver **múltiplos cargos ou perfis** (ex: Analista Meio Ambiente Perfil 1, Perfil 2, Técnico, etc.) e o usuário AINDA NÃO tiver informado na mensagem qual cargo/perfil vai prestar:
     - Verifique se é possível identificar os cargos disponíveis.
     - Se o usuário NÃO especificou o cargo, você pode:
       a) Ou definir "ready": false e perguntar em "reply" para qual dos cargos/perfis do edital (liste os cargos encontrados no PDF!) ele vai estudar, para que você extraia as disciplinas exatas daquele cargo;
       b) Ou, se ele já informou o cargo (ou pediu para extrair um cargo específico), defina "ready": true e extraia **100% DAS DISCIPLINAS daquele cargo**.
2. REGRA DE OURO DA EXTRAÇÃO ("topics") — PROIBIDO OMITIR DISCIPLINAS:
   - NUNCA omita nenhuma disciplina do cargo escolhido!
   - Você DEVE incluir **TODAS as disciplinas** de Conhecimentos Básicos, Conhecimentos Gerais e Conhecimentos Específicos previstas no Quadro de Provas daquele cargo (ex: Língua Portuguesa, Raciocínio Lógico, História e Geografia de MT, Noções de Informática, Ética e Filosofia, Direito Constitucional, Direito Administrativo, Legislação Específica/Ambiental e cada matéria do bloco específico).
   - Para CADA disciplina do cargo, crie todos os tópicos/capítulos necessários cobrindo integralmente o Anexo de Conteúdo Programático daquela matéria (gere quantos tópicos forem necessários: 30, 50, 70 ou 90+ tópicos no array "topics", sem limite artificial!).
   - Use o nome exato da disciplina no campo "subject" e o assunto detalhado no campo "title".
   - Defina "priority": "alta" para as disciplinas de maior peso/número de questões (especialmente Conhecimentos Específicos e Legislação) e "media" para as demais.
3. Adaptação Orgânica por Modalidade:
   - Matéria de faculdade: category = "faculdade", syllabus_label = "Ementa", has_essay = false.
   - Concurso público SEM discursiva/redação: category = "concurso", syllabus_label = "Edital", has_essay = false.
   - Concurso público COM prova discursiva/redação prevista no edital: category = "concurso", syllabus_label = "Edital", has_essay = true.
   - Cursinho / Certificação: category = "cursinho", syllabus_label = "Módulos", has_essay = false.
4. Gere também de 6 a 10 questões práticas ("questions") distribuídas entre as disciplinas extraídas e 6 a 10 cartões de memória ("flashcards") com prazos, conceitos ou regras importantes do documento.
5. Em "reply", liste claramente todas as disciplinas que você encontrou e extraiu (com a quantidade de tópicos de cada uma) e pergunte ao usuário se o cargo/disciplinas estão completos ou se ele quer ajustar o cargo antes de abrir o painel.

Retorne EXCLUSIVAMENTE um objeto JSON válido com este formato:
{
  "ready": true,
  "reply": "Analisei o edital completo para o cargo X. Extraí todas as N disciplinas do conteúdo programático (lista das disciplinas)...",
  "plan": {
    "title": "Nome do estudo e cargo (ex: SEMA-MT · Analista Ambiental)",
    "subtitle": "Banca + Resumo das provas e pesos",
    "category": "concurso",
    "syllabus_label": "Edital",
    "has_essay": true,
    "target_date": "YYYY-MM-DD ou vazio",
    "daily_hours": "2h por dia",
    "hero_title": "Frase curta motivadora para o painel Hoje",
    "context_cards": [
      { "tag": "ESP", "title": "Conhecimentos Específicos", "sub": "Resumo de questões e peso", "pill": "Prioridade" },
      { "tag": "BAS", "title": "Conhecimentos Básicos/Gerais", "sub": "Disciplinas comuns do edital", "pill": "Base" },
      { "tag": "PROVA", "title": "Avaliação & Data", "sub": "Resumo da prova/discursiva", "pill": "Meta" }
    ]
  },
  "topics": [
    { "subject": "Nome da Disciplina 1", "title": "1. Tópico completo do conteúdo programático", "priority": "alta" }
  ],
  "questions": [
    {
      "subject": "Nome da Disciplina",
      "stem": "Enunciado completo...",
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
    { "subject": "Nome da Disciplina", "front": "Pergunta direta?", "back": "Resposta objetiva.", "tag": "Edital" }
  ]
}`;

    // Attach the PDF to the latest turn that has fileBase64 so follow-up messages ("Mude para o cargo X" or "Inclua todas as disciplinas") still see the PDF
    const contents = messages.map((m: { role: string; text: string }, idx: number) => {
      const isLast = idx === messages.length - 1;
      if (isLast && fileBase64) {
        return {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: fileBase64 } },
            {
              text:
                m.text ||
                `Analise o documento anexado (${fileName}). Se for um edital com vários cargos e eu não especifiquei o cargo, me pergunte qual cargo vou fazer listando as opções encontradas, ou extraia 100% de todas as disciplinas (Básicos, Gerais e Específicos) sem omitir nenhuma matéria.`,
            },
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
          {
            text: `Analise o arquivo anexado (${fileName}) e extraia todas as disciplinas e tópicos do conteúdo programático.`,
          },
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
            temperature: 0.25,
            maxOutputTokens: 16384,
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
        reply: rawJson || 'Para qual cargo ou perfil deste edital você vai estudar? Me informe o cargo para eu extrair todas as disciplinas exatas dele.',
      };
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro ao processar documento' }, { status: 500 });
  }
}
