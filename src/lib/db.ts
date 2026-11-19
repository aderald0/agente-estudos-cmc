import { neon } from '@neondatabase/serverless';
import { FLASHCARDS_SEED } from './flashcardsSeed';
import { PRACTICE_QUESTIONS_SEED } from './questionsSeed';
import { EXAM_DATE, INITIAL_TOPICS } from './syllabus';

export const DEFAULT_PLAN_ID = 'cmc-2026';

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Variável de ambiente DATABASE_URL não configurada.');
  }
  return neon(url);
}

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_rate_limits (
      key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS study_plans (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'concurso',
      syllabus_label TEXT NOT NULL DEFAULT 'Edital',
      has_essay BOOLEAN NOT NULL DEFAULT FALSE,
      target_date TEXT NOT NULL DEFAULT '',
      daily_hours TEXT NOT NULL DEFAULT '2h/dia',
      config_json TEXT NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      overlap TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'media',
      status TEXT NOT NULL DEFAULT 'nao-iniciado',
      study_queue BOOLEAN NOT NULL DEFAULT false,
      study_date TEXT NOT NULL DEFAULT '',
      review_queue BOOLEAN NOT NULL DEFAULT false,
      next_review_date TEXT NOT NULL DEFAULT '',
      review_interval INTEGER NOT NULL DEFAULT 0,
      mastery INTEGER NOT NULL DEFAULT 1,
      q_right INTEGER NOT NULL DEFAULT 0,
      q_total INTEGER NOT NULL DEFAULT 0,
      minutes_studied INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`ALTER TABLE topics ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  await sql`
    CREATE TABLE IF NOT EXISTS study_logs (
      id SERIAL PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      date TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      minutes INTEGER NOT NULL DEFAULT 0,
      kind TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE study_logs ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  await sql`
    CREATE TABLE IF NOT EXISTS error_entries (
      id SERIAL PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      mistake TEXT NOT NULL,
      correction TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE error_entries ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  await sql`
    CREATE TABLE IF NOT EXISTS essays (
      id SERIAL PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      date TEXT NOT NULL,
      cargo TEXT NOT NULL,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      score_content INTEGER NOT NULL DEFAULT 0,
      score_formal INTEGER NOT NULL DEFAULT 0,
      feedback TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE essays ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;
  await sql`ALTER TABLE essays ADD COLUMN IF NOT EXISTS score_content INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE essays ADD COLUMN IF NOT EXISTS score_formal INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE essays ADD COLUMN IF NOT EXISTS feedback TEXT NOT NULL DEFAULT ''`;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  await sql`
    CREATE TABLE IF NOT EXISTS practice_questions (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      subject TEXT NOT NULL,
      qnum INTEGER NOT NULL,
      stem TEXT NOT NULL,
      options_json TEXT NOT NULL,
      answer TEXT NOT NULL,
      user_choice TEXT NOT NULL DEFAULT '',
      is_correct BOOLEAN
    )
  `;
  await sql`ALTER TABLE practice_questions ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  await sql`
    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL DEFAULT 'cmc-2026',
      subject TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT '',
      box INTEGER NOT NULL DEFAULT 1,
      next_review_date TEXT NOT NULL DEFAULT ''
    )
  `;
  await sql`ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS plan_id TEXT NOT NULL DEFAULT 'cmc-2026'`;

  // Ensure default CMC 2026 study plan exists
  const defaultConfig = JSON.stringify({
    heroTitle: 'Você foca na leitura. O Mentor organiza sua nota.',
    contextCards: [
      { tag: 'TI', title: 'Manhã · Analista de TI', sub: 'Legislação + TI valem 70% da prova (peso 1,75)', pill: 'Peso 1,75' },
      { tag: 'TL', title: 'Tarde · Técnico Legislativo', sub: 'Adm. Pública + Específicos valem 70% (peso 1,75)', pill: 'Peso 1,75' },
      { tag: '200', title: 'Banco Selecon', sub: '200 questões oficiais das 10 apostilas', pill: 'Oficial' },
    ],
  });

  await sql`
    INSERT INTO study_plans (id, title, subtitle, category, syllabus_label, has_essay, target_date, daily_hours, config_json)
    VALUES (
      ${DEFAULT_PLAN_ID},
      'Câmara de Cuiabá 2026',
      'Analista de TI & Técnico Legislativo · Instituto Selecon',
      'concurso-duplo',
      'Edital',
      true,
      ${EXAM_DATE},
      '3h por dia',
      ${defaultConfig}
    )
    ON CONFLICT (id) DO NOTHING
  `;

  // Seed or migrate CMC topics to exact apostila TOC chapters
  const hasToc = await sql`SELECT 1 FROM topics WHERE id = 'lp-cap-1' LIMIT 1`;
  if (hasToc.length === 0) {
    await sql`DELETE FROM topics WHERE plan_id = 'cmc-2026' AND id NOT LIKE 'custom-%'`;
    const today = todayISO();
    for (let i = 0; i < INITIAL_TOPICS.length; i++) {
      const t = INITIAL_TOPICS[i];
      const inInitialQueue = t.id === 'leg-cap-1' || t.id === 'ti-cap-1' || t.id === 'adm-cap-1';
      await sql`
        INSERT INTO topics (id, plan_id, subject, title, overlap, priority, status, study_queue, study_date, sort_order)
        VALUES (
          ${t.id},
          ${DEFAULT_PLAN_ID},
          ${t.subject},
          ${t.title},
          ${t.overlap},
          ${t.priority},
          ${inInitialQueue ? 'estudando' : 'nao-iniciado'},
          ${inInitialQueue},
          ${inInitialQueue ? today : ''},
          ${i}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed 200 real apostila questions for CMC 2026 if empty
  const qCount = await sql`SELECT COUNT(*)::int AS cnt FROM practice_questions WHERE plan_id = 'cmc-2026'`;
  if ((qCount[0]?.cnt ?? 0) === 0) {
    for (const q of PRACTICE_QUESTIONS_SEED) {
      await sql`
        INSERT INTO practice_questions (id, plan_id, subject, qnum, stem, options_json, answer)
        VALUES (${q.id}, ${DEFAULT_PLAN_ID}, ${q.subject}, ${q.qnum}, ${q.stem}, ${JSON.stringify(q.options)}, ${q.answer})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Seed high-yield flashcards for CMC 2026 if empty
  const fcCount = await sql`SELECT COUNT(*)::int AS cnt FROM flashcards WHERE plan_id = 'cmc-2026'`;
  if ((fcCount[0]?.cnt ?? 0) === 0) {
    const today = todayISO();
    for (const fc of FLASHCARDS_SEED) {
      await sql`
        INSERT INTO flashcards (id, plan_id, subject, front, back, tag, box, next_review_date)
        VALUES (${fc.id}, ${DEFAULT_PLAN_ID}, ${fc.subject}, ${fc.front}, ${fc.back}, ${fc.tag}, 1, ${today})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  schemaReady = true;
}

export function todayISO() {
  const now = new Date();
  const mt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Cuiaba' }));
  const y = mt.getFullYear();
  const m = String(mt.getMonth() + 1).padStart(2, '0');
  const d = String(mt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysISO(baseISO: string, days: number) {
  const dt = new Date(baseISO + 'T12:00:00');
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}
