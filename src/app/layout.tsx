import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agente de Estudos CMC 2026 — Analista TI & Técnico Legislativo',
  description: 'Agente Mentor com Gemini API + PostgreSQL Neon na Vercel para o Concurso da Câmara Municipal de Cuiabá 2026.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
