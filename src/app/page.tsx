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
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Note: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Play: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Chevron: ({ open }: { open: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Theme: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

export default function HomePage() {
  const [view, setView] = useState<'hoje' | 'materias' | 'mentor' | 'caderno'>('hoje');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authChecked, setAuthChecked] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

  // Active Study Sheet (Modal focado para estudar 1 tópico com Timer + Questões)
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [sheetSeconds, setSheetSeconds] = useState(40 * 60);
  const [sheetRunning, setSheetRunning] = useState(false);
  const [sheetQRight, setSheetQRight] = useState(0);
  const [sheetQTotal, setSheetQTotal] = useState(0);
  const [sheetMastery, setSheetMastery] = useState(3);
  const [sheetNotes, setSheetNotes] = useState('');

  // Accordion das 10 matérias
  const [openSubject, setOpenSubject] = useState<string | null>(SUBJECT_META[6].name);
  const [subjectSearch, setSubjectSearch] = useState('');

  // Mentor Chat
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Caderno (Erros / Discursiva / NotebookLM)
  const [cadernoTab, setCadernoTab] = useState<'erros' | 'discursiva' | 'notebooklm'>('erros');
  const [essayId, setEssayId] = useState(ESSAY_PROMPTS[0].id);
  const [essayText, setEssayText] = useState('');
  const [errSub, setErrSub] = useState(SUBJECT_META[0].name);
  const [errTop, setErrTop] = useState('');
  const [errMis, setErrMis] = useState('');
  const [errCor, setErrCor] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [nlmTopicId, setNlmTopicId] = useState('');
  const [nlmMode, setNlmMode] = useState('podcast');
  const [nlmCopied, setNlmCopied] = useState('');

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/state', { credentials: 'same-origin' });
      if (res.status === 401) { setAuthenticated(false); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setDbError(data.error || 'Erro ao carregar.'); return; }
      setDbError('');
      setTopics(data.topics || []);
      setLogs(data.logs || []);
      setErrors(data.errors || []);
      setEssays(data.essays || []);
      setChat(data.chat || []);
      if (data.topics?.length) setNlmTopicId(prev => prev || data.topics[0].id);
    } catch (e) {
      setDbError(e instanceof Error ? e.message : 'Erro de rede');
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
      if (data.authenticated) await loadState();
      else setLoading(false);
    } catch {
      setDbError('Falha ao conectar ao servidor.');
      setLoading(false);
    } finally {
      setAuthChecked(true);
    }
  }, [loadState]);

  useEffect(() => {
    const saved = localStorage.getItem('cmc_theme') === 'dark' ? 'dark' : 'light';
    setTheme(saved);
    document.body.classList.toggle('dark', saved === 'dark');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, chatBusy]);

  useEffect(() => {
    if (!sheetRunning) return;
    const id = setInterval(() => {
      setSheetSeconds(s => (s <= 1 ? (setSheetRunning(false), 0) : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [sheetRunning]);

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
      if (!res.ok) { setAuthError(data.error || 'Falha ao entrar.'); return; }
      setAuthPass(''); setNeedsSetup(false); setAuthenticated(true);
      await loadState();
    } catch {
      setAuthError('Erro de rede.');
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'logout' }) });
    setAuthenticated(false);
  }

  const daysLeft = useMemo(() => Math.max(0, Math.ceil((new Date(`${EXAM_DATE}T08:00:00`).getTime() - Date.now()) / 86400000)), []);

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
  const today = new Date().toISOString().slice(0, 10);
  const dueReviews = useMemo(
    () => topics.filter(t => t.review_queue && (!t.next_review_date || t.next_review_date <= today)),
    [topics, today]
  );
  const futureReviews = useMemo(
    () => topics.filter(t => t.review_queue && t.next_review_date > today).sort((a, b) => a.next_review_date.localeCompare(b.next_review_date)),
    [topics, today]
  );

  function openStudySheet(t: Topic) {
    setActiveTopic(t);
    setSheetSeconds(40 * 60);
    setSheetRunning(false);
    setSheetQRight(t.q_right || 0);
    setSheetQTotal(t.q_total || 0);
    setSheetMastery(t.mastery || 3);
    setSheetNotes(t.notes || '');
  }

  async function saveStudySheet(completeAndScheduleReview: boolean) {
    if (!activeTopic) return;
    const elapsedMin = Math.max(5, Math.round((40 * 60 - sheetSeconds) / 60) || 25);
    await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        action: 'update',
        id: activeTopic.id,
        study_queue: completeAndScheduleReview ? false : activeTopic.study_queue,
        review_queue: completeAndScheduleReview ? true : activeTopic.review_queue,
        next_review_date: completeAndScheduleReview ? undefined : activeTopic.next_review_date,
        review_interval: completeAndScheduleReview ? 1 : activeTopic.review_interval,
        mastery: sheetMastery,
        q_right: sheetQRight,
        q_total: sheetQTotal,
        notes: sheetNotes,
      }),
    });
    if (completeAndScheduleReview) {
      await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'log_timer', id: activeTopic.id, minutes: elapsedMin }),
      });
    }
    setSheetRunning(false);
    setActiveTopic(null);
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

  async function sendMessage(overrideText?: string, goToMentor = false) {
    const text = (overrideText ?? chatInput).trim();
    if (!text || chatBusy) return;
    if (!overrideText) setChatInput('');
    if (goToMentor) setView('mentor');

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
      setChat(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `**Erro:** ${e instanceof Error ? e.message : 'Erro'}` }]);
    } finally {
      setChatBusy(false);
    }
  }

  async function addError() {
    if (!errMis.trim() || !errCor.trim()) { setErrMsg('Preencha o erro e a regra correta.'); return; }
    setErrMsg('');
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
    await fetch('/api/errors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ id }) });
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

  const essayLines = useMemo(() => {
    if (!essayText.trim()) return 0;
    return essayText.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / 82)), 0);
  }, [essayText]);

  const nlmPromptText = useMemo(() => {
    const t = topics.find(x => x.id === nlmTopicId) || topics[0];
    if (!t) return '';
    const map: Record<string, string> = {
      podcast: `[Personalizar Audio Overview]\nRevisão objetiva para CMC 2026 (Selecon). Tema: ${t.subject} — ${t.title}. Prazos, exceções e 3 perguntas V/F.`,
      feynman: `Explique "${t.title}" (${t.subject}) para o concurso CMC 2026 com 5 pegadinhas da Selecon e resumo rápido.`,
      leiseca: `Extraia todos os PRAZOS, QUÓRUNS e artigos exatos sobre "${t.title}" (${t.subject}).`,
      quiz: `Crie 10 questões estilo Selecon sobre "${t.title}" (${t.subject}) com gabarito comentado ao final.`,
    };
    return map[nlmMode] || '';
  }, [topics, nlmTopicId, nlmMode]);

  function downloadFile(name: string, content: string) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  if (!authChecked) {
    return <div className="auth-wrap"><div className="auth-card muted text-sm">Carregando...</div></div>;
  }

  if (!authenticated) {
    return (
      <div className="auth-wrap">
        <form onSubmit={handleAuthSubmit} className="auth-card space-y">
          <div className="flex-row" style={{ justifyContent: 'space-between' }}>
            <div className="flex-row" style={{ gap: 10 }}>
              <span className="badge info" style={{ padding: 8, borderRadius: 10 }}><Icon.Lock /></span>
              <div>
                <h1 style={{ fontSize: 17 }}>{needsSetup ? 'Criar Acesso' : 'Entrar'}</h1>
                <div className="text-xs muted">Concurso Câmara de Cuiabá</div>
              </div>
            </div>
            <button type="button" onClick={toggleTheme} className="icon-btn" aria-label="Alternar tema"><Icon.Theme /></button>
          </div>
          <p className="text-xs muted" style={{ margin: 0 }}>
            {needsSetup ? 'Crie seu usuário e senha pessoais (único cadastro permitido).' : 'Entre para acessar seu plano de estudos.'}
          </p>
          <input type="text" required autoComplete="username" className="field" value={authUser} onChange={e => setAuthUser(e.target.value)} placeholder="Usuário" />
          <input type="password" required minLength={needsSetup ? 8 : 1} autoComplete={needsSetup ? 'new-password' : 'current-password'} className="field" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="Senha" />
          {authError && <div className="inline-error">{authError}</div>}
          <button type="submit" disabled={authSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
            {authSubmitting ? 'Entrando...' : (needsSetup ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="shell">
      {/* Topbar */}
      <header className="topbar">
        <div>
          <div className="topbar-title">Estudos CMC 2026</div>
          <div className="topbar-sub">{daysLeft} dias até a prova · {stats.hoursText} estudados</div>
        </div>
        <div className="flex-row" style={{ gap: 4 }}>
          <button onClick={toggleTheme} className="icon-btn" aria-label="Alternar tema"><Icon.Theme /></button>
          <button onClick={handleLogout} className="icon-btn" aria-label="Sair"><Icon.Logout /></button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav" role="tablist">
        <button role="tab" aria-selected={view === 'hoje'} className={`nav-btn ${view === 'hoje' ? 'active' : ''}`} onClick={() => setView('hoje')}>
          <span className="nav-pill"><Icon.Home /></span>
          <span>Hoje</span>
        </button>
        <button role="tab" aria-selected={view === 'materias'} className={`nav-btn ${view === 'materias' ? 'active' : ''}`} onClick={() => setView('materias')}>
          <span className="nav-pill"><Icon.Book /></span>
          <span>Matérias</span>
        </button>
        <button role="tab" aria-selected={view === 'mentor'} className={`nav-btn ${view === 'mentor' ? 'active' : ''}`} onClick={() => setView('mentor')}>
          <span className="nav-pill"><Icon.Chat /></span>
          <span>Mentor</span>
        </button>
        <button role="tab" aria-selected={view === 'caderno'} className={`nav-btn ${view === 'caderno' ? 'active' : ''}`} onClick={() => setView('caderno')}>
          <span className="nav-pill"><Icon.Note /></span>
          <span>Caderno</span>
        </button>
      </nav>

      {dbError && (
        <div className="inline-error" style={{ margin: '10px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dbError}</span>
          <button onClick={loadState} className="btn btn-outline btn-sm">Recarregar</button>
        </div>
      )}

      <main className="main">
        {/* ABA 1: HOJE (TELA INICIAL GUIADA E ÓBVIA) */}
        {view === 'hoje' && (
          <section className="scroll-view">
            {/* Progresso dos 2 Cargos */}
            <div className="hero">
              <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Seu Progresso</span>
                <span className="badge info">Acertos: {stats.acc}</span>
              </div>
              <div className="hero-grid">
                <div className="prog-box">
                  <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
                    <span className="muted">Analista TI</span>
                    <strong>{stats.anlPct}%</strong>
                  </div>
                  <div className="prog-track"><div className="prog-bar" style={{ width: `${stats.anlPct}%` }} /></div>
                </div>
                <div className="prog-box">
                  <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
                    <span className="muted">Técnico Leg.</span>
                    <strong>{stats.tecPct}%</strong>
                  </div>
                  <div className="prog-track"><div className="prog-bar" style={{ width: `${stats.tecPct}%` }} /></div>
                </div>
              </div>
            </div>

            {/* Revisões Vencidas Hoje */}
            {dueReviews.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <span>1. Revisar Hoje ({dueReviews.length})</span>
                  <span className="badge warn">Prioridade</span>
                </div>
                {dueReviews.map(t => (
                  <div key={t.id} className="task-item">
                    <div>
                      <div className="text-xs muted">{t.subject} · Ciclo {t.review_interval || 1}d</div>
                      <div style={{ fontWeight: 600, marginTop: 2 }}>{t.title}</div>
                    </div>
                    <div className="task-actions">
                      <button onClick={() => openStudySheet(t)} className="btn btn-outline btn-sm">Ver Notas</button>
                      <button onClick={() => topicAction({ action: 'complete_review', id: t.id })} className="btn btn-primary btn-sm">Marcar Revisado</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estudar Hoje */}
            <div className="card">
              <div className="card-head">
                <span>{dueReviews.length > 0 ? '2. ' : ''}Estudar Hoje ({studyQueue.length})</span>
                <button onClick={() => setView('materias')} className="btn btn-tonal btn-sm">+ Escolher Matéria</button>
              </div>
              {loading ? (
                <div className="card-pad muted text-sm">Carregando seu plano...</div>
              ) : studyQueue.length === 0 ? (
                <div className="card-pad space-y">
                  <p className="text-sm muted" style={{ margin: 0 }}>
                    Você ainda não definiu o que estudar hoje. Clique abaixo para o Mentor escolher os tópicos de maior peso nos dois cargos:
                  </p>
                  <button
                    onClick={() => sendMessage('O que vamos estudar hoje? Monte minha fila com 2 ou 3 tópicos prioritários.', true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Montar meu plano de hoje com o Mentor
                  </button>
                </div>
              ) : (
                studyQueue.map(t => (
                  <div key={t.id} className="task-item">
                    <div>
                      <div className="flex-row" style={{ gap: 6, marginBottom: 3 }}>
                        <span className="text-xs muted">{t.subject}</span>
                        <span className="badge info">{t.overlap === 'ambos-identico' ? '2 Cargos' : t.overlap === 'ponte-peso' ? 'Ponte' : t.overlap === 'exclusivo-analista' ? 'Analista TI' : 'Técnico'}</span>
                      </div>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                    </div>
                    <div className="task-actions">
                      <button onClick={() => topicAction({ action: 'toggle_study', id: t.id })} className="btn btn-outline btn-sm">Tirar</button>
                      <button onClick={() => openStudySheet(t)} className="btn btn-primary btn-sm"><Icon.Play /> Estudar</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Próximas Revisões */}
            {futureReviews.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <span>Próximas Revisões Agendadas</span>
                  <span className="text-xs muted">{futureReviews.length}</span>
                </div>
                {futureReviews.slice(0, 5).map(t => (
                  <div key={t.id} className="task-item" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="text-xs muted">{t.subject}</div>
                      <div className="text-sm" style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    </div>
                    <span className="badge">{fmtBR(t.next_review_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ABA 2: MATÉRIAS (AGRUPADO EM 10 DISCIPLINAS EXPANSÍVEIS) */}
        {view === 'materias' && (
          <section className="scroll-view">
            <input
              className="field"
              type="text"
              value={subjectSearch}
              onChange={e => setSubjectSearch(e.target.value)}
              placeholder="Buscar assunto no edital (ex: SQL, quórum, atos)..."
            />

            {SUBJECT_META.map(sm => {
              const subTopics = topics.filter(t =>
                t.subject === sm.name &&
                (!subjectSearch.trim() || `${t.title} ${t.subject}`.toLowerCase().includes(subjectSearch.toLowerCase()))
              );
              if (subjectSearch.trim() && subTopics.length === 0) return null;

              const doneCount = subTopics.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
              const isOpen = Boolean(subjectSearch.trim()) || openSubject === sm.name;

              return (
                <div key={sm.name} className="card">
                  <button className="subject-header" onClick={() => setOpenSubject(isOpen ? null : sm.name)}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{sm.name}</div>
                      <div className="text-xs muted" style={{ marginTop: 2 }}>
                        Analista: {sm.wAnl} · Técnico: {sm.wTec} · <strong>{doneCount}/{subTopics.length}</strong>
                      </div>
                    </div>
                    <Icon.Chevron open={isOpen} />
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--md-outline-soft)' }}>
                      {subTopics.map(t => (
                        <div key={t.id} className="task-item">
                          <div>
                            <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                            <div className="text-xs muted" style={{ marginTop: 3 }}>
                              Domínio {t.mastery}/5 {t.q_total > 0 ? `· ${t.q_right}/${t.q_total} acertos` : ''} {t.review_queue ? `· Rev. ${fmtBR(t.next_review_date)}` : ''}
                            </div>
                          </div>
                          <div className="task-actions">
                            <button
                              onClick={() => topicAction({ action: 'toggle_study', id: t.id })}
                              className={`btn btn-sm ${t.study_queue ? 'btn-tonal' : 'btn-outline'}`}
                            >
                              {t.study_queue ? 'Na fila de Hoje' : '+ Hoje'}
                            </button>
                            <button onClick={() => openStudySheet(t)} className="btn btn-primary btn-sm">Estudar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* ABA 3: MENTOR (CHAT LIMPO E CONCISO) */}
        {view === 'mentor' && (
          <section className="chat-wrap">
            <div style={{ padding: '10px 16px', background: 'var(--md-surface)', borderBottom: '1px solid var(--md-outline-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-xs muted">Diga o que estudou, acertos ou peça um quiz</span>
              <button onClick={async () => { await fetch('/api/chat', { method: 'DELETE', credentials: 'same-origin' }); await loadState(); }} className="text-xs muted" style={{ fontWeight: 600 }}>Limpar</button>
            </div>

            <div className="chat-list">
              {chat.length === 0 ? (
                <div className="bubble bot">
                  <p><strong>Como posso ajudar agora?</strong></p>
                  <p>Exemplos: &ldquo;O que estudamos hoje?&rdquo;, &ldquo;Fiz 17 de 20 em Atos Administrativos&rdquo; ou &ldquo;Me dê 3 questões de Regimento Interno&rdquo;.</p>
                </div>
              ) : (
                chat.map(m => {
                  if (m.role === 'tool_trace') {
                    let items: string[] = [];
                    try { items = JSON.parse(m.content); } catch {}
                    return (
                      <div key={m.id} className="flex-row" style={{ gap: 6 }}>
                        {items.map((it, idx) => <span key={idx} className="badge ok">✓ {it}</span>)}
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
                      {m.role === 'user' ? m.content : renderFormattedText(m.content)}
                    </div>
                  );
                })
              )}
              {chatBusy && <div className="bubble bot muted">Respondendo...</div>}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto', background: 'var(--md-bg)' }}>
              <button className="btn btn-outline btn-sm" onClick={() => sendMessage('O que vamos estudar hoje?')}>Plano de hoje</button>
              <button className="btn btn-outline btn-sm" onClick={() => sendMessage('Quiz de 3 questões Selecon do tema atual.')}>Quiz 3q</button>
              <button className="btn btn-outline btn-sm" onClick={() => sendMessage('Quais meus pontos fracos?')}>Pontos fracos</button>
            </div>

            <div className="composer">
              <textarea
                rows={1}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Digite aqui..."
              />
              <button disabled={chatBusy} onClick={() => sendMessage()} className="btn btn-primary" style={{ width: 44, height: 44, padding: 0 }} aria-label="Enviar">
                <Icon.Send />
              </button>
            </div>
          </section>
        )}

        {/* ABA 4: CADERNO (ERROS, DISCURSIVA, NOTEBOOKLM) */}
        {view === 'caderno' && (
          <section className="scroll-view">
            <div className="segmented">
              <button className={`seg-btn ${cadernoTab === 'erros' ? 'active' : ''}`} onClick={() => setCadernoTab('erros')}>Erros ({errors.length})</button>
              <button className={`seg-btn ${cadernoTab === 'discursiva' ? 'active' : ''}`} onClick={() => setCadernoTab('discursiva')}>Discursiva</button>
              <button className={`seg-btn ${cadernoTab === 'notebooklm' ? 'active' : ''}`} onClick={() => setCadernoTab('notebooklm')}>NotebookLM</button>
            </div>

            {cadernoTab === 'erros' && (
              <div className="card">
                <div className="card-head">
                  <span>Registrar Erro</span>
                  <button
                    onClick={() => {
                      let md = `# Erros CMC 2026 (${today})\n\n`;
                      errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** ${e.mistake} → ${e.correction}\n`; });
                      downloadFile(`erros_cmc_${today}.md`, md);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Baixar .MD
                  </button>
                </div>
                <div className="card-pad space-y">
                  <select aria-label="Disciplina" className="field" value={errSub} onChange={e => setErrSub(e.target.value)}>
                    {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <input className="field" type="text" value={errTop} onChange={e => setErrTop(e.target.value)} placeholder="Assunto / Artigo" />
                  <input className="field" type="text" value={errMis} onChange={e => setErrMis(e.target.value)} placeholder="O que você errou..." />
                  <input className="field" type="text" value={errCor} onChange={e => setErrCor(e.target.value)} placeholder="Regra correta..." />
                  {errMsg && <div className="inline-error">{errMsg}</div>}
                  <button onClick={addError} className="btn btn-primary" style={{ width: '100%' }}>Salvar Erro</button>

                  {errors.map(e => (
                    <div key={e.id} style={{ paddingTop: 10, borderTop: '1px solid var(--md-outline-soft)' }}>
                      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                        <strong className="text-xs">{e.subject} · {e.topic}</strong>
                        <button onClick={() => deleteError(e.id)} className="text-xs muted">Apagar</button>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--md-error)', marginTop: 3 }}>Erro: {e.mistake}</div>
                      <div className="text-xs" style={{ color: 'var(--md-success)', marginTop: 2 }}>Correto: {e.correction}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cadernoTab === 'discursiva' && (
              <div className="card">
                <div className="card-head">
                  <span>Prática Discursiva</span>
                  <span className={`badge ${essayLines >= 20 && essayLines <= 30 ? 'ok' : ''}`}>{essayLines} / 30 linhas</span>
                </div>
                <div className="card-pad space-y">
                  <select aria-label="Tema" className="field" value={essayId} onChange={e => setEssayId(e.target.value)}>
                    {ESSAY_PROMPTS.map(p => <option key={p.id} value={p.id}>[{p.cargo}] {p.title}</option>)}
                  </select>
                  <div className="text-xs muted" style={{ padding: 10, background: 'var(--md-surface-alt)', borderRadius: 10 }}>
                    {ESSAY_PROMPTS.find(x => x.id === essayId)?.desc}
                  </div>
                  <textarea className="field" rows={9} value={essayText} onChange={e => setEssayText(e.target.value)} placeholder="Escreva sua resposta (20 a 30 linhas)..." />
                  <div className="flex-row">
                    <button
                      onClick={() => {
                        if (!essayText.trim()) return;
                        const p = ESSAY_PROMPTS.find(x => x.id === essayId);
                        sendMessage(`Corrija esta discursiva (${p?.cargo} — ${p?.title}) pela regra 80/20:\n\n${essayText.trim()}`, true);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Corrigir com Mentor
                    </button>
                    <button onClick={saveEssay} className="btn btn-outline">Salvar</button>
                  </div>
                  {essays.map(e => (
                    <div key={e.id} className="text-xs muted" style={{ paddingTop: 8, borderTop: '1px solid var(--md-outline-soft)' }}>
                      {fmtBR(e.date)} · [{e.cargo}] {e.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cadernoTab === 'notebooklm' && (
              <div className="space-y">
                <div className="card card-pad space-y">
                  <div style={{ fontWeight: 600 }}>Integração com NotebookLM</div>
                  <p className="text-xs muted" style={{ margin: 0 }}>Acesse suas 3 pastas sem duplicatas no Google Drive ou gere prompts prontos abaixo:</p>
                  <a href="https://drive.google.com/drive/folders/1RU85Ck3qASnCMvCL6TgH_V6_OmwoPNTR" target="_blank" rel="noopener" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
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
                    className="btn btn-tonal"
                    style={{ width: '100%' }}
                  >
                    Baixar Meu Progresso (.md)
                  </button>
                  <select aria-label="Tópico" className="field" value={nlmTopicId} onChange={e => setNlmTopicId(e.target.value)}>
                    {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 48)}</option>)}
                  </select>
                  <select aria-label="Modo" className="field" value={nlmMode} onChange={e => setNlmMode(e.target.value)}>
                    <option value="podcast">Audio Overview (Podcast)</option>
                    <option value="feynman">Explicação Feynman</option>
                    <option value="leiseca">Prazos &amp; Quóruns</option>
                    <option value="quiz">Simulado 10 Questões</option>
                  </select>
                  <textarea className="field mono" rows={4} readOnly value={nlmPromptText} />
                  <button
                    onClick={() => { navigator.clipboard.writeText(nlmPromptText); setNlmCopied('Copiado.'); setTimeout(() => setNlmCopied(''), 2000); }}
                    className="btn btn-outline btn-sm"
                  >
                    Copiar Prompt
                  </button>
                  {nlmCopied && <span className="text-xs" style={{ color: 'var(--md-success)', marginLeft: 8 }}>{nlmCopied}</span>}
                </div>

                {logs.length > 0 && (
                  <div className="card">
                    <div className="card-head"><span>Histórico Recente</span></div>
                    {logs.slice(0, 8).map(l => (
                      <div key={l.id} className="task-item" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <span className="text-xs"><strong>{l.subject}</strong> · {l.title.slice(0, 28)}</span>
                        <span className="text-xs muted">{fmtBR(l.date)} · {l.minutes}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* BOTTOM SHEET DE ESTUDO (TIMER + QUESTÕES + CONCLUIR) */}
      {activeTopic && (
        <div className="scrim" onClick={e => { if (e.target === e.currentTarget) { setSheetRunning(false); setActiveTopic(null); } }}>
          <div className="sheet">
            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="text-xs muted">{activeTopic.subject}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{activeTopic.title}</div>
              </div>
              <button onClick={() => { setSheetRunning(false); setActiveTopic(null); }} className="icon-btn" aria-label="Fechar">✕</button>
            </div>

            {/* Timer Bloco */}
            <div style={{ background: 'var(--md-surface-alt)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: 28, fontWeight: 700 }}>
                {String(Math.floor(sheetSeconds / 60)).padStart(2, '0')}:{String(sheetSeconds % 60).padStart(2, '0')}
              </span>
              <div className="flex-row">
                <button onClick={() => setSheetRunning(r => !r)} className="btn btn-tonal btn-sm">{sheetRunning ? 'Pausar' : 'Iniciar'}</button>
                <button onClick={() => { setSheetRunning(false); setSheetSeconds(40 * 60); }} className="btn btn-outline btn-sm">40m</button>
              </div>
            </div>

            {/* Questões e Domínio */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <label className="text-xs muted">Domínio</label>
                <select className="field" value={sheetMastery} onChange={e => setSheetMastery(Number(e.target.value))}>
                  <option value={1}>1/5</option><option value={2}>2/5</option><option value={3}>3/5</option><option value={4}>4/5</option><option value={5}>5/5</option>
                </select>
              </div>
              <div>
                <label className="text-xs muted">Acertos</label>
                <input type="number" min={0} className="field" value={sheetQRight} onChange={e => setSheetQRight(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-xs muted">Total Q.</label>
                <input type="number" min={0} className="field" value={sheetQTotal} onChange={e => setSheetQTotal(Number(e.target.value))} />
              </div>
            </div>

            <textarea rows={3} className="field" value={sheetNotes} onChange={e => setSheetNotes(e.target.value)} placeholder="Anotações rápidas, artigos ou dúvidas..." />

            <div className="flex-row" style={{ gap: 8 }}>
              <button onClick={() => saveStudySheet(false)} className="btn btn-outline" style={{ flex: 1 }}>Salvar</button>
              <button onClick={() => saveStudySheet(true)} className="btn btn-primary" style={{ flex: 2 }}>Concluir + Agendar Revisão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
