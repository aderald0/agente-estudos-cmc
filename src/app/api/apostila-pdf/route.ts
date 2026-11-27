import { NextResponse } from 'next/server';
import { getCurrentSession } from '../../../lib/auth';
import { getApostilaById } from '../../../lib/apostilasCatalog';

export const dynamic = 'force-dynamic';

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

  try {
    const upstream = await fetch(downloadUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (!upstream.ok || contentType.includes('text/html')) {
      return NextResponse.json(
        {
          error: 'drive_private',
          message: 'Arquivo privado no Google Drive. Compartilhe como "Qualquer pessoa com o link" ou vincule o PDF local.',
        },
        { status: 403 }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const header = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf =
      header[0] === 0x25 && // %
      header[1] === 0x50 && // P
      header[2] === 0x44 && // D
      header[3] === 0x46;   // F

    if (!isPdf) {
      return NextResponse.json(
        {
          error: 'drive_private',
          message: 'O Google Drive exigiu login para baixar este arquivo.',
        },
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
    return NextResponse.json(
      { error: 'drive_fetch_failed', message: 'Falha ao consultar Google Drive.' },
      { status: 502 }
    );
  }
}
