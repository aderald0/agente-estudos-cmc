'use client';

import React, { useEffect, useState } from 'react';
import { Topic } from '../lib/types';
import { Icons } from './Icons';

interface FocusModalProps {
  topic: Topic | null;
  onClose: () => void;
  onVerifyFeynman: (topic: Topic, notes: string) => void;
  onSave: (payload: {
    id: string;
    minutes: number;
    q_right: number;
    q_total: number;
    mastery: number;
    notes: string;
    complete: boolean;
  }) => Promise<void>;
}

export function FocusModal({ topic, onClose, onVerifyFeynman, onSave }: FocusModalProps) {
  const [preset, setPreset] = useState<15 | 25 | 50>(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [qRight, setQRight] = useState(0);
  const [qTotal, setQTotal] = useState(0);
  const [mastery, setMastery] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (topic) {
      setPreset(25);
      setSeconds(25 * 60);
      setRunning(false);
      setQRight(topic.q_right || 0);
      setQTotal(topic.q_total || 0);
      setMastery(topic.mastery || 3);
      setNotes(topic.notes || '');
    }
  }, [topic]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => (s <= 1 ? (setRunning(false), 0) : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!topic) return null;

  const totalSec = preset * 60;
  const pct = totalSec > 0 ? ((totalSec - seconds) / totalSec) * 100 : 0;
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  async function handleFinish(complete: boolean) {
    if (!topic) return;
    setSaving(true);
    setRunning(false);
    const elapsedMin = Math.max(1, Math.round((totalSec - seconds) / 60) || (complete ? preset : 0));
    await onSave({
      id: topic.id,
      minutes: elapsedMin,
      q_right: qRight,
      q_total: qTotal,
      mastery,
      notes,
      complete,
    });
    setSaving(false);
  }

  return (
    <div className="ds-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ds-modal focus-modal" role="dialog" aria-modal="true" aria-label="Modo Foco">
        <div className="ds-modal-header">
          <div>
            <div className="ds-badge ds-badge-indigo" style={{ marginBottom: 4 }}>{topic.subject}</div>
            <h2 className="ds-modal-title">{topic.title}</h2>
          </div>
          <button onClick={onClose} className="ds-icon-btn" aria-label="Fechar modo foco"><Icons.Close /></button>
        </div>

        <div className="ds-modal-body space-y">
          {/* Focus Pomodoro Ring */}
          <div className="focus-timer-box">
            <div className="pomodoro-ring-wrap">
              <svg width="124" height="124" viewBox="0 0 124 124">
                <circle className="ring-bg" cx="62" cy="62" r={radius} strokeWidth="7" fill="none" />
                <circle
                  className={`ring-fg ${running ? 'running' : ''}`}
                  cx="62"
                  cy="62"
                  r={radius}
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 62 62)"
                />
              </svg>
              <div className="ring-time" style={{ fontSize: 22 }}>
                {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
              </div>
            </div>

            <div className="focus-timer-meta">
              <div className="preset-group" style={{ marginBottom: 10 }}>
                {([15, 25, 50] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setRunning(false); setPreset(m); setSeconds(m * 60); }}
                    className={`preset-pill ${preset === m ? 'active' : ''}`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
              <button onClick={() => setRunning(r => !r)} className="ds-btn ds-btn-primary" style={{ width: '100%' }}>
                {running ? <><Icons.Pause size={14} /> Pausar Sessão</> : <><Icons.Play size={14} /> Iniciar Foco</>}
              </button>
            </div>
          </div>

          {/* Session Progress & Notes */}
          <div className="grid-3">
            <div>
              <label className="field-label">Domínio (1–5)</label>
              <select className="ds-select" value={mastery} onChange={e => setMastery(Number(e.target.value))}>
                <option value={1}>1 — Inicial</option>
                <option value={2}>2 — Básico</option>
                <option value={3}>3 — Médio</option>
                <option value={4}>4 — Bom</option>
                <option value={5}>5 — Dominado</option>
              </select>
            </div>
            <div>
              <label className="field-label">Questões Certas</label>
              <input type="number" min={0} className="ds-input" value={qRight} onChange={e => setQRight(Number(e.target.value))} />
            </div>
            <div>
              <label className="field-label">Total Feitas</label>
              <input type="number" min={0} className="ds-input" value={qTotal} onChange={e => setQTotal(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <label className="field-label" style={{ margin: 0 }}>Resumo Feynman / Anotações da Sessão</label>
              <button
                type="button"
                onClick={() => onVerifyFeynman(topic, notes)}
                className="ds-btn ds-btn-ghost ds-btn-sm"
                style={{ color: 'var(--c-primary)' }}
              >
                <Icons.Sparkles size={13} /> Validar meu resumo com Mentor
              </button>
            </div>
            <textarea
              className="ds-textarea"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Explique com suas palavras o que aprendeu neste capítulo (Técnica Feynman)..."
            />
          </div>
        </div>

        <div className="ds-modal-footer">
          <button disabled={saving} onClick={() => handleFinish(false)} className="ds-btn ds-btn-secondary">
            Salvar Progresso
          </button>
          <button disabled={saving} onClick={() => handleFinish(true)} className="ds-btn ds-btn-primary">
            <Icons.Check size={14} /> Concluir &amp; Agendar Revisão
          </button>
        </div>
      </div>
    </div>
  );
}
