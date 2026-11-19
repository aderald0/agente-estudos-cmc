'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EditalView } from '../components/EditalView';
import { FocusModal } from '../components/FocusModal';
import { Icons } from '../components/Icons';
import { MentorView } from '../components/MentorView';
import { NotebookView } from '../components/NotebookView';
import { PracticeView } from '../components/PracticeView';
import { TodayDashboard } from '../components/TodayDashboard';
import { EXAM_DATE, SUBJECT_META } from '../lib/syllabus';
import { ChatMsg, ErrorEntry, EssayEntry, Flashcard, NavTab, PracticeQuestion, StudyLog, Topic } from '../lib/types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function HomePage() {
  const [tab, setTab] = useState<NavTab>('hoje');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

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
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);

  const [focusTopic, setFocusTopic] = useState<Topic | null>(null);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [ncSubject, setNcSubject] = useState(SUBJECT_META[0].name);
  const [ncTitle, setNcTitle] = useState('');
  const [ncOverlap, setNcOverlap] = useState('ambos-identico');
  const [ncStudy, setNcStudy] = useState(true);

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
        setDbError(data.error || 'Erro ao carregar dados.');
        return;
      }
      setDbError('');
      setTopics(data.topics || []);
      setLogs(data.logs || []);
      setErrors(data.errors || []);
      setEssays(data.essays || []);
      setChat(data.chat || []);
      setQuestions(data.questions || []);
      setFlashcards(data.flashcards || []);
    } catch (e) {
      setDbError(e instanceof Error ? e.message : 'Erro de conexão.');
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
    const saved = localStorage.getItem('cmc_theme') === 'dark' ? 'dark' : 'light';
    setTheme(saved);
    document.body.classList.toggle('dark', saved === 'dark');
    checkAuth();

    if (typeof window !== 'undefined') {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
      setIsInstalledPwa(standalone);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }

      const onBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };
      const onAppInstalled = () => {
        setIsInstalledPwa(true);
        setDeferredPrompt(null);
        setShowInstallModal(false);
      };

      window.addEventListener('beforeinstallprompt', onBeforeInstall);
      window.addEventListener('appinstalled', onAppInstalled);
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onAppInstalled);
      };
    }
  }, [checkAuth]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

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
        setAuthError(data.error || 'Falha ao autenticar.');
        return;
      }
      setAuthPass('');
      setNeedsSetup(false);
      setAuthenticated(true);
      setUsername(data.username);
      await loadState();
    } catch {
      setAuthError('Erro de rede.');
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

  async function practiceAction(payload: Record<string, unknown>) {
    await fetch('/api/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    await loadState();
  }

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

  const daysLeft = useMemo(
    () => Math.max(0, Math.ceil((new Date(`${EXAM_DATE}T08:00:00`).getTime() - Date.now()) / 86400000)),
    []
  );

  const overallPct = useMemo(() => {
    if (!topics.length) return 0;
    const done = topics.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    return Math.round((done / topics.length) * 100);
  }, [topics]);

  const tabTitles: Record<NavTab, string> = {
    hoje: 'Painel de Estudos · Hoje',
    pratica: 'Prática Ativa · 200 Questões Selecon & Flashcards',
    mentor: 'Mentor Inteligente',
    edital: 'Edital Verticalizado (Sumário das Apostilas)',
    caderno: 'Caderno de Erros, Discursiva & NotebookLM',
  };

  if (!authChecked) {
    return (
      <div className="auth-screen">
        <div className="auth-panel space-y">
          <div className="ds-skeleton" style={{ height: 24, width: '60%' }} />
          <div className="ds-skeleton" style={{ height: 38 }} />
          <div className="ds-skeleton" style={{ height: 38 }} />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="auth-screen">
        <form onSubmit={handleAuthSubmit} className="auth-panel space-y">
          <div className="flex-row" style={{ justifyContent: 'space-between' }}>
            <div className="flex-row" style={{ gap: 10 }}>
              <span className="brand-icon"><Icons.Lock /></span>
              <div>
                <h1 style={{ fontSize: 17 }}>{needsSetup ? 'Configuração Inicial' : 'Estudos CMC 2026'}</h1>
                <div className="text-xs muted">Analista TI &amp; Técnico Legislativo</div>
              </div>
            </div>
            <button type="button" onClick={toggleTheme} className="ds-icon-btn" aria-label="Alternar tema"><Icons.SunMoon /></button>
          </div>

          <p className="text-xs muted" style={{ margin: 0 }}>
            {needsSetup
              ? 'Crie seu usuário e senha pessoais. Após o cadastro inicial, novos registros públicos ficam bloqueados.'
              : 'Entre com suas credenciais para acessar seu painel, revisões e mentor.'}
          </p>

          <div>
            <label htmlFor="auth-u" className="field-label">Usuário</label>
            <input id="auth-u" type="text" required autoComplete="username" className="ds-input" value={authUser} onChange={e => setAuthUser(e.target.value)} placeholder="ex: aderaldo" />
          </div>

          <div>
            <label htmlFor="auth-p" className="field-label">Senha {needsSetup && '(mín. 8 caracteres)'}</label>
            <input id="auth-p" type="password" required minLength={needsSetup ? 8 : 1} autoComplete={needsSetup ? 'new-password' : 'current-password'} className="ds-input" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" />
          </div>

          {authError && <div className="inline-alert error">{authError}</div>}

          <button type="submit" disabled={authSubmitting} className="ds-btn ds-btn-primary" style={{ width: '100%' }}>
            {authSubmitting ? 'Autenticando...' : (needsSetup ? 'Criar Conta e Entrar' : 'Entrar no Painel')}
          </button>

          {!isInstalledPwa && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="ds-btn ds-btn-secondary"
              style={{ width: '100%' }}
            >
              <Icons.Smartphone size={15} /> Instalar App no Celular
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="saas-shell">
      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside className={`saas-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="brand-id">
              <div className="brand-icon"><Icons.Logo /></div>
              <div className="hide-collapsed">
                <div className="brand-name">Estudos CMC</div>
                <div className="brand-tag">Edital 001/2026</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(c => !c)}
              className="ds-icon-btn hide-collapsed"
              aria-label="Recolher menu"
              title="Recolher menu"
            >
              <Icons.SidebarToggle size={16} />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Navegação principal">
            <button className={`side-link ${tab === 'hoje' ? 'active' : ''}`} onClick={() => setTab('hoje')}>
              <Icons.Home /> <span className="hide-collapsed">Hoje</span>
            </button>
            <button className={`side-link ${tab === 'pratica' ? 'active' : ''}`} onClick={() => setTab('pratica')}>
              <Icons.Check /> <span className="hide-collapsed">Questões &amp; Cards</span>
            </button>
            <button className={`side-link ${tab === 'mentor' ? 'active' : ''}`} onClick={() => setTab('mentor')}>
              <Icons.Sparkles /> <span className="hide-collapsed">Mentor</span>
            </button>
            <button className={`side-link ${tab === 'edital' ? 'active' : ''}`} onClick={() => setTab('edital')}>
              <Icons.BookOpen /> <span className="hide-collapsed">Edital</span>
            </button>
            <button className={`side-link ${tab === 'caderno' ? 'active' : ''}`} onClick={() => setTab('caderno')}>
              <Icons.FileText /> <span className="hide-collapsed">Caderno</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="side-mini-stats hide-collapsed">
            <div className="flex-row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
              <span className="muted">Progresso Geral</span>
              <strong>{overallPct}%</strong>
            </div>
            <div className="ds-progress"><div className="ds-progress-fill green" style={{ width: `${overallPct}%` }} /></div>
            <div className="text-xs muted">{daysLeft} dias para a prova</div>
          </div>

          <div className="side-user-row">
            <div className="flex-row" style={{ minWidth: 0 }}>
              <span className="user-avatar">{(username || 'A')[0].toUpperCase()}</span>
              <span className="text-xs hide-collapsed" style={{ fontWeight: 600 }}>{username || 'Candidato'}</span>
            </div>
            <button onClick={handleLogout} className="ds-icon-btn hide-collapsed" aria-label="Sair" title="Sair">
              <Icons.Logout />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="saas-main-wrap">
        <header className="saas-topbar">
          <div className="topbar-left">
            {sidebarCollapsed && (
              <button onClick={() => setSidebarCollapsed(false)} className="ds-icon-btn" aria-label="Expandir menu">
                <Icons.SidebarToggle size={16} />
              </button>
            )}
            <h1 className="topbar-heading">{tabTitles[tab]}</h1>
          </div>

          <div className="topbar-right">
            <span className="ds-badge ds-badge-indigo">{daysLeft}d até 20/12</span>
            <button onClick={toggleTheme} className="ds-icon-btn" aria-label="Alternar tema"><Icons.SunMoon /></button>
            <button onClick={handleLogout} className="ds-icon-btn" aria-label="Sair" title="Sair"><Icons.Logout /></button>
          </div>
        </header>

        {dbError && (
          <div className="inline-alert error" style={{ margin: '12px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{dbError}</span>
            <button onClick={loadState} className="ds-btn ds-btn-secondary ds-btn-sm">Recarregar</button>
          </div>
        )}

        <main className="saas-content">
          {tab === 'hoje' && (
            <TodayDashboard
              topics={topics}
              questions={questions}
              loading={loading}
              onStartFocus={t => setFocusTopic(t)}
              onTopicAction={topicAction}
              onAskMentorPlan={() => {
                setTab('mentor');
                sendMessage('O que estudar hoje? Monte meu plano com os tópicos mais importantes.');
              }}
              onNavigate={setTab}
            />
          )}

          {tab === 'pratica' && (
            <PracticeView
              questions={questions}
              flashcards={flashcards}
              onPracticeAction={practiceAction}
              onExplainWithMentor={promptText => {
                setTab('mentor');
                sendMessage(promptText);
              }}
            />
          )}

          {tab === 'mentor' && (
            <MentorView
              chat={chat}
              topics={topics}
              chatInput={chatInput}
              chatBusy={chatBusy}
              onChangeInput={setChatInput}
              onSend={sendMessage}
              onClear={async () => {
                await fetch('/api/chat', { method: 'DELETE', credentials: 'same-origin' });
                await loadState();
              }}
              onStartFocus={t => setFocusTopic(t)}
            />
          )}

          {tab === 'edital' && (
            <EditalView
              topics={topics}
              onStartFocus={t => setFocusTopic(t)}
              onEditTopic={t => setEditTopic({ ...t })}
              onCreateCustom={() => setShowCustomModal(true)}
              onTopicAction={topicAction}
            />
          )}

          {tab === 'caderno' && (
            <NotebookView
              topics={topics}
              errors={errors}
              essays={essays}
              logs={logs}
              onAddError={async payload => {
                await fetch('/api/errors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
                await loadState();
              }}
              onDeleteError={async id => {
                await fetch('/api/errors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ id }) });
                await loadState();
              }}
              onSaveEssay={async payload => {
                await fetch('/api/essays', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
                await loadState();
              }}
              onCorrectEssayWithMentor={promptText => {
                setTab('mentor');
                sendMessage(promptText);
              }}
            />
          )}
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="mobile-bottom-nav" aria-label="Navegação mobile">
          <button className={`mob-nav-btn ${tab === 'hoje' ? 'active' : ''}`} onClick={() => setTab('hoje')}>
            <Icons.Home size={19} /> <span>Hoje</span>
          </button>
          <button className={`mob-nav-btn ${tab === 'pratica' ? 'active' : ''}`} onClick={() => setTab('pratica')}>
            <Icons.Check size={19} /> <span>Prática</span>
          </button>
          <button className={`mob-nav-btn ${tab === 'mentor' ? 'active' : ''}`} onClick={() => setTab('mentor')}>
            <Icons.Sparkles size={19} /> <span>Mentor</span>
          </button>
          <button className={`mob-nav-btn ${tab === 'edital' ? 'active' : ''}`} onClick={() => setTab('edital')}>
            <Icons.BookOpen size={19} /> <span>Edital</span>
          </button>
          <button className={`mob-nav-btn ${tab === 'caderno' ? 'active' : ''}`} onClick={() => setTab('caderno')}>
            <Icons.FileText size={19} /> <span>Caderno</span>
          </button>
        </nav>
      </div>

      {/* FOCUS STUDY SESSION MODAL */}
      <FocusModal
        topic={focusTopic}
        onClose={() => setFocusTopic(null)}
        onVerifyFeynman={(t, notes) => {
          setFocusTopic(null);
          setTab('mentor');
          sendMessage(
            `Valide meu resumo Feynman sobre o capítulo "${t.title}" (${t.subject}): "${notes || 'Sem anotações escritas — me faça 1 pergunta-chave para testar se compreendi.'}"`
          );
        }}
        onSave={async ({ id, minutes, q_right, q_total, mastery, notes, complete }) => {
          if (complete) {
            await topicAction({
              action: 'update',
              id,
              study_queue: false,
              review_queue: true,
              review_interval: 1,
              mastery,
              q_right,
              q_total,
              notes,
            });
            await topicAction({ action: 'log_timer', id, minutes });
          } else {
            await topicAction({
              action: 'update',
              id,
              study_queue: focusTopic?.study_queue,
              review_queue: focusTopic?.review_queue,
              next_review_date: focusTopic?.next_review_date,
              review_interval: focusTopic?.review_interval,
              mastery,
              q_right,
              q_total,
              notes,
            });
            if (minutes > 0) await topicAction({ action: 'log_timer', id, minutes });
          }
          setFocusTopic(null);
        }}
      />

      {/* EDIT TOPIC MODAL */}
      {editTopic && (
        <div className="ds-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setEditTopic(null); }}>
          <div className="ds-modal" role="dialog" aria-modal="true" aria-label="Editar tópico">
            <div className="ds-modal-header">
              <div>
                <div className="text-xs muted">{editTopic.subject}</div>
                <h2 className="ds-modal-title">{editTopic.title}</h2>
              </div>
              <button onClick={() => setEditTopic(null)} className="ds-icon-btn" aria-label="Fechar"><Icons.Close /></button>
            </div>
            <div className="ds-modal-body space-y">
              <div className="flex-row" style={{ gap: 18 }}>
                <label className="flex-row text-sm"><input type="checkbox" checked={editTopic.study_queue} onChange={e => setEditTopic({ ...editTopic, study_queue: e.target.checked })} /> Na fila de hoje</label>
                <label className="flex-row text-sm"><input type="checkbox" checked={editTopic.review_queue} onChange={e => setEditTopic({ ...editTopic, review_queue: e.target.checked })} /> Em revisão</label>
              </div>
              <div className="grid-3">
                <div>
                  <label className="field-label">Domínio</label>
                  <select className="ds-select" value={editTopic.mastery} onChange={e => setEditTopic({ ...editTopic, mastery: Number(e.target.value) })}>
                    <option value={1}>1/5</option><option value={2}>2/5</option><option value={3}>3/5</option><option value={4}>4/5</option><option value={5}>5/5</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Certas</label>
                  <input type="number" min={0} className="ds-input" value={editTopic.q_right} onChange={e => setEditTopic({ ...editTopic, q_right: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="field-label">Total</label>
                  <input type="number" min={0} className="ds-input" value={editTopic.q_total} onChange={e => setEditTopic({ ...editTopic, q_total: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="field-label">Anotações</label>
                <textarea rows={3} className="ds-textarea" value={editTopic.notes} onChange={e => setEditTopic({ ...editTopic, notes: e.target.value })} />
              </div>
            </div>
            <div className="ds-modal-footer">
              <button onClick={() => setEditTopic(null)} className="ds-btn ds-btn-secondary">Cancelar</button>
              <button onClick={async () => { await topicAction({ action: 'update', ...editTopic }); setEditTopic(null); }} className="ds-btn ds-btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CUSTOM TOPIC MODAL */}
      {showCustomModal && (
        <div className="ds-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowCustomModal(false); }}>
          <div className="ds-modal" style={{ maxWidth: 420 }} role="dialog" aria-modal="true" aria-label="Novo tópico">
            <div className="ds-modal-header">
              <h2 className="ds-modal-title">Novo Tópico Personalizado</h2>
              <button onClick={() => setShowCustomModal(false)} className="ds-icon-btn" aria-label="Fechar"><Icons.Close /></button>
            </div>
            <div className="ds-modal-body space-y">
              <div>
                <label className="field-label">Disciplina</label>
                <select className="ds-select" value={ncSubject} onChange={e => setNcSubject(e.target.value)}>
                  {SUBJECT_META.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Título do Conteúdo</label>
                <input className="ds-input" type="text" value={ncTitle} onChange={e => setNcTitle(e.target.value)} placeholder="Ex: Simulado Selecon Completo" />
              </div>
              <div>
                <label className="field-label">Abrangência</label>
                <select className="ds-select" value={ncOverlap} onChange={e => setNcOverlap(e.target.value)}>
                  <option value="ambos-identico">Comum aos 2 Cargos</option>
                  <option value="exclusivo-analista">Exclusivo Analista TI</option>
                  <option value="exclusivo-tecnico">Exclusivo Técnico</option>
                </select>
              </div>
              <label className="flex-row text-sm"><input type="checkbox" checked={ncStudy} onChange={e => setNcStudy(e.target.checked)} /> Adicionar ao plano de hoje</label>
            </div>
            <div className="ds-modal-footer">
              <button onClick={() => setShowCustomModal(false)} className="ds-btn ds-btn-secondary">Cancelar</button>
              <button
                onClick={async () => {
                  if (!ncTitle.trim()) return;
                  await topicAction({ action: 'create', subject: ncSubject, title: ncTitle.trim(), overlap: ncOverlap, setForToday: ncStudy });
                  setNcTitle('');
                  setShowCustomModal(false);
                }}
                className="ds-btn ds-btn-primary"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSTALL PWA MODAL */}
      {showInstallModal && (
        <div className="ds-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowInstallModal(false); }}>
          <div className="ds-modal" style={{ maxWidth: 460 }} role="dialog" aria-modal="true" aria-label="Instalar App no Celular">
            <div className="ds-modal-header">
              <div className="flex-row" style={{ gap: 10 }}>
                <span className="brand-icon"><Icons.Smartphone size={18} /></span>
                <div>
                  <h2 className="ds-modal-title">Instalar Estudos CMC no Celular</h2>
                  <div className="text-xs muted">Acesso rápido em tela cheia como aplicativo nativo</div>
                </div>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="ds-icon-btn" aria-label="Fechar"><Icons.Close /></button>
            </div>
            <div className="ds-modal-body space-y">
              <div className="ds-card ds-card-pad space-y-sm" style={{ background: 'var(--bg-subtle)' }}>
                <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                  <strong className="text-sm">Android (Google Chrome / Edge)</strong>
                  <span className="ds-badge ds-badge-green">Recomendado</span>
                </div>
                <ol className="text-xs muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                  <li>Toque no menu de <strong>3 pontos (⋮)</strong> no canto superior direito do navegador.</li>
                  <li>Selecione <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.</li>
                  <li>Confirme em <strong>Instalar</strong>. O ícone azul <strong>CMC 26</strong> aparecerá na sua gaveta de apps!</li>
                </ol>
              </div>

              <div className="ds-card ds-card-pad space-y-sm" style={{ background: 'var(--bg-subtle)' }}>
                <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                  <strong className="text-sm">iPhone &amp; iPad (Safari)</strong>
                  <span className="ds-badge ds-badge-blue">iOS</span>
                </div>
                <ol className="text-xs muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                  <li>Abra este link no <strong>Safari</strong> e toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima na barra inferior).</li>
                  <li>Role a lista e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.</li>
                  <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
                </ol>
              </div>
            </div>
            <div className="ds-modal-footer">
              <button onClick={() => setShowInstallModal(false)} className="ds-btn ds-btn-primary">Entendi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
