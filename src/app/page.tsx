'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ESSAY_PROMPTS, EXAM_DATE, SUBJECT_META } from '../lib/syllabus';

interface Topic {
  id: string;
  subject: string;
  title: string;
  overlap: string;
  priority: string;
  status: string;
  study_queue: boolean;
  study_date: string;
  review_queue: boolean;
  next_review_date: string;
  review_interval: number;
  mastery: number;
  q_right: number;
  q_total: number;
  minutes_studied: number;
  notes: string;
}

interface StudyLog {
  id: number;
  date: string;
  topic_id: string;
  subject: string;
  title: string;
  minutes: number;
  kind: string;
}

interface ErrorEntry {
  id: number;
  date: string;
  subject: string;
  topic: string;
  mistake: string;
  correction: string;
}

interface EssayEntry {
  id: number;
  date: string;
  cargo: string;
  title: string;
  text: string;
}

interface ChatMsg {
  id: number;
  role: 'user' | 'assistant' | 'tool_trace';
  content: string;
}

function fmtBR(iso: string) {
  if (!iso) return '—';
  const parts = iso.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : iso;
}

function renderFormattedText(md: string) {
  return md
    .split('\n')
    .filter(line => !/^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line) && line.trim() !== '---')
    .map((line, i) => {
      const clean = line.replace(/^#{1,4}\s+/, '');
      const html = clean
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      if (clean.startsWith('- ') || clean.startsWith('* ')) {
        return <li key={i} dangerouslySetInnerHTML={{ __html: html.slice(2) }} />;
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
    });
}

const Icon = {
  Chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Today: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  List: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  More: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Theme: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

export default function HomePage() {
  const [view, setView] = useState<'chat' | 'hoje' | 'edital' | 'mais'>('chat');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authChecked, setAuthChecked] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [authUser, setAuthUser] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [essays, setEssays] = useState<EssayEntry[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [fSearch, setFSearch] = useState('');
  const [fOverlap, setFOverlap] = useState('all');
  const [fSubject, setFSubject] = useState('all');

  const [timerInitial, setTimerInitial] = useState(50 * 60);
  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTopicId, setTimerTopicId] = useState('');

  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [ncSubject, setNcSubject] = useState(SUBJECT_META[0].name);
  const [ncTitle, setNcTitle] = useState('');
  const [ncOverlap, setNcOverlap] = useState('ambos-identico');
  const [ncStudy, setNcStudy] = useState(true);

  const [maisTab, setMaisTab] = useState<'erros' | 'discursiva' | 'notebooklm'>('erros');
  const [essayId, setEssayId] = useState(ESSAY_PROMPTS[0].id);
  const [essayText, setEssayText] = useState('');
  const [errSub, setErrSub] = useState(SUBJECT_META[0].name);
  const [errTop, setErrTop] = useState('');
  const [errMis, setErrMis] = useState('');
  const [errCor, setErrCor] = useState('');
  const [errFormFeedback, setErrFormFeedback] = useState('');

  const [nlmTopicId, setNlmTopicId] = useState('');
  const [nlmMode, setNlmMode] = useState('podcast');
  const [nlmCopied, setNlmCopied] = useState('');

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/state', { credentials: 'same-origin' });
      if (res.status === 401) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setDbError(data.error || 'Falha ao carregar dados.');
        return;
      }
      setDbError('');
      setTopics(data.topics || []);
      setLogs(data.logs || []);
      setErrors(data.errors || []);
      setEssays(data.essays || []);
      setChat(data.chat || []);
      if (data.topics?.length) {
        setTimerTopicId(prev => prev || data.topics[0].id);
        setNlmTopicId(prev => prev || data.topics[0].id);
      }
    } catch (e) {
      setDbError(e instanceof Error ? e.message : 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth', { credentials: 'same-origin' });
      const data = await res.json();
      setNeedsSetup(Boolean(data.needsSetup));
      setAuthenticated(Boolean(data.authenticated));
      setUsername(data.username || null);
      if (data.authenticated) await loadState();
      else setLoading(false);
    } catch {
      setDbError('Não foi possível verificar autenticação.');
      setLoading(false);
    } finally {
      setAuthChecked(true);
    }
  }, [loadState]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cmc_theme') === 'dark' ? 'dark' : 'light';
    setTheme(savedTheme);
    document.body.classList.toggle('dark', savedTheme === 'dark');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, chatBusy]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSeconds(s => (s <= 1 ? (setTimerRunning(false), 0) : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('cmc_theme', next);
    document.body.classList.toggle('dark', next === 'dark');
  };

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: needsSetup ? 'setup' : 'login', username: authUser, password: authPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Falha na autenticação.');
        return;
      }
      setAuthPass('');
      setNeedsSetup(false);
      setAuthenticated(true);
      setUsername(data.username);
      await loadState();
    } catch {
      setAuthError('Erro de rede ao tentar autenticar.');
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'logout' }),
    });
    setAuthenticated(false);
    setUsername(null);
    setTopics([]);
    setChat([]);
  }

  const daysLeft = useMemo(() => {
    const exam = new Date(`${EXAM_DATE}T08:00:00`);
    return Math.max(0, Math.ceil((exam.getTime() - Date.now()) / 86400000));
  }, []);

  const stats = useMemo(() => {
    const anl = topics.filter(t => t.overlap !== 'exclusivo-tecnico');
    const tec = topics.filter(t => t.overlap !== 'exclusivo-analista');
    const anlDone = anl.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    const tecDone = tec.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    let qr = 0, qt = 0, mins = 0;
    topics.forEach(t => { qr += t.q_right || 0; qt += t.q_total || 0; mins += t.minutes_studied || 0; });
    return {
      anlPct: anl.length ? Math.round((anlDone / anl.length) * 100) : 0,
      tecPct: tec.length ? Math.round((tecDone / tec.length) * 100) : 0,
      acc: qt ? `${Math.round((qr / qt) * 100)}%` : '—',
      hoursText: `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`,
    };
  }, [topics]);

  const studyQueue = useMemo(() => topics.filter(t => t.study_queue), [topics]);
  const reviewQueue = useMemo(
    () => topics.filter(t => t.review_queue).sort((a, b) => (a.next_review_date || '').localeCompare(b.next_review_date || '')),
    [topics]
  );

  const filteredTopics = useMemo(() => {
    const q = fSearch.toLowerCase();
    return topics.filter(t => {
      if (q && !`${t.title} ${t.subject} ${t.notes}`.toLowerCase().includes(q)) return false;
      if (fOverlap === 'ponte-peso' && t.overlap !== 'ponte-peso' && t.overlap !== 'ambos-ampliado') return false;
      else if (fOverlap !== 'all' && fOverlap !== 'ponte-peso' && t.overlap !== fOverlap) return false;
      if (fSubject !== 'all' && t.subject !== fSubject) return false;
      return true;
    });
  }, [topics, fSearch, fOverlap, fSubject]);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? chatInput).trim();
    if (!text || chatBusy) return;
    if (!overrideText) setChatInput('');

    setChat(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);
    setChatBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChat(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `**Erro:** ${data.error || 'Falha na API'}` }]);
      } else {
        await loadState();
      }
    } catch (e) {
      setChat(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `**Erro de rede:** ${e instanceof Error ? e.message : 'Erro'}` }]);
    } finally {
      setChatBusy(false);
    }
  }

  async function clearChat() {
    await fetch('/api/chat', { method: 'DELETE', credentials: 'same-origin' });
    await loadState();
  }

  async function topicAction(payload: Record<string, unknown>) {
    await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    await loadState();
  }

  async function addError() {
    if (!errMis.trim() || !errCor.trim()) {
      setErrFormFeedback('Preencha o erro e a regra correta.');
      return;
    }
    setErrFormFeedback('');
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ subject: errSub, topic: errTop.trim() || 'Geral', mistake: errMis.trim(), correction: errCor.trim() }),
    });
    setErrTop(''); setErrMis(''); setErrCor('');
    await loadState();
  }

  async function deleteError(id: number) {
    await fetch('/api/errors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id }),
    });
    await loadState();
  }

  async function saveEssay() {
    if (!essayText.trim()) return;
    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
    await fetch('/api/essays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ cargo: p?.cargo || '', title: p?.title || 'Rascunho', text: essayText.trim() }),
    });
    setEssayText('');
    await loadState();
  }

  async function correctEssayWithAgent() {
    if (!essayText.trim()) return;
    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
    setView('chat');
    await sendMessage(`Corrija esta discursiva (${p?.cargo} — ${p?.title}) pela regra 80/20 do Edital:\n\n${essayText.trim()}`);
  }

  const essayLines = useMemo(() => {
    if (!essayText.trim()) return 0;
    return essayText.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / 82)), 0);
  }, [essayText]);

  const nlmPromptText = useMemo(() => {
    const t = topics.find(x => x.id === nlmTopicId) || topics[0];
    if (!t) return '';
    const map: Record<string, string> = {
      podcast: `[Personalizar Audio Overview]\nRevisão direta em português para o concurso CMC 2026 (Selecon). Tema: ${t.subject} — ${t.title}. Foque em prazos, exceções e 3 perguntas V/F no final.`,
      feynman: `Explique "${t.title}" (${t.subject}) para o concurso CMC 2026 (Selecon) de forma simples, com 5 pegadinhas e resumo rápido.`,
      leiseca: `Extraia todos os PRAZOS, QUÓRUNS e artigos exatos sobre "${t.title}" (${t.subject}).`,
      quiz: `Crie 10 questões estilo Selecon sobre "${t.title}" (${t.subject}) com gabarito comentado ao final.`,
    };
    return map[nlmMode] || '';
  }, [topics, nlmTopicId, nlmMode]);

  function downloadFile(name: string, content: string, mime = 'text/markdown') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  const today = new Date().toISOString().slice(0, 10);

  if (!authChecked) {
    return (
      <div className="m3-auth-wrap">
        <div className="m3-auth-card space-y">
          <div className="skeleton" style={{ height: 24, width: '60%' }} />
          <div className="skeleton" style={{ height: 42 }} />
          <div className="skeleton" style={{ height: 42 }} />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="m3-auth-wrap">
        <form onSubmit={handleAuthSubmit} className="m3-auth-card space-y">
          <div className="flex-row" style={{ justifyContent: 'space-between' }}>
            <div className="flex-row" style={{ gap: 10 }}>
              <span className="m3-badge primary" style={{ padding: 8, borderRadius: 10 }}><Icon.Lock /></span>
              <div>
                <h1 style={{ fontSize: 18 }}>{needsSetup ? 'Configuração Inicial' : 'Entrar'}</h1>
                <div className="text-xs muted">Câmara de Cuiabá 2026</div>
              </div>
            </div>
            <button type="button" onClick={toggleTheme} className="m3-icon-btn" aria-label="Alternar tema"><Icon.Theme /></button>
          </div>
          <p className="text-xs muted" style={{ margin: 0 }}>
            {needsSetup
              ? 'Crie seu usuário e senha. Após o cadastro inicial, novos registros ficam bloqueados.'
              : 'Entre com suas credenciais para acessar seu plano de estudos.'}
          </p>
          <div>
            <label htmlFor="auth-user" className="text-xs muted" style={{ display: 'block', marginBottom: 4 }}>Usuário</label>
            <input id="auth-user" type="text" required autoComplete="username" className="m3-field" value={authUser} onChange={e => setAuthUser(e.target.value)} placeholder="ex: aderaldo" />
          </div>
          <div>
            <label htmlFor="auth-pass" className="text-xs muted" style={{ display: 'block', marginBottom: 4 }}>Senha {needsSetup && '(mín. 8 caracteres)'}</label>
            <input id="auth-pass" type="password" required minLength={needsSetup ? 8 : 1} autoComplete={needsSetup ? 'new-password' : 'current-password'} className="m3-field" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" />
          </div>
          {authError && <div className="inline-error">{authError}</div>}
          <button type="submit" disabled={authSubmitting} className="m3-btn m3-btn-filled" style={{ width: '100%' }}>
            {authSubmitting ? 'Verificando...' : (needsSetup ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="m3-shell">
      {/* M3 Top App Bar */}
      <header className="m3-top-bar">
        <h1 className="m3-top-title">Estudos CMC 2026</h1>
        <div className="flex-row" style={{ gap: 4 }}>
          <span className="m3-badge primary">{daysLeft}d</span>
          {username && <span className="m3-badge hide-mobile">{username}</span>}
          <button onClick={toggleTheme} className="m3-icon-btn" aria-label="Alternar tema"><Icon.Theme /></button>
          <button onClick={handleLogout} className="m3-icon-btn" aria-label="Sair"><Icon.Logout /></button>
        </div>
      </header>

      {/* M3 Navigation Bar (Top on Desktop, Bottom Pill Bar on Mobile) */}
      <nav className="m3-nav" role="tablist">
        <button role="tab" aria-selected={view === 'chat'} className={`m3-nav-item ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
          <span className="m3-nav-pill"><Icon.Chat /></span>
          <span>Mentor</span>
        </button>
        <button role="tab" aria-selected={view === 'hoje'} className={`m3-nav-item ${view === 'hoje' ? 'active' : ''}`} onClick={() => setView('hoje')}>
          <span className="m3-nav-pill"><Icon.Today /></span>
          <span>Hoje ({studyQueue.length + reviewQueue.length})</span>
        </button>
        <button role="tab" aria-selected={view === 'edital'} className={`m3-nav-item ${view === 'edital' ? 'active' : ''}`} onClick={() => setView('edital')}>
          <span className="m3-nav-pill"><Icon.List /></span>
          <span>Edital</span>
        </button>
        <button role="tab" aria-selected={view === 'mais'} className={`m3-nav-item ${view === 'mais' ? 'active' : ''}`} onClick={() => setView('mais')}>
          <span className="m3-nav-pill"><Icon.More /></span>
          <span>Mais</span>
        </button>
      </nav>

      {dbError && (
        <div className="inline-error" style={{ borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dbError}</span>
          <button onClick={loadState} className="m3-btn m3-btn-outlined m3-btn-sm">Recarregar</button>
        </div>
      )}

      <main className="m3-main">
        {/* VIEW 1: MENTOR */}
        {view === 'chat' && (
          <section className="m3-chat-wrap">
            <div className="m3-chat-bar">
              <button onClick={() => setView('hoje')} style={{ color: 'var(--md-primary)', fontWeight: 500 }}>
                Fila: {studyQueue.length} estudar · {reviewQueue.length} revisar
              </button>
              <button onClick={clearChat} className="muted" style={{ fontSize: 12 }}>Limpar chat</button>
            </div>

            <div className="m3-chat-list">
              {loading ? (
                <div className="space-y">
                  <div className="skeleton" style={{ height: 52, width: '75%' }} />
                  <div className="skeleton" style={{ height: 40, width: '50%', marginLeft: 'auto' }} />
                </div>
              ) : chat.length === 0 ? (
                <div className="m3-bubble assistant">
                  <p><strong>Pronto para estudar.</strong> Pergunte o que estudar hoje, peça um quiz ou relate o que já concluiu.</p>
                </div>
              ) : (
                chat.map(m => {
                  if (m.role === 'tool_trace') {
                    let items: string[] = [];
                    try { items = JSON.parse(m.content); } catch {}
                    return (
                      <div key={m.id} className="m3-trace-row">
                        {items.map((it, idx) => <span key={idx} className="m3-badge success"><Icon.Check /> {it}</span>)}
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className={`m3-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                      {m.role === 'user' ? m.content : renderFormattedText(m.content)}
                    </div>
                  );
                })
              )}
              {chatBusy && <div className="m3-bubble assistant muted">Atualizando...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="m3-suggestions">
              <button className="m3-chip" onClick={() => sendMessage('O que vamos estudar hoje?')}>O que estudar hoje?</button>
              <button className="m3-chip" onClick={() => sendMessage('Tenho 1h agora, monte um bloco.')}>Tenho 1h</button>
              <button className="m3-chip" onClick={() => sendMessage('Quiz de 3 questões Selecon do tema atual.')}>Quiz 3q</button>
              <button className="m3-chip" onClick={() => sendMessage('Quais meus pontos fracos?')}>Pontos fracos</button>
            </div>

            <div className="m3-composer">
              <textarea
                rows={1}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Mensagem para o mentor..."
              />
              <button disabled={chatBusy} onClick={() => sendMessage()} className="m3-btn m3-btn-filled" style={{ width: 44, height: 44, padding: 0 }} aria-label="Enviar mensagem">
                <Icon.Send />
              </button>
            </div>
          </section>
        )}

        {/* VIEW 2: HOJE */}
        {view === 'hoje' && (
          <section className="m3-view space-y">
            <div className="m3-metrics">
              <div className="m3-metric-card">
                <div className="text-xs muted">Analista TI</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{stats.anlPct}%</div>
              </div>
              <div className="m3-metric-card">
                <div className="text-xs muted">Técnico Leg.</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{stats.tecPct}%</div>
              </div>
              <div className="m3-metric-card">
                <div className="text-xs muted">Acertos</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{stats.acc}</div>
              </div>
            </div>

            <div className="two-col">
              <div className="m3-card-outlined">
                <div className="m3-card-head">
                  <span>Para Estudar ({studyQueue.length})</span>
                  <button onClick={() => setView('edital')} className="m3-btn m3-btn-tonal m3-btn-sm">+ Setar</button>
                </div>
                {studyQueue.length === 0 ? (
                  <div className="m3-card-body text-xs muted">Fila vazia. Pergunte ao Mentor ou clique em + Setar.</div>
                ) : studyQueue.map(t => (
                  <div key={t.id} className="m3-list-item">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="text-xs muted">{t.subject}</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                    </div>
                    <button onClick={() => topicAction({ action: 'complete_study', id: t.id })} className="m3-btn m3-btn-filled m3-btn-sm">Concluir</button>
                  </div>
                ))}
              </div>

              <div className="m3-card-outlined">
                <div className="m3-card-head">
                  <span>Revisões 1→3→7→15d ({reviewQueue.length})</span>
                </div>
                {reviewQueue.length === 0 ? (
                  <div className="m3-card-body text-xs muted">Sem revisões agendadas ainda.</div>
                ) : reviewQueue.map(t => {
                  const due = !t.next_review_date || t.next_review_date <= today;
                  return (
                    <div key={t.id} className="m3-list-item">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="text-xs" style={{ color: due ? 'var(--md-warn)' : 'var(--md-on-surface-variant)' }}>
                          {due ? 'Revisar hoje' : fmtBR(t.next_review_date)} · Ciclo {t.review_interval || 1}d
                        </div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                      </div>
                      <button onClick={() => topicAction({ action: 'complete_review', id: t.id })} className="m3-btn m3-btn-tonal m3-btn-sm">Revisado</button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="m3-card">
              <div className="m3-card-head">
                <span>Timer de Foco ({stats.hoursText})</span>
                <div className="flex-row" style={{ gap: 6 }}>
                  <button onClick={() => { setTimerRunning(false); setTimerInitial(50 * 60); setTimerSeconds(50 * 60); }} className="m3-chip">50m</button>
                  <button onClick={() => { setTimerRunning(false); setTimerInitial(25 * 60); setTimerSeconds(25 * 60); }} className="m3-chip">25m</button>
                  <button onClick={() => { setTimerRunning(false); setTimerInitial(15 * 60); setTimerSeconds(15 * 60); }} className="m3-chip">15m</button>
                </div>
              </div>
              <div className="m3-card-body space-y">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="mono" style={{ fontSize: 30, fontWeight: 500 }}>
                    {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
                  </span>
                  <div className="flex-row">
                    <button onClick={() => setTimerRunning(r => !r)} className="m3-btn m3-btn-filled m3-btn-sm">{timerRunning ? 'Pausar' : 'Iniciar'}</button>
                    <button
                      onClick={() => {
                        const min = Math.max(1, Math.round((timerInitial - timerSeconds) / 60) || Math.round(timerInitial / 60));
                        if (timerTopicId) topicAction({ action: 'log_timer', id: timerTopicId, minutes: min });
                        setTimerRunning(false);
                        setTimerSeconds(timerInitial);
                      }}
                      className="m3-btn m3-btn-outlined m3-btn-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
                <select aria-label="Tópico do timer" className="m3-field" value={timerTopicId} onChange={e => setTimerTopicId(e.target.value)}>
                  {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 50)}</option>)}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: EDITAL */}
        {view === 'edital' && (
          <section className="m3-view space-y">
            <div className="two-col" style={{ gap: 8 }}>
              <input className="m3-field" type="text" value={fSearch} onChange={e => setFSearch(e.target.value)} placeholder="Buscar tópico, lei..." />
              <div className="two-col" style={{ gap: 8 }}>
                <select aria-label="Cruzamento" className="m3-field" value={fOverlap} onChange={e => setFOverlap(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="ambos-identico">100% Comum</option>
                  <option value="ponte-peso">Ponte</option>
                  <option value="exclusivo-analista">Analista TI</option>
                  <option value="exclusivo-tecnico">Técnico</option>
                </select>
                <select aria-label="Disciplina" className="m3-field" value={fSubject} onChange={e => setFSubject(e.target.value)}>
                  <option value="all">Disciplina</option>
                  {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
              <span className="text-xs muted">{filteredTopics.length} tópicos</span>
              <button onClick={() => setShowCustomModal(true)} className="m3-btn m3-btn-tonal m3-btn-sm">+ Novo Tópico</button>
            </div>

            <div className="m3-card-outlined">
              {filteredTopics.map(t => {
                const badgeCls = t.overlap === 'ambos-identico' ? 'success' : t.overlap === 'ponte-peso' ? 'warn' : t.overlap === 'exclusivo-analista' ? 'primary' : 'error';
                const badgeTxt = t.overlap === 'ambos-identico' ? 'Comum' : t.overlap === 'ponte-peso' ? 'Ponte' : t.overlap === 'exclusivo-analista' ? 'Analista TI' : 'Técnico';
                return (
                  <div key={t.id} className="m3-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                    <div>
                      <div className="flex-row" style={{ gap: 6, marginBottom: 4 }}>
                        <strong className="text-xs">{t.subject}</strong>
                        <span className={`m3-badge ${badgeCls}`}>{badgeTxt}</span>
                        <span className="text-xs muted">Nível {t.mastery}/5 {t.q_total ? `· ${t.q_right}/${t.q_total}q` : ''}</span>
                      </div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                    </div>
                    <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
                      <button onClick={() => topicAction({ action: 'toggle_study', id: t.id })} className={`m3-btn m3-btn-sm ${t.study_queue ? 'm3-btn-filled' : 'm3-btn-outlined'}`}>
                        {t.study_queue ? 'Na fila' : '+ Estudar'}
                      </button>
                      <button onClick={() => topicAction({ action: 'toggle_review', id: t.id })} className="m3-btn m3-btn-tonal m3-btn-sm">
                        {t.review_queue ? `Rev ${fmtBR(t.next_review_date)}` : '+ Revisar'}
                      </button>
                      <button onClick={() => setEditTopic({ ...t })} className="m3-btn m3-btn-outlined m3-btn-sm">Editar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VIEW 4: MAIS */}
        {view === 'mais' && (
          <section className="m3-view space-y">
            <div className="flex-row" style={{ gap: 8 }}>
              <button onClick={() => setMaisTab('erros')} className={`m3-btn m3-btn-sm ${maisTab === 'erros' ? 'm3-btn-filled' : 'm3-btn-tonal'}`}>Erros ({errors.length})</button>
              <button onClick={() => setMaisTab('discursiva')} className={`m3-btn m3-btn-sm ${maisTab === 'discursiva' ? 'm3-btn-filled' : 'm3-btn-tonal'}`}>Discursiva</button>
              <button onClick={() => setMaisTab('notebooklm')} className={`m3-btn m3-btn-sm ${maisTab === 'notebooklm' ? 'm3-btn-filled' : 'm3-btn-tonal'}`}>NotebookLM</button>
            </div>

            {maisTab === 'erros' && (
              <div className="m3-card-outlined">
                <div className="m3-card-head">
                  <span>Caderno de Erros</span>
                  <button
                    onClick={() => {
                      let md = `# Erros CMC 2026 (${today})\n\n`;
                      errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** ${e.mistake} → ${e.correction}\n`; });
                      downloadFile(`erros_cmc_${today}.md`, md);
                    }}
                    className="m3-btn m3-btn-outlined m3-btn-sm"
                  >
                    Exportar .MD
                  </button>
                </div>
                <div className="m3-card-body space-y">
                  <select aria-label="Disciplina" className="m3-field" value={errSub} onChange={e => setErrSub(e.target.value)}>
                    {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <input className="m3-field" type="text" value={errTop} onChange={e => setErrTop(e.target.value)} placeholder="Assunto / Artigo" />
                  <input className="m3-field" type="text" value={errMis} onChange={e => setErrMis(e.target.value)} placeholder="O que você errou..." />
                  <input className="m3-field" type="text" value={errCor} onChange={e => setErrCor(e.target.value)} placeholder="Regra correta..." />
                  {errFormFeedback && <div className="inline-error">{errFormFeedback}</div>}
                  <button onClick={addError} className="m3-btn m3-btn-filled" style={{ width: '100%' }}>Registrar Erro</button>

                  {errors.map(e => (
                    <div key={e.id} style={{ padding: '10px 0', borderTop: '1px solid var(--md-outline-variant)' }}>
                      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                        <strong className="text-xs">{e.subject} — {e.topic}</strong>
                        <button onClick={() => deleteError(e.id)} className="text-xs muted">Remover</button>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--md-error)', marginTop: 3 }}>Erro: {e.mistake}</div>
                      <div className="text-xs" style={{ color: 'var(--md-success)', marginTop: 2 }}>Regra: {e.correction}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {maisTab === 'discursiva' && (
              <div className="m3-card-outlined">
                <div className="m3-card-head">
                  <span>Discursiva (20–30 linhas)</span>
                  <span className={`m3-badge ${essayLines >= 20 && essayLines <= 30 ? 'success' : ''}`}>{essayLines} / 30 linhas</span>
                </div>
                <div className="m3-card-body space-y">
                  <select aria-label="Tema" className="m3-field" value={essayId} onChange={e => setEssayId(e.target.value)}>
                    {ESSAY_PROMPTS.map(p => <option key={p.id} value={p.id}>[{p.cargo}] {p.title}</option>)}
                  </select>
                  <div className="text-xs muted" style={{ padding: 12, background: 'var(--md-surface-container-low)', borderRadius: 8 }}>
                    {ESSAY_PROMPTS.find(x => x.id === essayId)?.desc}
                  </div>
                  <textarea className="m3-field" rows={10} value={essayText} onChange={e => setEssayText(e.target.value)} placeholder="Escreva sua resposta..." />
                  <div className="flex-row">
                    <button onClick={correctEssayWithAgent} className="m3-btn m3-btn-filled" style={{ flex: 1 }}>Corrigir com Mentor</button>
                    <button onClick={saveEssay} className="m3-btn m3-btn-tonal">Salvar</button>
                  </div>
                  {essays.map(e => (
                    <div key={e.id} className="m3-list-item" style={{ padding: '8px 0' }}>
                      <span className="text-xs">[{e.cargo}] {e.title}</span>
                      <span className="text-xs muted">{fmtBR(e.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {maisTab === 'notebooklm' && (
              <div className="space-y">
                <div className="m3-card-outlined">
                  <div className="m3-card-head"><span>NotebookLM &amp; Drive</span></div>
                  <div className="m3-card-body space-y">
                    <a href="https://drive.google.com/drive/folders/1RU85Ck3qASnCMvCL6TgH_V6_OmwoPNTR" target="_blank" rel="noopener" className="m3-btn m3-btn-filled" style={{ width: '100%', textDecoration: 'none' }}>
                      Abrir Pasta no Google Drive
                    </a>
                    <button
                      onClick={() => {
                        let md = `# Progresso & Erros CMC 2026 (${today})\n\n`;
                        topics.filter(t => t.mastery <= 2 || t.study_queue || t.review_queue).forEach(t => {
                          md += `- [${t.subject}] ${t.title} (Nível ${t.mastery}/5)\n`;
                        });
                        md += '\n## Erros\n';
                        errors.forEach(e => { md += `- ${e.subject}: ${e.mistake} -> ${e.correction}\n`; });
                        downloadFile(`progresso_notebooklm_${today}.md`, md);
                      }}
                      className="m3-btn m3-btn-tonal"
                      style={{ width: '100%' }}
                    >
                      Baixar Progresso (.md) p/ NotebookLM
                    </button>
                    <select aria-label="Tópico" className="m3-field" value={nlmTopicId} onChange={e => setNlmTopicId(e.target.value)}>
                      {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 50)}</option>)}
                    </select>
                    <select aria-label="Modo" className="m3-field" value={nlmMode} onChange={e => setNlmMode(e.target.value)}>
                      <option value="podcast">Audio Overview (Podcast)</option>
                      <option value="feynman">Explicação Feynman</option>
                      <option value="leiseca">Prazos &amp; Quóruns</option>
                      <option value="quiz">Simulado 10 Questões</option>
                    </select>
                    <textarea className="m3-field mono" rows={4} readOnly value={nlmPromptText} />
                    <div className="flex-row">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(nlmPromptText);
                          setNlmCopied('Copiado.');
                          setTimeout(() => setNlmCopied(''), 2000);
                        }}
                        className="m3-btn m3-btn-outlined m3-btn-sm"
                      >
                        Copiar Prompt
                      </button>
                      {nlmCopied && <span className="text-xs" style={{ color: 'var(--md-success)' }}>{nlmCopied}</span>}
                    </div>
                  </div>
                </div>

                <div className="m3-card-outlined">
                  <div className="m3-card-head"><span>Últimas Sessões</span></div>
                  {logs.length === 0 ? (
                    <div className="m3-card-body text-xs muted">Nenhuma sessão registrada ainda.</div>
                  ) : logs.slice(0, 12).map(l => (
                    <div key={l.id} className="m3-list-item">
                      <span className="text-xs"><strong>{l.subject}</strong> · {l.title.slice(0, 32)}</span>
                      <span className="text-xs muted">{fmtBR(l.date)} · {l.minutes}m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* M3 DIALOG: EDITAR TÓPICO */}
      {editTopic && (
        <div className="m3-scrim">
          <div className="m3-dialog">
            <div className="m3-dialog-head">
              <div>
                <div className="text-xs muted">{editTopic.subject}</div>
                <div className="text-sm">{editTopic.title}</div>
              </div>
              <button onClick={() => setEditTopic(null)} className="m3-icon-btn" aria-label="Fechar">✕</button>
            </div>
            <div className="m3-dialog-body">
              <div className="two-col" style={{ gap: 10 }}>
                <label className="flex-row text-xs"><input type="checkbox" checked={editTopic.study_queue} onChange={e => setEditTopic({ ...editTopic, study_queue: e.target.checked })} /> Fila Estudar</label>
                <label className="flex-row text-xs"><input type="checkbox" checked={editTopic.review_queue} onChange={e => setEditTopic({ ...editTopic, review_queue: e.target.checked })} /> Fila Revisar</label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <label className="text-xs muted">Domínio</label>
                  <select className="m3-field" value={editTopic.mastery} onChange={e => setEditTopic({ ...editTopic, mastery: Number(e.target.value) })}>
                    <option value={1}>1/5</option><option value={2}>2/5</option><option value={3}>3/5</option><option value={4}>4/5</option><option value={5}>5/5</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs muted">Acertos</label>
                  <input type="number" min={0} className="m3-field" value={editTopic.q_right} onChange={e => setEditTopic({ ...editTopic, q_right: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs muted">Total</label>
                  <input type="number" min={0} className="m3-field" value={editTopic.q_total} onChange={e => setEditTopic({ ...editTopic, q_total: Number(e.target.value) })} />
                </div>
              </div>
              <textarea rows={3} className="m3-field" value={editTopic.notes} onChange={e => setEditTopic({ ...editTopic, notes: e.target.value })} placeholder="Anotações..." />
            </div>
            <div className="m3-dialog-actions">
              <button onClick={() => setEditTopic(null)} className="m3-btn m3-btn-outlined m3-btn-sm">Cancelar</button>
              <button onClick={async () => { await topicAction({ action: 'update', ...editTopic }); setEditTopic(null); }} className="m3-btn m3-btn-filled m3-btn-sm">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* M3 DIALOG: NOVO TÓPICO */}
      {showCustomModal && (
        <div className="m3-scrim">
          <div className="m3-dialog" style={{ maxWidth: 420 }}>
            <div className="m3-dialog-head">
              <span>Novo Tópico</span>
              <button onClick={() => setShowCustomModal(false)} className="m3-icon-btn" aria-label="Fechar">✕</button>
            </div>
            <div className="m3-dialog-body">
              <select aria-label="Disciplina" className="m3-field" value={ncSubject} onChange={e => setNcSubject(e.target.value)}>
                {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <input className="m3-field" type="text" value={ncTitle} onChange={e => setNcTitle(e.target.value)} placeholder="Título do conteúdo..." />
              <select aria-label="Cargo" className="m3-field" value={ncOverlap} onChange={e => setNcOverlap(e.target.value)}>
                <option value="ambos-identico">Comum aos 2 Cargos</option>
                <option value="exclusivo-analista">Analista TI</option>
                <option value="exclusivo-tecnico">Técnico</option>
              </select>
              <label className="flex-row text-xs"><input type="checkbox" checked={ncStudy} onChange={e => setNcStudy(e.target.checked)} /> Setar para hoje</label>
            </div>
            <div className="m3-dialog-actions">
              <button onClick={() => setShowCustomModal(false)} className="m3-btn m3-btn-outlined m3-btn-sm">Cancelar</button>
              <button
                onClick={async () => {
                  if (!ncTitle.trim()) return;
                  await topicAction({ action: 'create', subject: ncSubject, title: ncTitle.trim(), overlap: ncOverlap, setForToday: ncStudy });
                  setNcTitle('');
                  setShowCustomModal(false);
                }}
                className="m3-btn m3-btn-filled m3-btn-sm"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
