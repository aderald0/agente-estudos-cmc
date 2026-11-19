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

function todayISO() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function fmtBR(iso: string) {
  if (!iso) return '—';
  const parts = iso.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : iso;
}

function renderFormattedText(md: string) {
  const lines = md.split('\n');
  return lines.map((line, i) => {
    const html = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    if (line.startsWith('- ')) {
      return <li key={i} dangerouslySetInnerHTML={{ __html: html.slice(2) }} />;
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />;
  });
}

export default function HomePage() {
  const [view, setView] = useState<'chat' | 'edital' | 'lab' | 'notebooklm'>('chat');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  const [pinRequired, setPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pin, setPin] = useState('');

  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [essays, setEssays] = useState<EssayEntry[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  // Chat
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filters
  const [fSearch, setFSearch] = useState('');
  const [fOverlap, setFOverlap] = useState('all');
  const [fSubject, setFSubject] = useState('all');
  const [fQueue, setFQueue] = useState('all');

  // Timer
  const [timerInitial, setTimerInitial] = useState(50 * 60);
  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTopicId, setTimerTopicId] = useState('');

  // Modals
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [ncSubject, setNcSubject] = useState(SUBJECT_META[0].name);
  const [ncTitle, setNcTitle] = useState('');
  const [ncOverlap, setNcOverlap] = useState('ambos-identico');
  const [ncStudy, setNcStudy] = useState(true);

  // Lab: Discursiva & Erros
  const [essayId, setEssayId] = useState(ESSAY_PROMPTS[0].id);
  const [essayText, setEssayText] = useState('');
  const [errSub, setErrSub] = useState(SUBJECT_META[0].name);
  const [errTop, setErrTop] = useState('');
  const [errMis, setErrMis] = useState('');
  const [errCor, setErrCor] = useState('');

  // NotebookLM
  const [nlmTopicId, setNlmTopicId] = useState('');
  const [nlmMode, setNlmMode] = useState('podcast');
  const [nlmCopied, setNlmCopied] = useState('');

  const apiFetch = useCallback(async (url: string, init?: RequestInit) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const activePin = pin || (typeof window !== 'undefined' ? localStorage.getItem('cmc_pin') || '' : '');
    if (activePin) headers['x-app-pin'] = activePin;
    return fetch(url, { ...init, headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) } });
  }, [pin]);

  const loadState = useCallback(async () => {
    try {
      const res = await apiFetch('/api/state');
      if (res.status === 401) {
        setPinRequired(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setDbError(data.error || 'Erro ao carregar dados.');
        setLoading(false);
        return;
      }
      setPinRequired(false);
      setDbError('');
      setGeminiConfigured(Boolean(data.geminiConfigured));
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
      setDbError(e instanceof Error ? e.message : 'Falha de rede');
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cmc_theme') === 'light' ? 'light' : 'dark';
    setTheme(savedTheme);
    document.body.classList.toggle('light', savedTheme === 'light');
    const savedPin = localStorage.getItem('cmc_pin') || '';
    if (savedPin) setPin(savedPin);
    loadState();
  }, [loadState]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, chatBusy]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSeconds(s => {
        if (s <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cmc_theme', next);
    document.body.classList.toggle('light', next === 'light');
  };

  const daysLeft = useMemo(() => {
    const now = new Date();
    const exam = new Date(`${EXAM_DATE}T08:00:00`);
    return Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / 86400000));
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
      anlDone, anlTotal: anl.length,
      tecPct: tec.length ? Math.round((tecDone / tec.length) * 100) : 0,
      tecDone, tecTotal: tec.length,
      qr, qt,
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
      if (fQueue === 'study' && !t.study_queue) return false;
      if (fQueue === 'review' && !t.review_queue) return false;
      if (fQueue === 'nao-iniciado' && t.status !== 'nao-iniciado') return false;
      if (fQueue === 'dominado' && t.status !== 'dominado') return false;
      return true;
    });
  }, [topics, fSearch, fOverlap, fSubject, fQueue]);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? chatInput).trim();
    if (!text || chatBusy) return;
    if (!overrideText) setChatInput('');

    setChat(prev => [...prev, { id: Date.now(), role: 'user', content: text }]);
    setChatBusy(true);
    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
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
    await apiFetch('/api/chat', { method: 'DELETE' });
    await loadState();
  }

  async function topicAction(payload: Record<string, unknown>) {
    await apiFetch('/api/topics', { method: 'POST', body: JSON.stringify(payload) });
    await loadState();
  }

  async function addError() {
    if (!errMis.trim() || !errCor.trim()) return;
    await apiFetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({ subject: errSub, topic: errTop.trim() || 'Geral', mistake: errMis.trim(), correction: errCor.trim() }),
    });
    setErrTop(''); setErrMis(''); setErrCor('');
    await loadState();
  }

  async function deleteError(id: number) {
    await apiFetch('/api/errors', { method: 'DELETE', body: JSON.stringify({ id }) });
    await loadState();
  }

  async function saveEssay() {
    if (!essayText.trim()) return;
    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
    await apiFetch('/api/essays', {
      method: 'POST',
      body: JSON.stringify({ cargo: p?.cargo || '', title: p?.title || 'Rascunho', text: essayText.trim() }),
    });
    setEssayText('');
    await loadState();
  }

  async function correctEssayWithAgent() {
    if (!essayText.trim()) return;
    const p = ESSAY_PROMPTS.find(x => x.id === essayId);
    setView('chat');
    await sendMessage(
      `Corrija minha Prova Discursiva para **${p?.cargo}** no tema **"${p?.title}"** seguindo o item 9.2.4 do Edital (80 pts Conteúdo + 20 pts Correção Formal, mínimo 40 pts, 20–30 linhas):\n\n${essayText.trim()}`
    );
  }

  const essayLines = useMemo(() => {
    if (!essayText.trim()) return 0;
    return essayText.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / 82)), 0);
  }, [essayText]);

  const nlmPromptText = useMemo(() => {
    const t = topics.find(x => x.id === nlmTopicId) || topics[0];
    if (!t) return '';
    const map: Record<string, string> = {
      podcast: `[Cole em "Personalizar" do Audio Overview]\nConduza este episódio em português do Brasil para o concurso da Câmara Municipal de Cuiabá (Selecon). Foco em: ${t.subject} — ${t.title}. Destaquem prazos, exceções e encerrem com 3 perguntas de V/F.`,
      feynman: `Explique "${t.title}" (${t.subject}) para o concurso CMC 2026 (Selecon) com: 1) Ideia simples + analogia; 2) Definições literais; 3) Tabela comparativa; 4) 5 pegadinhas de prova; 5) Resumo em 5 pontos.`,
      leiseca: `Extraia todos os PRAZOS, QUÓRUNS, competências e artigos exatos sobre "${t.title}" (${t.subject}) apenas das fontes do caderno.`,
      quiz: `Crie 10 questões inéditas estilo Instituto Selecon (A, B, C, D) sobre "${t.title}" (${t.subject}), deixando o gabarito comentado apenas no final.`,
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

  if (pinRequired) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
        <div className="panel" style={{ maxWidth: 380, width: '100%' }}>
          <div className="panel-head"><span>Acesso Protegido (PIN)</span></div>
          <div className="panel-body space-y">
            <p className="text-xs muted" style={{ margin: 0 }}>Digite o PIN configurado em <code>APP_ACCESS_PIN</code> na Vercel.</p>
            <input
              type="password"
              className="field"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="PIN de acesso"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  localStorage.setItem('cmc_pin', pinInput);
                  setPin(pinInput);
                  setLoading(true);
                  setTimeout(loadState, 50);
                }
              }}
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                localStorage.setItem('cmc_pin', pinInput);
                setPin(pinInput);
                setLoading(true);
                setTimeout(loadState, 50);
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const today = todayISO();

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h1>Agente de Estudos CMC 2026</h1>
            <div className="brand-sub">Analista TI (Manhã) &amp; Técnico Legislativo (Tarde) • Neon Postgres + Gemini</div>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="pill">{daysLeft} dias até 20/12</span>
          <span className={`pill ${geminiConfigured ? 'ok' : 'warn'}`}>
            {geminiConfigured ? 'Gemini API Conectada' : 'Falta GEMINI_API_KEY na Vercel'}
          </span>
          <span className={`pill ${dbError ? 'danger' : 'ok'}`}>
            {dbError ? 'Erro Neon DB' : 'Neon Postgres Online'}
          </span>
          <button onClick={toggleTheme} className="btn btn-sm">Tema</button>
        </div>
      </header>

      {/* Nav */}
      <nav className="nav-tabs">
        <button className={`nav-tab ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>Agente Mentor (Chat)</button>
        <button className={`nav-tab ${view === 'edital' ? 'active' : ''}`} onClick={() => setView('edital')}>Edital Cruzado &amp; Progresso</button>
        <button className={`nav-tab ${view === 'lab' ? 'active' : ''}`} onClick={() => setView('lab')}>Discursiva (20–30 linhas) &amp; Erros</button>
        <button className={`nav-tab ${view === 'notebooklm' ? 'active' : ''}`} onClick={() => setView('notebooklm')}>NotebookLM &amp; Histórico</button>
      </nav>

      {dbError && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-soft)', borderBottom: '1px solid var(--danger)', fontSize: 12 }}>
          <strong>Banco de dados não conectado:</strong> {dbError} — Configure <code>DATABASE_URL</code> (Neon) e <code>GEMINI_API_KEY</code> nas variáveis de ambiente da Vercel.
        </div>
      )}

      <main className="main-area">
        {/* VIEW 1: CHAT */}
        {view === 'chat' && (
          <section className="view-chat">
            <div className="chat-panel">
              <div className="chat-header">
                <strong className="text-sm">Mentor de Estudos (Salva automaticamente no Neon)</strong>
                <button onClick={clearChat} className="btn btn-sm">Limpar conversa</button>
              </div>

              <div className="chat-messages">
                {loading ? (
                  <div className="text-xs muted">Carregando seu progresso do banco Neon...</div>
                ) : chat.length === 0 ? (
                  <div className="msg assistant">
                    <p><strong>Olá! Sou seu Agente de Estudos para a Câmara Municipal de Cuiabá (Edital 001/2026).</strong></p>
                    <p>Todo o seu progresso fica salvo no <strong>PostgreSQL do Neon</strong>. Você pode conversar comigo normalmente:</p>
                    <ul>
                      <li><em>&ldquo;O que vamos estudar hoje?&rdquo;</em> — eu analiso suas revisões vencidas e já monto sua fila.</li>
                      <li><em>&ldquo;Estudei Atos Administrativos 45 min e acertei 17/20&rdquo;</em> — eu salvo os acertos e agendo sua revisão.</li>
                      <li><em>&ldquo;Errei uma questão sobre quórum de 2/3 na LOM&rdquo;</em> — eu registro no Caderno de Erros e explico a regra.</li>
                    </ul>
                  </div>
                ) : (
                  chat.map(m => {
                    if (m.role === 'tool_trace') {
                      let items: string[] = [];
                      try { items = JSON.parse(m.content); } catch {}
                      return (
                        <div key={m.id} className="tool-trace">
                          {items.map((it, idx) => <span key={idx} className="tool-chip">✓ {it}</span>)}
                        </div>
                      );
                    }
                    return (
                      <div key={m.id} className={`msg ${m.role === 'user' ? 'user' : 'assistant'}`}>
                        {m.role === 'user' ? m.content : renderFormattedText(m.content)}
                      </div>
                    );
                  })
                )}
                {chatBusy && <div className="msg assistant">Pensando e atualizando seu plano...</div>}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-suggestions">
                <button className="chip-btn" onClick={() => sendMessage('Bom dia! O que vamos estudar e revisar hoje?')}>O que vamos estudar hoje?</button>
                <button className="chip-btn" onClick={() => sendMessage('Tenho 1 hora disponível agora. Monte um bloco de estudo + revisão com foco nos dois cargos.')}>Tenho 1h agora</button>
                <button className="chip-btn" onClick={() => sendMessage('Me faça um quiz rápido de 3 questões estilo Selecon sobre o tema que estou estudando.')}>Quiz Selecon (3q)</button>
                <button className="chip-btn" onClick={() => sendMessage('Quais são meus pontos mais fracos e erros registrados até agora?')}>Meus pontos fracos</button>
                <button className="chip-btn" onClick={() => sendMessage('Me dê um tema provável de prova discursiva (20 a 30 linhas).')}>Treinar Discursiva</button>
              </div>

              <div className="chat-input-bar">
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
                  placeholder="Converse com seu agente: 'O que estudamos hoje?', 'Fiz 16/20 em Atos Adm.'..."
                />
                <button disabled={chatBusy} onClick={() => sendMessage()} className="btn btn-primary" style={{ minHeight: 40, padding: '0 16px' }}>
                  Enviar
                </button>
              </div>
            </div>

            <aside className="chat-sidebar">
              <div className="panel">
                <div className="panel-head">
                  <span>Progresso nos 2 Cargos</span>
                  <span className="text-xs muted">Acertos: {stats.acc}</span>
                </div>
                <div className="panel-body space-y">
                  <div>
                    <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>Analista Leg. — TI</span>
                      <strong>{stats.anlPct}%</strong>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${stats.anlPct}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>Técnico Legislativo</span>
                      <strong>{stats.tecPct}%</strong>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${stats.tecPct}%`, background: 'var(--info)' }} /></div>
                  </div>
                  <div className="text-xs muted">{stats.hoursText} focados • {stats.qt} questões</div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <span>Timer de Foco</span>
                  <div className="flex-row" style={{ gap: 4 }}>
                    <button onClick={() => { setTimerRunning(false); setTimerInitial(50 * 60); setTimerSeconds(50 * 60); }} className="btn btn-sm">50m</button>
                    <button onClick={() => { setTimerRunning(false); setTimerInitial(25 * 60); setTimerSeconds(25 * 60); }} className="btn btn-sm">25m</button>
                    <button onClick={() => { setTimerRunning(false); setTimerInitial(15 * 60); setTimerSeconds(15 * 60); }} className="btn btn-sm">15m</button>
                  </div>
                </div>
                <div className="panel-body space-y">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="mono" style={{ fontSize: 24, fontWeight: 600 }}>
                      {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
                    </span>
                    <div className="flex-row" style={{ gap: 6 }}>
                      <button onClick={() => setTimerRunning(r => !r)} className="btn btn-primary btn-sm">{timerRunning ? 'Pausar' : 'Iniciar'}</button>
                      <button
                        onClick={() => {
                          const min = Math.max(1, Math.round((timerInitial - timerSeconds) / 60) || Math.round(timerInitial / 60));
                          if (timerTopicId) topicAction({ action: 'log_timer', id: timerTopicId, minutes: min });
                          setTimerRunning(false);
                          setTimerSeconds(timerInitial);
                        }}
                        className="btn btn-sm"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                  <select className="field" value={timerTopicId} onChange={e => setTimerTopicId(e.target.value)} style={{ fontSize: 12 }}>
                    {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 50)}</option>)}
                  </select>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <span>Para Estudar</span>
                  <button onClick={() => setView('edital')} className="text-xs" style={{ color: 'var(--accent)' }}>+ Setar</button>
                </div>
                {studyQueue.length === 0 ? (
                  <div className="panel-body text-xs muted">Vazio. Pergunte ao agente &ldquo;O que vamos estudar hoje?&rdquo;.</div>
                ) : studyQueue.map(t => (
                  <div key={t.id} className="queue-item">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="text-xs muted">{t.subject}</div>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{t.title}</div>
                    </div>
                    <button onClick={() => topicAction({ action: 'complete_study', id: t.id })} className="btn btn-primary btn-sm" title="Concluir e agendar revisão +1d">✓</button>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-head">
                  <span>Revisões (1→3→7→15d)</span>
                  <span className="text-xs muted">{reviewQueue.length}</span>
                </div>
                {reviewQueue.length === 0 ? (
                  <div className="panel-body text-xs muted">Sem revisões agendadas ainda.</div>
                ) : reviewQueue.slice(0, 6).map(t => {
                  const due = !t.next_review_date || t.next_review_date <= today;
                  return (
                    <div key={t.id} className="queue-item">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="text-xs" style={{ color: due ? 'var(--warn)' : 'var(--text-muted)' }}>
                          {due ? 'Hoje' : fmtBR(t.next_review_date)} • Ciclo {t.review_interval || 1}d
                        </div>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                      </div>
                      <button onClick={() => topicAction({ action: 'complete_review', id: t.id })} className="btn btn-sm">✓</button>
                    </div>
                  );
                })}
              </div>
            </aside>
          </section>
        )}

        {/* VIEW 2: EDITAL CRUZADO */}
        {view === 'edital' && (
          <section className="view">
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-lbl">Cobertura Analista TI</span>
                <span className="kpi-val">{stats.anlPct}%</span>
                <span className="text-xs muted">{stats.anlDone}/{stats.anlTotal} tópicos</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-lbl">Cobertura Técnico Leg.</span>
                <span className="kpi-val">{stats.tecPct}%</span>
                <span className="text-xs muted">{stats.tecDone}/{stats.tecTotal} tópicos</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-lbl">Precisão em Questões</span>
                <span className="kpi-val">{stats.acc}</span>
                <span className="text-xs muted">{stats.qr} acertos / {stats.qt} feitas</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-lbl">Carga Única do Edital</span>
                <span className="kpi-val">~980 págs</span>
                <span className="text-xs muted">6 apostilas 100% idênticas entre cargos</span>
              </div>
            </div>

            <div className="filter-bar">
              <input className="field" type="text" value={fSearch} onChange={e => setFSearch(e.target.value)} placeholder="Buscar tópico, lei ou termo..." />
              <select className="field" value={fOverlap} onChange={e => setFOverlap(e.target.value)}>
                <option value="all">Cruzamento: Todos</option>
                <option value="ambos-identico">100% Comum (2 Cargos)</option>
                <option value="ponte-peso">Ponte (Muda Peso) / Ampliado</option>
                <option value="exclusivo-analista">Exclusivo Analista TI</option>
                <option value="exclusivo-tecnico">Exclusivo Técnico Leg.</option>
              </select>
              <select className="field" value={fSubject} onChange={e => setFSubject(e.target.value)}>
                <option value="all">Disciplina: Todas</option>
                {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <select className="field" value={fQueue} onChange={e => setFQueue(e.target.value)}>
                <option value="all">Status: Todos</option>
                <option value="study">Setados p/ Estudar</option>
                <option value="review">Setados p/ Revisar</option>
                <option value="nao-iniciado">Não Iniciados</option>
                <option value="dominado">Dominados</option>
              </select>
            </div>

            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="text-xs muted">Exibindo {filteredTopics.length} de {topics.length} tópicos</span>
              <button onClick={() => setShowCustomModal(true)} className="btn btn-primary btn-sm">+ Novo Tópico Personalizado</button>
            </div>

            <div className="panel">
              {filteredTopics.map(t => {
                const sm = SUBJECT_META.find(s => s.name === t.subject) || { wAnl: '—', wTec: '—' };
                const acc = t.q_total ? `${t.q_right}/${t.q_total}q (${Math.round((t.q_right / t.q_total) * 100)}%)` : '0q';
                const pillCls = t.overlap === 'ambos-identico' ? 'ok' : t.overlap === 'ponte-peso' ? 'warn' : t.overlap === 'exclusivo-analista' ? 'info' : 'danger';
                const pillTxt = t.overlap === 'ambos-identico' ? '100% Comum' : t.overlap === 'ponte-peso' ? 'Ponte / Ampliado' : t.overlap === 'exclusivo-analista' ? 'Exclusivo Analista TI' : 'Exclusivo Técnico';
                return (
                  <div key={t.id} className="topic-row">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="flex-row" style={{ gap: 6, marginBottom: 4 }}>
                        <strong className="text-xs">{t.subject}</strong>
                        <span className={`pill ${pillCls}`} style={{ padding: '2px 7px', fontSize: 11 }}>{pillTxt}</span>
                        <span className="text-xs muted">ANL: {sm.wAnl} • TEC: {sm.wTec} • Domínio {t.mastery}/5 • {acc}</span>
                      </div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{t.title}</div>
                    </div>
                    <div className="flex-row" style={{ gap: 6 }}>
                      <button onClick={() => topicAction({ action: 'toggle_study', id: t.id })} className={`btn btn-sm ${t.study_queue ? 'btn-primary' : ''}`}>
                        {t.study_queue ? '✓ Estudar' : '+ Estudar'}
                      </button>
                      <button onClick={() => topicAction({ action: 'toggle_review', id: t.id })} className="btn btn-sm">
                        {t.review_queue ? `↻ Rev ${fmtBR(t.next_review_date)}` : '+ Revisar'}
                      </button>
                      <button onClick={() => setEditTopic({ ...t })} className="btn btn-sm">Editar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VIEW 3: DISCURSIVA & ERROS */}
        {view === 'lab' && (
          <section className="view">
            <div className="two-col">
              <div className="panel">
                <div className="panel-head">
                  <span>Laboratório Discursiva (20 a 30 Linhas • 80/20)</span>
                  <span className={`pill ${essayLines >= 20 && essayLines <= 30 ? 'ok' : ''}`}>{essayLines} / 30 linhas</span>
                </div>
                <div className="panel-body space-y">
                  <select className="field" value={essayId} onChange={e => setEssayId(e.target.value)}>
                    {ESSAY_PROMPTS.map(p => <option key={p.id} value={p.id}>[{p.cargo}] {p.title}</option>)}
                  </select>
                  <div className="text-xs muted" style={{ padding: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7 }}>
                    {ESSAY_PROMPTS.find(x => x.id === essayId)?.desc}
                  </div>
                  <textarea
                    className="field"
                    rows={12}
                    value={essayText}
                    onChange={e => setEssayText(e.target.value)}
                    placeholder="Escreva sua resposta (20 a 30 linhas) e peça para o Agente Gemini corrigir pela rubrica 80/20 do Edital..."
                  />
                  <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                    <span className="text-xs muted">{essayText.trim() ? essayText.trim().split(/\s+/).length : 0} palavras</span>
                    <div className="flex-row">
                      <button onClick={correctEssayWithAgent} className="btn btn-primary btn-sm">Corrigir com Agente Gemini</button>
                      <button onClick={saveEssay} className="btn btn-sm">Salvar no Neon</button>
                    </div>
                  </div>
                  <div className="space-y">
                    {essays.map(e => (
                      <div key={e.id} className="queue-item" style={{ border: '1px solid var(--border)', borderRadius: 6 }}>
                        <span className="text-xs">[{e.cargo}] {e.title}</span>
                        <span className="text-xs muted">{fmtBR(e.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <span>Caderno de Erros &amp; Lacunas</span>
                  <button
                    onClick={() => {
                      let md = `# Caderno de Erros CMC 2026 (${today})\n\n`;
                      errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** Errei "${e.mistake}" | Correto: "${e.correction}"\n`; });
                      downloadFile(`erros_cmc_${today}.md`, md);
                    }}
                    className="btn btn-sm"
                  >
                    Exportar .MD
                  </button>
                </div>
                <div className="panel-body space-y">
                  <div className="two-col" style={{ gap: 8 }}>
                    <select className="field" value={errSub} onChange={e => setErrSub(e.target.value)}>
                      {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <input className="field" type="text" value={errTop} onChange={e => setErrTop(e.target.value)} placeholder="Assunto / Artigo de lei" />
                  </div>
                  <input className="field" type="text" value={errMis} onChange={e => setErrMis(e.target.value)} placeholder="O que eu errei / pegadinha da Selecon..." />
                  <div className="flex-row">
                    <input className="field" style={{ flex: 1 }} type="text" value={errCor} onChange={e => setErrCor(e.target.value)} placeholder="Regra correta para memorizar..." />
                    <button onClick={addError} className="btn btn-primary btn-sm">Registrar</button>
                  </div>
                  <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                    {errors.length === 0 ? (
                      <div className="text-xs muted" style={{ padding: '16px 0' }}>Nenhum erro registrado. Você também pode dizer no chat: <em>&ldquo;Errei uma questão sobre X&rdquo;</em> que o agente salva aqui!</div>
                    ) : errors.map(e => (
                      <div key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                          <strong className="text-xs">{e.subject} — {e.topic}</strong>
                          <button onClick={() => deleteError(e.id)} className="text-xs muted">Remover</button>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--danger)', marginTop: 3 }}>✗ {e.mistake}</div>
                        <div className="text-xs" style={{ color: 'var(--accent)', marginTop: 2 }}>✓ {e.correction}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: NOTEBOOKLM & HISTÓRICO */}
        {view === 'notebooklm' && (
          <section className="view">
            <div className="two-col">
              <div className="panel">
                <div className="panel-head"><span>Integração com Gemini Notebook / NotebookLM</span></div>
                <div className="panel-body space-y">
                  <p className="text-xs muted" style={{ margin: 0 }}>
                    As 3 pastas sem duplicatas já estão no seu Google Drive (<code>concurso camara/NotebookLM - Prontos para Importar/</code>).
                  </p>
                  <a href="https://drive.google.com/drive/folders/1RU85Ck3qASnCMvCL6TgH_V6_OmwoPNTR" target="_blank" rel="noopener" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                    Abrir Pasta Pronta no Google Drive
                  </a>
                  <button
                    onClick={() => {
                      let md = `# Status de Estudos & Pontos Fracos — CMC 2026 (${today})\n\n## Tópicos Críticos/Em Andamento\n`;
                      topics.filter(t => t.mastery <= 2 || t.study_queue || t.review_queue || t.notes).forEach(t => {
                        md += `- **[${t.subject}]** ${t.title} | Domínio: ${t.mastery}/5 | Questões: ${t.q_right}/${t.q_total}${t.notes ? ' | Notas: ' + t.notes.replace(/\n/g, ' ') : ''}\n`;
                      });
                      md += '\n## Caderno de Erros\n';
                      errors.forEach(e => { md += `- **${e.subject} (${e.topic}):** Errei "${e.mistake}" → Correto: "${e.correction}"\n`; });
                      downloadFile(`progresso_notebooklm_cmc_${today}.md`, md);
                    }}
                    className="btn"
                    style={{ width: '100%' }}
                  >
                    Baixar Meu Progresso + Erros (.md) p/ NotebookLM
                  </button>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }} className="space-y">
                    <strong className="text-xs">Gerador Rápido de Prompt p/ NotebookLM:</strong>
                    <select className="field" value={nlmTopicId} onChange={e => setNlmTopicId(e.target.value)}>
                      {topics.map(t => <option key={t.id} value={t.id}>[{t.subject}] {t.title.slice(0, 55)}</option>)}
                    </select>
                    <select className="field" value={nlmMode} onChange={e => setNlmMode(e.target.value)}>
                      <option value="podcast">Audio Overview (Podcast de Revisão)</option>
                      <option value="feynman">Explicação Feynman + Pegadinhas Selecon</option>
                      <option value="leiseca">Mapa de Prazos, Quóruns e Artigos</option>
                      <option value="quiz">Simulado 10 Questões Comentadas</option>
                    </select>
                    <textarea className="field mono" rows={5} readOnly value={nlmPromptText} />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(nlmPromptText);
                        setNlmCopied('Copiado!');
                        setTimeout(() => setNlmCopied(''), 2000);
                      }}
                      className="btn btn-sm"
                    >
                      Copiar Prompt
                    </button>
                    {nlmCopied && <span className="text-xs" style={{ color: 'var(--accent)', marginLeft: 8 }}>{nlmCopied}</span>}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><span>Histórico de Sessões (Neon Postgres)</span></div>
                <div className="panel-body space-y">
                  <button
                    onClick={() => downloadFile(`backup_neon_cmc_${today}.json`, JSON.stringify({ topics, logs, errors, essays }, null, 2), 'application/json')}
                    className="btn"
                  >
                    Exportar Backup JSON
                  </button>
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {logs.length === 0 ? (
                      <div className="text-xs muted">Nenhuma sessão registrada ainda.</div>
                    ) : logs.map(l => (
                      <div key={l.id} className="queue-item">
                        <span className="text-xs"><strong>{l.subject}</strong> — {l.title.slice(0, 42)}</span>
                        <span className="text-xs muted">{fmtBR(l.date)} • {l.minutes}m • {l.kind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL EDITAR TÓPICO */}
      {editTopic && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <div>
                <div className="text-xs muted">{editTopic.subject}</div>
                <div className="text-sm">{editTopic.title}</div>
              </div>
              <button onClick={() => setEditTopic(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="two-col" style={{ gap: 10 }}>
                <label className="flex-row text-xs"><input type="checkbox" checked={editTopic.study_queue} onChange={e => setEditTopic({ ...editTopic, study_queue: e.target.checked })} /> Setado p/ Estudar</label>
                <label className="flex-row text-xs"><input type="checkbox" checked={editTopic.review_queue} onChange={e => setEditTopic({ ...editTopic, review_queue: e.target.checked })} /> Setado p/ Revisar</label>
              </div>
              <div className="two-col" style={{ gap: 10 }}>
                <div>
                  <label className="text-xs muted">Data Estudo</label>
                  <input type="date" className="field" value={editTopic.study_date} onChange={e => setEditTopic({ ...editTopic, study_date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs muted">Próxima Revisão</label>
                  <input type="date" className="field" value={editTopic.next_review_date} onChange={e => setEditTopic({ ...editTopic, next_review_date: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <label className="text-xs muted">Domínio (1–5)</label>
                  <select className="field" value={editTopic.mastery} onChange={e => setEditTopic({ ...editTopic, mastery: Number(e.target.value) })}>
                    <option value={1}>1 — Crítico</option>
                    <option value={2}>2 — Básico</option>
                    <option value={3}>3 — Médio</option>
                    <option value={4}>4 — Bom</option>
                    <option value={5}>5 — Dominado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs muted">Acertos</label>
                  <input type="number" min={0} className="field" value={editTopic.q_right} onChange={e => setEditTopic({ ...editTopic, q_right: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs muted">Total Questões</label>
                  <input type="number" min={0} className="field" value={editTopic.q_total} onChange={e => setEditTopic({ ...editTopic, q_total: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-xs muted">Anotações / Artigos / Macetes</label>
                <textarea rows={4} className="field" value={editTopic.notes} onChange={e => setEditTopic({ ...editTopic, notes: e.target.value })} />
              </div>
            </div>
            <div className="modal-foot">
              <button onClick={() => setEditTopic(null)} className="btn">Cancelar</button>
              <button
                onClick={async () => {
                  await topicAction({ action: 'update', ...editTopic });
                  setEditTopic(null);
                }}
                className="btn btn-primary"
              >
                Salvar no Neon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO TÓPICO */}
      {showCustomModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-head">
              <span>Novo Tópico / Meta</span>
              <button onClick={() => setShowCustomModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <select className="field" value={ncSubject} onChange={e => setNcSubject(e.target.value)}>
                {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <input className="field" type="text" value={ncTitle} onChange={e => setNcTitle(e.target.value)} placeholder="Ex: Lei Seca LC 93/2003 ou Simulado #1" />
              <select className="field" value={ncOverlap} onChange={e => setNcOverlap(e.target.value)}>
                <option value="ambos-identico">Comum aos 2 Cargos</option>
                <option value="exclusivo-analista">Exclusivo Analista TI</option>
                <option value="exclusivo-tecnico">Exclusivo Técnico</option>
              </select>
              <label className="flex-row text-xs"><input type="checkbox" checked={ncStudy} onChange={e => setNcStudy(e.target.checked)} /> Já setar para estudar hoje</label>
            </div>
            <div className="modal-foot">
              <button onClick={() => setShowCustomModal(false)} className="btn">Cancelar</button>
              <button
                onClick={async () => {
                  if (!ncTitle.trim()) return;
                  await topicAction({ action: 'create', subject: ncSubject, title: ncTitle.trim(), overlap: ncOverlap, setForToday: ncStudy });
                  setNcTitle('');
                  setShowCustomModal(false);
                }}
                className="btn btn-primary"
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
