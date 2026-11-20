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
          ${`Plano de ${p.title} criado com ${draft.topics.length} tópicos em ${allUniqueSubjects.size} disciplinas! Já separei seus primeiros blocos na tela Hoje.`}
        )
      `;

      return NextResponse.json({ ok: true, planId });
    }

    // Default action: 'analyze' — 2-Phase Intelligent Interview + Full Syllabus Extraction
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

    const systemInstruction = `Você é um mentor especialista em análise de editais de concursos públicos, ementas universitárias e planos de estudo no aplicativo Pierre.

VOCÊ OPERA EM 2 FASES CLARAS E OBRIGATÓRIAS:

=== FASE 1: ENTREVISTA E DIAGNÓSTICO (ready: false) ===
Quando o usuário envia um documento (Edital, Ementa, Apostila) pela PRIMEIRA vez na conversa, você DEVE ler o documento inteiro com atenção e ANTES de montar o plano final, verificar o que falta saber:
1. Se o documento for um **Edital de Concurso Público com múltiplos cargos, áreas ou perfis** e o usuário AINDA NÃO especificou exatamente qual cargo/perfil vai prestar:
   - OBRIGATORIAMENTE retorne "ready": false.
   - Em "reply":
     a) Confirme que leu o edital (cite o órgão, a banca, a data da prova se constar, e se há prova discursiva/títulos);
     b) Liste os **cargos/perfis reais** que você encontrou no edital;
     c) Faça 2 ou 3 perguntas curtas e objetivas para montar um plano perfeito:
        - Para qual **cargo/perfil** você vai prestar?
        - Quantas **horas por dia** você tem disponível e qual seu **nível atual** nessas matérias?
        - Você já tem **materiais/apostilas/cursinho** ou vai montar sua base do zero?
   - Em "quick_options": coloque de 3 a 8 strings curtas com os nomes EXATOS dos principais cargos/perfis encontrados no PDF para o usuário poder clicar com 1 toque!
2. Se o documento for de **cargo único, matéria de faculdade ou cursinho**, mas o usuário ainda não informou **quantas horas por dia tem disponível** nem **se já tem material/nível**:
   - Retorne "ready": false, resuma brevemente o que encontrou no PDF (matéria, provas/unidades) e pergunte sua carga horária diária e nível atual, oferecendo 3 opções clicáveis em "quick_options" (ex: ["1h/dia · Começando do zero", "2h/dia · Já tenho base", "3h/dia · Reta final"]).

=== FASE 2: EXTRAÇÃO 100% COMPLETA DO PLANO (ready: true) ===
Assim que o usuário responder qual cargo/perfil vai prestar (e sua rotina/nível, ou se ele já tiver informado tudo na primeira mensagem, ou pedir explicitamente "pode gerar agora"):
- Retorne "ready": true com a estrutura COMPLETA do plano.
- **REGRA DE OURO DA EXTRAÇÃO ("topics") — ZERO OMISSÃO DE DISCIPLINAS:**
  - Localize no texto do documento o **Quadro de Provas / Disciplinas** e o **Anexo de Conteúdo Programático** específicos do cargo escolhido.
  - Extraia **100% DE TODAS AS DISCIPLINAS** previstas para aquele cargo (Conhecimentos Básicos, Conhecimentos Gerais, Legislação, Conhecimentos Específicos — absolutamente TODAS, sem pular nenhuma!).
  - Para CADA disciplina, quebre o conteúdo programático em tópicos claros e estudáveis (pode gerar 30, 50, 80 ou 100+ tópicos no array "topics", sem limite artificial!).
  - NUNCA remova disciplinas que o usuário já tem ou que estão no edital.
  - Use o nome exato da disciplina em "subject" e o título claro do tópico em "title".
  - Marque "priority": "alta" para as matérias de maior peso/quantidade de questões e "media" para as demais.
- **Adaptação Orgânica Realista:**
  - Faculdade: category = "faculdade", syllabus_label = "Ementa", has_essay = false (a menos que a ementa exija redação).
  - Concurso SEM discursiva: category = "concurso", syllabus_label = "Edital", has_essay = false.
  - Concurso COM discursiva/redação: category = "concurso", syllabus_label = "Edital", has_essay = true.
  - Cursinho / Certificação: category = "cursinho", syllabus_label = "Módulos", has_essay = false.
- Gere de 6 a 10 questões práticas ("questions") e 6 a 10 cartões de memória ("flashcards") distribuídos pelas disciplinas principais.
- Em "reply", faça um resumo limpo das disciplinas extraídas (com o peso/quantidade de tópicos de cada uma) e convide o usuário a conferir e confirmar, ou pedir qualquer ajuste antes de abrir o painel.

Retorne EXCLUSIVAMENTE um JSON válido neste formato:
{
  "ready": false,
  "reply": "Li o Edital completo da SEMA-MT (82 páginas, banca X, prova em DD/MM/AAAA)...",
  "quick_options": ["Cargo A", "Cargo B", "Cargo C"],
  "plan": null,
  "topics": [],
  "questions": [],
  "flashcards": []
}
(Quando "ready": true, preencha "plan", "topics", "questions" e "flashcards" completamente.)`;

    // Build Gemini contents: inject ALL attached documents (full text or scanned fallback) cleanly on the first user turn
    const docParts: Array<Record<string, unknown>> = [];
    for (const doc of documents) {
      if (doc.extractedText && doc.extractedText.trim().length > 0) {
        docParts.push({
          text: `=== DOCUMENTO ANEXADO: ${doc.name} (${doc.pageCount || '?'} páginas) ===\n${doc.extractedText}\n=== FIM DO DOCUMENTO: ${doc.name} ===`,
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
          { text: 'Estes são os documentos que enviei para basear meu plano de estudos. Leia todos com atenção antes de responder às minhas mensagens abaixo.' },
        ],
      });
      contents.push({
        role: 'model',
        parts: [{ text: JSON.stringify({ ready: false, reply: 'Documentos recebidos e lidos na íntegra. Pronto para analisar suas mensagens.' }) }],
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
