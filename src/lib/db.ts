import { neon } from '@neondatabase/serverless';
import { INITIAL_TOPICS } from './syllabus';

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
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
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

  await sql`
    CREATE TABLE IF NOT EXISTS study_logs (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      minutes INTEGER NOT NULL DEFAULT 0,
      kind TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS error_entries (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      mistake TEXT NOT NULL,
      correction TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS essays (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      cargo TEXT NOT NULL,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT COUNT(*)::int AS cnt FROM topics`;
  if ((existing[0]?.cnt ?? 0) === 0) {
    for (let i = 0; i < INITIAL_TOPICS.length; i++) {
      const t = INITIAL_TOPICS[i];
      await sql`
        INSERT INTO topics (id, subject, title, overlap, priority, sort_order)
        VALUES (${t.id}, ${t.subject}, ${t.title}, ${t.overlap}, ${t.priority}, ${i})
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
