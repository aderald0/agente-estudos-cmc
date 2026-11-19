import { NextResponse } from 'next/server';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(1024, Math.max(48, Number(searchParams.get('size')) || 512));
  const rx = Math.round(size * 0.22);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${Math.round((rx / size) * 512)}" fill="#1e3a8a"/>
  <rect x="36" y="36" width="440" height="440" rx="${Math.round((rx / size) * 440)}" fill="#2563eb"/>
  <g fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" transform="translate(96, 96) scale(13.333)">
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
