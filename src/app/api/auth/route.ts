import { NextResponse } from 'next/server';
import {
  getCurrentSession,
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  signSessionToken,
  verifyPassword,
  verifySameOrigin,
} from '../../../lib/auth';
import { ensureSchema, getSql } from '../../../lib/db';

function getClientKey(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || 'unknown';
  return `ip:${fwd.split(',')[0].trim().slice(0, 64)}`;
}

export async function GET() {
  try {
    await ensureSchema();
    const sql = getSql();
    const countRows = await sql`SELECT COUNT(*)::int AS cnt FROM users`;
    const needsSetup = (countRows[0]?.cnt ?? 0) === 0;
    const session = await getCurrentSession();

    return NextResponse.json({
      needsSetup,
      authenticated: Boolean(session),
      username: session?.username || null,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const body = await req.json();
    const action = String(body.action || '');

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
      return res;
    }

    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (action === 'setup') {
      const countRows = await sql`SELECT COUNT(*)::int AS cnt FROM users`;
      if ((countRows[0]?.cnt ?? 0) > 0) {
        return NextResponse.json({ error: 'Cadastro inicial já foi concluído. Faça login.' }, { status: 403 });
      }
      if (username.length < 3 || username.length > 40 || !/^[a-z0-9._-]+$/.test(username)) {
        return NextResponse.json({ error: 'Usuário deve ter 3–40 caracteres (letras, números, ponto ou traço).' }, { status: 400 });
      }
      if (password.length < 8) {
        return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
      }

      const pwHash = hashPassword(password);
      const inserted = await sql`
        INSERT INTO users (username, password_hash)
        VALUES (${username}, ${pwHash})
        RETURNING id, username
      `;
      const user = inserted[0];
      const token = signSessionToken(Number(user.id), String(user.username));
      const res = NextResponse.json({ ok: true, username: user.username });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
      return res;
    }

    if (action === 'login') {
      const clientKey = getClientKey(req);
      const rlRows = await sql`SELECT attempts, locked_until FROM auth_rate_limits WHERE key = ${clientKey}`;
      const rl = rlRows[0];
      if (rl?.locked_until && new Date(rl.locked_until).getTime() > Date.now()) {
        return NextResponse.json(
          { error: 'Muitas tentativas inválidas. Aguarde 15 minutos para tentar novamente.' },
          { status: 429 }
        );
      }

      const users = await sql`SELECT id, username, password_hash FROM users WHERE username = ${username}`;
      const user = users[0];
      const valid = user ? verifyPassword(password, String(user.password_hash)) : false;

      if (!valid) {
        const nextAttempts = (Number(rl?.attempts) || 0) + 1;
        const lockUntil = nextAttempts >= 8 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
        await sql`
          INSERT INTO auth_rate_limits (key, attempts, locked_until)
          VALUES (${clientKey}, ${nextAttempts}, ${lockUntil})
          ON CONFLICT (key) DO UPDATE SET attempts = ${nextAttempts}, locked_until = ${lockUntil}
        `;
        return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 });
      }

      await sql`DELETE FROM auth_rate_limits WHERE key = ${clientKey}`;
      const token = signSessionToken(Number(user.id), String(user.username));
      const res = NextResponse.json({ ok: true, username: user.username });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
      return res;
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 });
  }
}
