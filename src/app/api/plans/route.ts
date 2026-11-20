import { NextResponse } from 'next/server';
import { getCurrentSession, verifySameOrigin } from '../../../lib/auth';
import { DEFAULT_PLAN_ID, ensureSchema, getSql, todayISO } from '../../../lib/db';

export const maxDuration = 60;

interface IncomingDoc {
  name: string;
  pageCount?: number;
  extractedText?: string;
  fallbackBase64?: string;
  mimeType?: string;
}

interface ExtractedPlanPayload {
  ready: boolean;
  reply: string;
  quick_options?: string[];
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

function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Smart page-level distiller for huge multi-page Editais (60-200 pages).
 * Keeps 100% of high-value pages (first pages, cargos, quadro de provas, conhecimentos básicos/gerais,
 * and all pages matching the user's chosen cargo/profile) while dropping boilerplate forms/declarations
 * so Gemini responds in ~8-15s instead of hitting Vercel's 60s timeout.
 */
function distillDocumentText(fullText: string, userContextText: string, maxChars = 140_000): string {
  if (fullText.length <= maxChars) return fullText;

  const pages = fullText.split(/(?=\[PÁGINA \d+\/\d+\])/g).filter(Boolean);
  if (pages.length <= 1) {
    return fullText.slice(0, maxChars);
  }

  // Extract meaningful search terms from user's conversation (e.g., cargo name "analista em ti", "desenvolvimento")
  const stopWords = new Set([
    'para', 'qual', 'cargo', 'perfil', 'concurso', 'edital', 'estudar', 'plano', 'estudos',
    'horas', 'nivel', 'material', 'anexei', 'paginas', 'analise', 'documento', 'perguntas',
    'montar', 'quero', 'fazer', 'sobre', 'como', 'mais', 'menos', 'com', 'sem', 'por', 'que',
  ]);
  const userTerms = Array.from(
    new Set(
      normalizeStr(userContextText)
        .split(/[^a-z0-9]+/)
        .filter(w => w.length >= 2 && !stopWords.has(w))
    )
  );

  const highValueKeywords = [
    'conteudo programatico',
    'conhecimentos basicos',
    'conhecimentos gerais',
    'conhecimentos especificos',
    'quadro de provas',
    'prova objetiva',
    'prova discursiva',
    'redacao',
    'disciplina',
    'cargos',
    'vagas',
    'remuneracao',
    'cronograma',
    'ementa',
    'unidades',
    'anexo',
  ];

  const scored = pages.map((pageText, idx) => {
    const norm = normalizeStr(pageText);
    let score = 0;

    // Always prioritize opening pages (organ, banca, cargos, rules)
    if (idx < 6) score += 50;

    // Match user-specified cargo / profile terms strongly
    let userHits = 0;
    for (const term of userTerms) {
      if (norm.includes(term)) userHits++;
    }
    if (userHits > 0) score += 40 + userHits * 15;

    // Match syllabus & exam structure pages
    for (const kw of highValueKeywords) {
      if (norm.includes(kw)) score += 12;
    }

    // Penalize pure boilerplate annexes (declaração, formulário, cronograma de entrega, laudo médico)
    if (
      (norm.includes('autodeclaracao') ||
        norm.includes('laudo medico') ||
        norm.includes('requerimento de isencao') ||
        norm.includes('formulario de recurso')) &&
      userHits === 0
    ) {
      score -= 30;
    }

    return { idx, pageText, score };
  });

  // Sort by score desc, pick top pages up to maxChars, then restore original page order
  const selectedIndices = new Set<number>();
  let totalChars = 0;
  const byScore = [...scored].sort((a, b) => b.score - a.score || a.idx - b.idx);

  for (const item of byScore) {
    if (totalChars + item.pageText.length > maxChars && selectedIndices.size >= 8) continue;
    selectedIndices.add(item.idx);
    totalChars += item.pageText.length;
    if (totalChars >= maxChars) break;
  }

  // Also pull in +1 neighbor page after strong syllabus matches (continuations of a cargo's syllabus)
  const extraNeighbors: number[] = [];
  for (const item of scored) {
    if (selectedIndices.has(item.idx) && item.score >= 55 && item.idx + 1 < pages.length && !selectedIndices.has(item.idx + 1)) {
      extraNeighbors.push(item.idx + 1);
    }
  }
  for (const nIdx of extraNeighbors) {
    if (totalChars + pages[nIdx].length <= maxChars + 25_000) {
      selectedIndices.add(nIdx);
      totalChars += pages[nIdx].length;
    }
  }

  return scored
    .filter(s => selectedIndices.has(s.idx))
    .map(s => s.pageText)
    .join('\n\n');
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

    // Delete any custom study plan (cannot delete the last remaining plan)
    if (action === 'delete') {
      const planId = String(body.plan_id || '');
      if (!planId) {
        return NextResponse.json({ error: 'Informe o estudo a ser excluído.' }, { status: 400 });
      }
      const allPlans = await sql`SELECT id FROM study_plans ORDER BY created_at ASC`;
      if (allPlans.length <= 1) {
        return NextResponse.json({ error: 'Você precisa manter pelo menos 1 estudo ativo no painel.' }, { status: 400 });
      }
      if (planId === DEFAULT_PLAN_ID) {
        return NextResponse.json({ error: 'O estudo base Câmara de Cuiabá 2026 é protegido contra exclusão acidental.' }, { status: 400 });
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

      const remaining = await sql`SELECT id FROM study_plans ORDER BY created_at ASC LIMIT 1`;
      return NextResponse.json({ ok: true, fallbackPlanId: remaining[0]?.id || DEFAULT_PLAN_ID });
    }

    // Save a prepared study plan directly into Neon Postgres (parallel chunked inserts for speed)
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

      // Count ALL unique subjects across the entire plan
      const allUniqueSubjects = new Set<string>();
      draft.topics.forEach(t => allUniqueSubjects.add(String(t.subject || p.title)));

      // Pick up to 3 high-priority topics across different subjects for Today's initial schedule
      const initialTodayIndices = new Set<number>();
      const pickedSubjects = new Set<string>();
      for (let i = 0; i < draft.topics.length && initialTodayIndices.size < 3; i++) {
        const sub = String(draft.topics[i].subject || '');
        if (!pickedSubjects.has(sub) && draft.topics[i].priority === 'alta') {
          pickedSubjects.add(sub);
          initialTodayIndices.add(i);
        }
      }
      for (let i = 0; i < draft.topics.length && initialTodayIndices.size < 3; i++) {
        const sub = String(draft.topics[i].subject || '');
        if (!pickedSubjects.has(sub)) {
          pickedSubjects.add(sub);
          initialTodayIndices.add(i);
        }
      }
      for (let i = 0; i < draft.topics.length && initialTodayIndices.size < 3; i++) {
        initialTodayIndices.add(i);
      }

      // Insert topics in parallel chunks of 12 to avoid sequential Neon round-trip latency
      const CHUNK = 12;
      for (let start = 0; start < draft.topics.length; start += CHUNK) {
        const slice = draft.topics.slice(start, start + CHUNK);
        await Promise.all(
          slice.map((t, offset) => {
            const i = start + offset;
            const tid = `${planId}-t-${i + 1}`;
            const inTodayQueue = initialTodayIndices.has(i);
            const pri =
              t.priority === 'alta' || t.priority === 'media' || t.priority === 'baixa'
                ? t.priority
                : inTodayQueue
                  ? 'alta'
                  : 'media';
            return sql`
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
          })
        );
      }

      // Insert practice questions & flashcards in parallel
      const qs = Array.isArray(draft.questions) ? draft.questions : [];
      const fcs = Array.isArray(draft.flashcards) ? draft.flashcards : [];

      await Promise.all([
        ...qs.map((q, i) => {
          const qid = `${planId}-q-${i + 1}`;
          const opts =
            Array.isArray(q.options) && q.options.length >= 2
              ? q.options
              : [
                  { letter: 'A', text: 'Alternativa A' },
                  { letter: 'B', text: 'Alternativa B' },
                  { letter: 'C', text: 'Alternativa C' },
                  { letter: 'D', text: 'Alternativa D' },
                ];
          return sql`
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
        }),
        ...fcs.map((fc, i) => {
          const fcid = `${planId}-fc-${i + 1}`;
          return sql`
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
        }),
        sql`
          INSERT INTO chat_messages (plan_id, role, content)
          VALUES (
            ${planId},
            'assistant',
            ${`Plano de ${p.title} criado com ${draft.topics.length} tópicos em ${allUniqueSubjects.size} disciplinas! Já separei seus primeiros blocos na tela Hoje.`}
          )
        `,
      ]);

      return NextResponse.json({ ok: true, planId });
    }

    // Default action: 'analyze' — 2-Phase Intelligent Interview + Fast Full Syllabus Extraction
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY não configurada na Vercel.' }, { status: 400 });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const documents: IncomingDoc[] = Array.isArray(body.documents) ? body.documents : [];

    // Backward-compatible single file support
    if (documents.length === 0 && (body.fileBase64 || body.extractedText)) {
      documents.push({
        name: String(body.fileName || 'documento.pdf'),
        extractedText: typeof body.extractedText === 'string' ? body.extractedText : '',
        fallbackBase64: typeof body.fileBase64 === 'string' ? body.fileBase64 : '',
        mimeType: typeof body.mimeType === 'string' ? body.mimeType : 'application/pdf',
      });
    }

    // Collect user messages text so our smart distiller prioritizes pages matching the chosen cargo/profile
    const userContextText = messages
      .filter((m: Record<string, unknown>) => m.role === 'user')
      .map((m: Record<string, unknown>) => String(m.text || ''))
      .join(' ');

    const systemInstruction = `Você é um mentor especialista em análise de editais de concursos públicos, ementas universitárias e planos de estudo no aplicativo Pierre.

VOCÊ OPERA EM 2 FASES CLARAS E OBRIGATÓRIAS:

=== FASE 1: ENTREVISTA E DIAGNÓSTICO (ready: false) ===
Quando o usuário envia um documento (Edital, Ementa, Apostila) pela PRIMEIRA vez na conversa, leia o documento com atenção e ANTES de montar o plano final, verifique o que falta saber:
1. Se o documento for um Edital de Concurso Público com múltiplos cargos, áreas ou perfis e o usuário AINDA NÃO especificou exatamente qual cargo/perfil vai prestar:
   - OBRIGATORIAMENTE retorne "ready": false.
   - Em "reply":
     a) Confirme que leu o edital (cite órgão, banca, data da prova se constar e se há prova discursiva);
     b) Liste os cargos/perfis reais encontrados;
     c) Faça 2 ou 3 perguntas objetivas: qual cargo/perfil vai prestar, quantas horas por dia tem disponível/nível atual, e se já tem material/cursinho.
   - Em "quick_options": coloque de 3 a 8 strings curtas com os nomes EXATOS dos principais cargos/perfis encontrados no PDF para o usuário clicar com 1 toque.
2. Se o documento for de cargo único, matéria de faculdade ou cursinho, mas o usuário ainda não informou sua carga horária diária nem nível atual:
   - Retorne "ready": false, resuma o que encontrou e pergunte rotina/nível, oferecendo 3 opções clicáveis em "quick_options".

=== FASE 2: EXTRAÇÃO 100% COMPLETA DO PLANO (ready: true) ===
Assim que o usuário responder qual cargo/perfil vai prestar (ou se já informou tudo na primeira mensagem):
- Retorne "ready": true com a estrutura COMPLETA do plano.
- REGRA DE OURO DA EXTRAÇÃO ("topics") — ZERO OMISSÃO DE DISCIPLINAS:
  - Localize no texto do documento o Quadro de Provas / Disciplinas e o Anexo de Conteúdo Programático específicos do cargo escolhido.
  - Extraia 100% DE TODAS AS DISCIPLINAS previstas para aquele cargo (Conhecimentos Básicos, Conhecimentos Gerais, Legislação, Conhecimentos Específicos — absolutamente TODAS, sem pular nenhuma!).
  - Para CADA disciplina, organize o conteúdo programático em tópicos claros, objetivos e estudáveis (títulos concisos de até 90 caracteres; tipicamente de 3 a 8 tópicos por disciplina, totalizando ~25 a 65 tópicos completos sem omitir nenhuma matéria!).
  - Use o nome exato da disciplina em "subject" e marque "priority": "alta" para as matérias de maior peso/específicas e "media" para as demais.
- Adaptação Orgânica Realista:
  - Faculdade: category = "faculdade", syllabus_label = "Ementa", has_essay = false (salvo se houver redação).
  - Concurso SEM discursiva: category = "concurso", syllabus_label = "Edital", has_essay = false.
  - Concurso COM discursiva/redação: category = "concurso", syllabus_label = "Edital", has_essay = true.
  - Cursinho / Certificação: category = "cursinho", syllabus_label = "Módulos", has_essay = false.
- Gere um kit inicial enxuto de 4 questões práticas ("questions") e 4 cartões de memória ("flashcards") das disciplinas de maior peso (para manter a resposta rápida).
- Em "reply", faça um resumo limpo das disciplinas extraídas e convide o usuário a conferir e confirmar.

Retorne EXCLUSIVAMENTE um JSON válido neste formato:
{
  "ready": false,
  "reply": "Resumo limpo...",
  "quick_options": ["Cargo A", "Cargo B"],
  "plan": null,
  "topics": [],
  "questions": [],
  "flashcards": []
}
(Quando "ready": true, preencha "plan", "topics", "questions" e "flashcards" completamente.)`;

    // Build Gemini contents with smart distillation for huge multi-page PDFs
    const docParts: Array<Record<string, unknown>> = [];
    const perDocBudget = documents.length > 1 ? Math.floor(150_000 / documents.length) : 150_000;

    for (const doc of documents) {
      if (doc.extractedText && doc.extractedText.trim().length > 0) {
        const focusedText = distillDocumentText(doc.extractedText, userContextText, perDocBudget);
        docParts.push({
          text: `=== DOCUMENTO ANEXADO: ${doc.name} (${doc.pageCount || '?'} páginas) ===\n${focusedText}\n=== FIM DO DOCUMENTO: ${doc.name} ===`,
        });
      } else if (doc.fallbackBase64) {
        docParts.push({
          inlineData: { mimeType: doc.mimeType || 'application/pdf', data: doc.fallbackBase64 },
        });
      }
    }

    const contents: Array<{ role: string; parts: Array<Record<string, unknown>> }> = [];

    if (docParts.length > 0) {
      contents.push({
        role: 'user',
        parts: [
          ...docParts,
          { text: 'Estes são os documentos que enviei para basear meu plano de estudos. Leia com atenção antes de responder às minhas mensagens abaixo.' },
        ],
      });
      contents.push({
        role: 'model',
        parts: [{ text: JSON.stringify({ ready: false, reply: 'Documentos recebidos e analisados. Pronto para responder.' }) }],
      });
    }

    for (const m of messages) {
      contents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.text || '') }],
      });
    }

    const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
    const candidateModels = Array.from(new Set([primaryModel, 'gemini-3.8-flash', 'gemini-flash-latest']));

    let res: Response | null = null;
    let errTxt = '';

    for (const m of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      // Cap thinkingBudget to 512 tokens so Gemini doesn't burn 30-50s thinking and trigger Vercel 504 timeout
      const callGemini = async (withThinkingCap: boolean) => {
        const generationConfig: Record<string, unknown> = {
          temperature: 0.2,
          maxOutputTokens: 12288,
          responseMimeType: 'application/json',
        };
        if (withThinkingCap) {
          generationConfig.thinkingConfig = { thinkingBudget: 512 };
        }
        return fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig,
          }),
        });
      };

      res = await callGemini(true);
      if (!res.ok && res.status === 400) {
        // Fallback cleanly if model does not support thinkingConfig parameter
        res = await callGemini(false);
      }

      if (res.ok) break;
      errTxt = await res.text();
      if (res.status !== 404) break;
    }

    if (!res || !res.ok) {
      throw new Error(`Gemini API HTTP ${res?.status || 500}: ${errTxt.slice(0, 260)}`);
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
        reply: rawJson || 'Para qual cargo ou área deste documento você vai estudar? Me diga também quantas horas por dia tem disponível.',
      };
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro ao processar documento' }, { status: 500 });
  }
}
