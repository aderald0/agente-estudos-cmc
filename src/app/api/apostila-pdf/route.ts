import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getApostilaById } from '../../../lib/apostilasCatalog';

export const dynamic = 'force-dynamic';

const MAX_PROXY_BYTES = 4_200_000; // Safe margin under Vercel's 4.5MB serverless response limit

export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const apostilaId = searchParams.get('id')?.trim() || '';
  const cargo = searchParams.get('cargo') === 'tecnico' ? 'tecnico' : 'analista';

  const ap = getApostilaById(apostilaId);
  if (!ap) {
    return NextResponse.json({ error: 'Apostila não encontrada' }, { status: 404 });
  }

  const fileId = cargo === 'tecnico'
    ? ap.driveFileIdTec || ap.driveFileIdAnl
    : ap.driveFileIdAnl || ap.driveFileIdTec;

  if (!fileId) {
    return NextResponse.json({ error: 'Arquivo do Drive não configurado' }, { status: 404 });
  }

  const downloadUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const upstream = await fetch(downloadUrl, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    clearTimeout(timeoutId);

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
    const contentLength = Number(upstream.headers.get('content-length') || '0');

    // Fast-fail if Google Drive returned login/HTML page without reading body
    if (!upstream.ok || contentType.includes('text/html')) {
      try {
        await upstream.body?.cancel();
      } catch {
        // ignore
      }
      return NextResponse.json(
        {
          error: 'drive_private',
          message: 'Arquivo privado no Google Drive.',
        },
        { status: 403 }
      );
    }

    // Fast-fail if file exceeds Vercel serverless response limit
    if (contentLength > MAX_PROXY_BYTES) {
      try {
        await upstream.body?.cancel();
      } catch {
        // ignore
      }
      return NextResponse.json(
        {
          error: 'too_large',
          message: 'PDF acima de 4 MB: use o botão Vincular PDF para abrir offline na página exata.',
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_PROXY_BYTES) {
      return NextResponse.json(
        { error: 'too_large', message: 'PDF acima de 4 MB.' },
        { status: 413 }
      );
    }

    const header = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf =
      header[0] === 0x25 && // %
      header[1] === 0x50 && // P
      header[2] === 0x44 && // D
      header[3] === 0x46;   // F

    if (!isPdf) {
      return NextResponse.json(
        { error: 'drive_private', message: 'O Google Drive exigiu login para baixar este arquivo.' },
        { status: 403 }
      );
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'private, max-age=86400',
        'Content-Disposition': `inline; filename="${ap.slug}.pdf"`,
      },
    });
  } catch {
    clearTimeout(timeoutId);
    return NextResponse.json(
      { error: 'drive_timeout', message: 'Tempo esgotado ao consultar Google Drive.' },
      { status: 504 }
    );
  }
}
