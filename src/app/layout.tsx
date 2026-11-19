import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: '#111110',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'CMC 2026 · Plano de Estudos (Analista TI & Técnico)',
  description: 'Organizador de estudos para Câmara Municipal de Cuiabá 2026 com Material Design 3, Neon Postgres e Mentor Gemini.',
  applicationName: 'Estudos CMC 2026',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Estudos CMC',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/api/icon?size=192',
    apple: '/api/icon?size=192',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
