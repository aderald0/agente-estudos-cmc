import { NextResponse } from 'next/server';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(1024, Math.max(48, Number(searchParams.get('size')) || 512));
  const rx = Math.round(size * 0.22);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${Math.round((rx / size) * 512)}" fill="#111110"/>
  <rect x="28" y="28" width="456" height="456" rx="${Math.round((rx / size) * 456)}" fill="#18181b" stroke="#27272a" stroke-width="6"/>
  <circle cx="408" cy="104" r="24" fill="#10b981"/>
  <g fill="none" stroke="#f5f4ef" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" transform="translate(104, 104) scale(12.666)">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
