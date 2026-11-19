import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Estudos CMC 2026 — Analista TI & Técnico',
    short_name: 'Estudos CMC',
    description: 'Painel de estudos, 200 questões Selecon, flashcards e mentor IA para o Concurso da Câmara Municipal de Cuiabá 2026.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#090b10',
    theme_color: '#2563eb',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/api/icon?size=192',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/api/icon?size=512',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
