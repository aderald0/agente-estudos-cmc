'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EditalView } from '../components/EditalView';
import { FocusModal } from '../components/FocusModal';
import { Icons } from '../components/Icons';
import { MentorView } from '../components/MentorView';
import { NewStudyView } from '../components/NewStudyView';
import { NotebookView } from '../components/NotebookView';
import { PracticeView } from '../components/PracticeView';
import { TodayDashboard } from '../components/TodayDashboard';
import { EXAM_DATE, SUBJECT_META } from '../lib/syllabus';
import {
  ChatMsg,
  ErrorEntry,
  EssayEntry,
  Flashcard,
  NavTab,
  PracticeQuestion,
  StudyLog,
  StudyPlan,
  Topic,
} from '../lib/types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DEFAULT_PLAN_ID = 'cmc-2026';

export default function HomePage() {
  const [tab, setTab] = useState<NavTab>('hoje');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const [authChecked, setAuthChecked] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [authMode, setAuthMode] = useState<'setup' | 'login'>('setup');
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Multi-study plans state
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>(DEFAULT_PLAN_ID);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [showNewStudySetup, setShowNewStudySetup] = useState(false);

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

  const loadState = useCallback(async (overridePlanId?: string) => {
    const targetPlanId = overridePlanId || activePlanId || DEFAULT_PLAN_ID;
    setLoading(true);
    try {
      const res = await fetch(`/api/state?planId=${encodeURIComponent(targetPlanId)}`, {
        credentials: 'same-origin',
      });
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
      setPlans(data.plans || []);
      if (data.activePlan) {
        setActivePlan(data.activePlan);
        setActivePlanId(data.activePlan.id);
        localStorage.setItem('pierre_active_plan', data.activePlan.id);
      }
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
  }, [activePlanId]);

  const checkAuth = useCallback(async () => {
    try {
      const savedPlan = typeof window !== 'undefined' ? localStorage.getItem('pierre_active_plan') || DEFAULT_PLAN_ID : DEFAULT_PLAN_ID;
      const firstAccessSeen = typeof window !== 'undefined' ? localStorage.getItem('pierre_first_access_v1') === '1' : true;
      setActivePlanId(savedPlan);
      const res = await fetch('/api/auth', { credentials: 'same-origin' });
      const data = await res.json();
      const isSetup = Boolean(data.needsSetup);
      setNeedsSetup(isSetup);
      setAuthMode(isSetup ? 'setup' : 'login');
      setAuthenticated(Boolean(data.authenticated));
      setUsername(data.username || null);
      if (data.authenticated) {
        if (!firstAccessSeen) {
          setShowNewStudySetup(true);
        }
        await loadState(savedPlan);
      } else {
        setLoading(false);
      }
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
    const openOnboardingAfter = authMode === 'setup' || needsSetup;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: authMode, username: authUser, password: authPass }),
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
      await loadState(activePlanId);
      if (openOnboardingAfter || data.isFirstAccess || localStorage.getItem('pierre_first_access_v1') !== '1') {
        setShowNewStudySetup(true);
      }
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

  async function handleSwitchPlan(newPlanId: string) {
    if (newPlanId === '__new__') {
      setShowNewStudySetup(true);
      return;
    }
    setShowNewStudySetup(false);
    setActivePlanId(newPlanId);
    localStorage.setItem('pierre_active_plan', newPlanId);
    await loadState(newPlanId);
  }

  async function handleDeleteCurrentPlan() {
    if (!activePlan || activePlan.id === DEFAULT_PLAN_ID) return;
    if (!window.confirm(`Deseja remover o estudo "${activePlan.title}"?`)) return;
    await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'delete', plan_id: activePlan.id }),
    });
    setActivePlanId(DEFAULT_PLAN_ID);
    await loadState(DEFAULT_PLAN_ID);
  }

  async function topicAction(payload: Record<string, unknown>) {
    await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ ...payload, plan_id: activePlanId }),
    });
    await loadState(activePlanId);
  }

  async function practiceAction(payload: Record<string, unknown>) {
    await fetch('/api/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ ...payload, plan_id: activePlanId }),
    });
    await loadState(activePlanId);
  }

  async function sendMessage(
    overrideText?: string,
    fileObj?: { name: string; base64: string; mimeType: string }
  ) {
    const text = (overrideText ?? chatInput).trim();
    if ((!text && !fileObj) || chatBusy) return;
    if (!overrideText) setChatInput('');

    const userDisplay = fileObj
      ? `${text ? text + '\n' : ''}[Arquivo anexado: ${fileObj.name}]`
      : text;

    setChat(prev => [...prev, { id: Date.now(), role: 'user', content: userDisplay }]);
    setChatBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          plan_id: activePlanId,
          message: text,
          fileBase64: fileObj?.base64 || '',
          fileName: fileObj?.name || '',
          mimeType: fileObj?.mimeType || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChat(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `**Erro:** ${data.error || 'Falha na API'}` }]);
      } else {
        await loadState(activePlanId);
      }
    } catch (e) {
      setChat(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `**Erro de rede:** ${e instanceof Error ? e.message : 'Erro'}` }]);
    } finally {
      setChatBusy(false);
    }
  }

  const targetDateStr = activePlan?.target_date || EXAM_DATE;
  const daysLeft = useMemo(() => {
    if (!targetDateStr) return null;
    const ms = new Date(`${targetDateStr}T08:00:00`).getTime() - Date.now();
    if (Number.isNaN(ms)) return null;
    return Math.max(0, Math.ceil(ms / 86400000));
  }, [targetDateStr]);

  const overallPct = useMemo(() => {
    if (!topics.length) return 0;
    const done = topics.filter(t => t.status === 'revisar' || t.status === 'dominado').length;
    return Math.round((done / topics.length) * 100);
  }, [topics]);

  const syllabusTabLabel = activePlan?.syllabus_label || 'Edital';

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
    const isRegister = authMode === 'setup';
    return (
      <div className="auth-screen">
        <form onSubmit={handleAuthSubmit} className="auth-panel space-y">
          <div className="flex-row" style={{ justifyContent: 'space-between' }}>
            <div className="flex-row" style={{ gap: 10 }}>
              <span className="brand-icon"><Icons.Logo size={17} /></span>
              <div>
                <h1 style={{ fontSize: 17 }}>Pierre</h1>
                <div className="text-xs muted">Organização inteligente de estudos</div>
              </div>
            </div>
            <button type="button" onClick={toggleTheme} className="ds-icon-btn" aria-label="Alternar tema"><Icons.SunMoon /></button>
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {isRegister ? 'Crie sua conta' : 'Entrar na sua conta'}
            </h2>
            <p className="text-xs muted" style={{ margin: 0 }}>
              {isRegister
                ? 'Seus estudos, materiais e revisões em um só lugar.'
                : 'Entre com suas credenciais para acessar seus estudos.'}
            </p>
          </div>

          <div>
            <label htmlFor="auth-u" className="field-label">Usuário</label>
            <input id="auth-u" type="text" required autoComplete="username" className="ds-input" value={authUser} onChange={e => setAuthUser(e.target.value)} placeholder="ex: aderaldo" />
          </div>

          <div>
            <label htmlFor="auth-p" className="field-label">Senha {isRegister && '(mín. 8 caracteres)'}</label>
            <input id="auth-p" type="password" required minLength={isRegister ? 8 : 1} autoComplete={isRegister ? 'new-password' : 'current-password'} className="ds-input" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" />
          </div>

          {authError && <div className="inline-alert error">{authError}</div>}

          <button type="submit" disabled={authSubmitting} className="ds-btn ds-btn-primary" style={{ width: '100%', height: 42 }}>
            {authSubmitting ? 'Autenticando...' : (isRegister ? 'Continuar' : 'Entrar')}
          </button>

          <div
            className="flex-row"
            style={{
              justifyContent: 'space-between',
              paddingTop: 10,
              borderTop: '1px solid var(--c-border)',
              fontSize: 12,
            }}
          >
            <span className="muted">
              {isRegister ? 'Já tem estudo configurado?' : 'Quer configurar um novo estudo?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthError('');
                setAuthMode(isRegister ? 'login' : 'setup');
              }}
              style={{ fontWeight: 600, color: 'var(--c-text)' }}
            >
              {isRegister ? 'Entrar direto →' : 'Criar conta / 1º acesso →'}
            </button>
          </div>

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

  // STAGE 2: CONVERSATIONAL NEW STUDY SETUP (ONBOARDING OR "+ NOVO ESTUDO")
  if (showNewStudySetup) {
    return (
      <div className="pierre-shell">
        <main className="saas-content">
          <NewStudyView
            username={username}
            hasExistingPlans={plans.length > 0}
            onCancel={() => {
              localStorage.setItem('pierre_first_access_v1', '1');
              setShowNewStudySetup(false);
            }}
            onPlanCreated={async newPlanId => {
              localStorage.setItem('pierre_first_access_v1', '1');
              setShowNewStudySetup(false);
              setActivePlanId(newPlanId);
              localStorage.setItem('pierre_active_plan', newPlanId);
              setTab('hoje');
              await loadState(newPlanId);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="pierre-shell">
      {/* PIERRE FLOATING GLASS HEADER & STUDY SWITCHER */}
      <div className="pierre-topbar-wrap">
        <header className="pierre-topbar">
          <div className="brand-id">
            <div className="brand-icon"><Icons.Logo size={17} /></div>
            <div className="flex-row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              <select
                aria-label="Selecionar estudo ativo"
                value={activePlanId}
                onChange={e => handleSwitchPlan(e.target.value)}
                className="ds-select"
                style={{
                  height: 34,
                  padding: '0 26px 0 12px',
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: 13,
                  background: 'var(--c-surface-2)',
                  border: '1px solid var(--c-border)',
                  maxWidth: 220,
                }}
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
                <option value="__new__">+ Novo estudo...</option>
              </select>

              <button
                onClick={() => setShowNewStudySetup(true)}
                className="ds-btn ds-btn-secondary ds-btn-sm hide-mobile"
                title="Configurar novo estudo com PDF ou conversa"
              >
                <Icons.Plus size={13} /> <span>Novo estudo</span>
              </button>

              {activePlan && activePlan.id !== DEFAULT_PLAN_ID && (
                <button
                  onClick={handleDeleteCurrentPlan}
                  className="ds-icon-btn hide-mobile"
                  title="Remover este estudo"
                  aria-label="Remover estudo"
                >
                  <Icons.Trash size={14} />
                </button>
              )}
            </div>
          </div>

          <nav className="pierre-nav-dock" aria-label="Navegação principal">
            <button className={`pierre-nav-pill ${tab === 'hoje' ? 'active' : ''}`} onClick={() => setTab('hoje')}>
              <Icons.Home size={15} /> <span>Hoje</span>
            </button>
            <button className={`pierre-nav-pill ${tab === 'pratica' ? 'active' : ''}`} onClick={() => setTab('pratica')}>
              <Icons.Check size={15} /> <span>Prática</span>
            </button>
            <button className={`pierre-nav-pill ${tab === 'mentor' ? 'active' : ''}`} onClick={() => setTab('mentor')}>
              <Icons.Sparkles size={15} /> <span>Mentor</span>
            </button>
            <button className={`pierre-nav-pill ${tab === 'edital' ? 'active' : ''}`} onClick={() => setTab('edital')}>
              <Icons.BookOpen size={15} /> <span>{syllabusTabLabel}</span>
            </button>
            <button className={`pierre-nav-pill ${tab === 'caderno' ? 'active' : ''}`} onClick={() => setTab('caderno')}>
              <Icons.FileText size={15} /> <span>Caderno</span>
            </button>
          </nav>

          <div className="topbar-right">
            <span className="ds-badge ds-badge-neutral hide-mobile">
              {daysLeft !== null ? `${daysLeft}d · ` : ''}{overallPct}%
            </span>
            {!isInstalledPwa && (
              <button
                onClick={handleInstallClick}
                className="ds-btn ds-btn-secondary ds-btn-sm"
                title="Instalar aplicativo no celular ou computador"
              >
                <Icons.Smartphone size={14} /> <span className="hide-mobile">Instalar App</span>
              </button>
            )}
            <div className="user-pill hide-mobile">
              <span className="user-avatar">{(username || 'A')[0].toUpperCase()}</span>
              <span>{username || 'Candidato'}</span>
            </div>
            <button onClick={toggleTheme} className="ds-icon-btn" aria-label="Alternar tema"><Icons.SunMoon /></button>
            <button onClick={handleLogout} className="ds-icon-btn" aria-label="Sair" title="Sair"><Icons.Logout /></button>
          </div>
        </header>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {dbError && (
          <div className="inline-alert error" style={{ maxWidth: 1112, margin: '8px auto 0', width: 'calc(100% - 48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{dbError}</span>
            <button onClick={() => loadState(activePlanId)} className="ds-btn ds-btn-secondary ds-btn-sm">Recarregar</button>
          </div>
        )}

        <main className={`saas-content ${tab === 'mentor' ? 'is-mentor-tab' : ''}`}>
          {tab === 'hoje' && (
            <TodayDashboard
              activePlan={activePlan}
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
              activePlan={activePlan}
              questions={questions}
              flashcards={flashcards}
              onPracticeAction={practiceAction}
              onExplainWithMentor={async (promptText, autoError) => {
                setTab('mentor');
                if (autoError) {
                  await fetch('/api/errors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ ...autoError, plan_id: activePlanId }),
                  });
                }
                await sendMessage(promptText);
              }}
            />
          )}

          {tab === 'mentor' && (
            <MentorView
              activePlan={activePlan}
              chat={chat}
              topics={topics}
              chatInput={chatInput}
              chatBusy={chatBusy}
              onChangeInput={setChatInput}
              onSend={sendMessage}
              onClear={async () => {
                await fetch(`/api/chat?planId=${encodeURIComponent(activePlanId)}`, {
                  method: 'DELETE',
                  credentials: 'same-origin',
                });
                await loadState(activePlanId);
              }}
              onStartFocus={t => setFocusTopic(t)}
            />
          )}

          {tab === 'edital' && (
            <EditalView
              activePlan={activePlan}
              topics={topics}
              onStartFocus={t => setFocusTopic(t)}
              onEditTopic={t => setEditTopic({ ...t })}
              onCreateCustom={() => {
                if (topics[0]?.subject) setNcSubject(topics[0].subject);
                setShowCustomModal(true);
              }}
              onTopicAction={topicAction}
            />
          )}

          {tab === 'caderno' && (
            <NotebookView
              activePlan={activePlan}
              topics={topics}
              errors={errors}
              essays={essays}
              logs={logs}
              onAddError={async payload => {
                await fetch('/api/errors', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({ ...payload, plan_id: activePlanId }),
                });
                await loadState(activePlanId);
              }}
              onDeleteError={async id => {
                await fetch('/api/errors', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({ id }),
                });
                await loadState(activePlanId);
              }}
              onSaveEssay={async payload => {
                await fetch('/api/essays', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'same-origin',
                  body: JSON.stringify({ ...payload, plan_id: activePlanId }),
                });
                await loadState(activePlanId);
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
            <Icons.BookOpen size={19} /> <span>{syllabusTabLabel}</span>
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
            `Valide minha explicação sobre "${t.title}" (${t.subject}): "${notes || 'Sem anotações escritas — me faça 1 pergunta-chave para testar se compreendi.'}"`
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
                <label className="flex-row text-sm"><input type="checkbox" checked={editTopic.study_queue} onChange={e => setEditTopic({ ...editTopic, study_queue: e.target.checked })} /> No plano de hoje</label>
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
              <h2 className="ds-modal-title">Novo Tópico</h2>
              <button onClick={() => setShowCustomModal(false)} className="ds-icon-btn" aria-label="Fechar"><Icons.Close /></button>
            </div>
            <div className="ds-modal-body space-y">
              <div>
                <label className="field-label">Matéria / Unidade</label>
                <input
                  className="ds-input"
                  type="text"
                  value={ncSubject}
                  onChange={e => setNcSubject(e.target.value)}
                  placeholder="Ex: Unidade 1 / Direito Administrativo"
                />
              </div>
              <div>
                <label className="field-label">Título do Conteúdo</label>
                <input className="ds-input" type="text" value={ncTitle} onChange={e => setNcTitle(e.target.value)} placeholder="Ex: Lista de Exercícios 01" />
              </div>
              {(!activePlan || activePlan.id === DEFAULT_PLAN_ID) && (
                <div>
                  <label className="field-label">Abrangência</label>
                  <select className="ds-select" value={ncOverlap} onChange={e => setNcOverlap(e.target.value)}>
                    <option value="ambos-identico">Comum aos 2 Cargos</option>
                    <option value="exclusivo-analista">Exclusivo Analista TI</option>
                    <option value="exclusivo-tecnico">Exclusivo Técnico</option>
                  </select>
                </div>
              )}
              <label className="flex-row text-sm"><input type="checkbox" checked={ncStudy} onChange={e => setNcStudy(e.target.checked)} /> Adicionar ao plano de hoje</label>
            </div>
            <div className="ds-modal-footer">
              <button onClick={() => setShowCustomModal(false)} className="ds-btn ds-btn-secondary">Cancelar</button>
              <button
                onClick={async () => {
                  if (!ncTitle.trim()) return;
                  await topicAction({ action: 'create', subject: ncSubject.trim() || 'Geral', title: ncTitle.trim(), overlap: ncOverlap, setForToday: ncStudy });
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
              <div className="flex-row" style={{ gap: 12 }}>
                <img
                  src="/icon-192.png"
                  alt="Logo Pierre"
                  width={42}
                  height={42}
                  style={{ borderRadius: 11, flexShrink: 0, boxShadow: 'var(--sh-sm)' }}
                />
                <div>
                  <h2 className="ds-modal-title">Instalar Pierre no Celular</h2>
                  <div className="text-xs muted">Ícone oficial na tela inicial e abertura em tela cheia</div>
                </div>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="ds-icon-btn" aria-label="Fechar"><Icons.Close /></button>
            </div>
            <div className="ds-modal-body space-y">
              <div className="ds-card ds-card-pad space-y-sm" style={{ background: 'var(--c-bg)' }}>
                <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                  <strong className="text-sm">Android (Google Chrome / Edge)</strong>
                  <span className="ds-badge ds-badge-green">Recomendado</span>
                </div>
                <ol className="text-xs muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                  <li>Toque no menu de <strong>3 pontos (⋮)</strong> no canto superior direito do navegador.</li>
                  <li>Selecione <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.</li>
                  <li>Confirme em <strong>Instalar</strong>. A logo oficial aparecerá na sua tela inicial!</li>
                </ol>
              </div>

              <div className="ds-card ds-card-pad space-y-sm" style={{ background: 'var(--c-bg)' }}>
                <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                  <strong className="text-sm">iPhone &amp; iPad (Safari)</strong>
                  <span className="ds-badge ds-badge-indigo">iOS</span>
                </div>
                <ol className="text-xs muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                  <li>Abra este link no <strong>Safari</strong> e toque no botão <strong>Compartilhar</strong> (quadrado com seta para cima na barra inferior).</li>
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
