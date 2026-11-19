export interface Topic {
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

export interface StudyLog {
  id: number;
  date: string;
  topic_id: string;
  subject: string;
  title: string;
  minutes: number;
  kind: string;
}

export interface ErrorEntry {
  id: number;
  date: string;
  subject: string;
  topic: string;
  mistake: string;
  correction: string;
}

export interface EssayEntry {
  id: number;
  date: string;
  cargo: string;
  title: string;
  text: string;
  score_content: number;
  score_formal: number;
  feedback: string;
}

export interface ChatMsg {
  id: number;
  role: 'user' | 'assistant' | 'tool_trace';
  content: string;
}

export interface PracticeQuestion {
  id: string;
  subject: string;
  qnum: number;
  stem: string;
  options_json: string;
  answer: string;
  user_choice: string;
  is_correct: boolean | null;
}

export interface Flashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  tag: string;
  box: number;
  next_review_date: string;
}

export type NavTab = 'hoje' | 'pratica' | 'mentor' | 'edital' | 'caderno';

export function fmtBR(iso: string) {
  if (!iso) return '—';
  const parts = iso.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : iso;
}
