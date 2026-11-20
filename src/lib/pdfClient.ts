export interface ParsedDocument {
  name: string;
  pageCount: number;
  extractedText: string;
  fallbackBase64?: string;
  mimeType: string;
}

export async function extractDocumentClient(file: File): Promise<ParsedDocument> {
  const mimeType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'text/plain');

  // Plain text / Markdown files
  if (!file.name.toLowerCase().endsWith('.pdf') && mimeType !== 'application/pdf') {
    const text = await file.text();
    return {
      name: file.name,
      pageCount: 1,
      extractedText: text.slice(0, 450000),
      mimeType,
    };
  }

  // PDF files: extract all pages client-side with pdfjs-dist (bypasses Vercel 4.5MB body limit on huge 80-200p Editais)
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const pageChunks: string[] = [];
    for (let p = 1; p <= totalPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      const strings = textContent.items
        .map(item => ('str' in item ? String(item.str) : ''))
        .filter(Boolean);
      const pageText = strings.join(' ').replace(/\s+/g, ' ').trim();
      if (pageText) {
        pageChunks.push(`[PÁGINA ${p}/${totalPages}]\n${pageText}`);
      }
    }

    const fullText = pageChunks.join('\n\n');

    // If PDF has selectable text (99% of official Editais & university syllabi)
    if (fullText.length >= 200) {
      return {
        name: file.name,
        pageCount: totalPages,
        extractedText: fullText.slice(0, 480000),
        mimeType: 'application/pdf',
      };
    }

    // Fallback for scanned image-only PDFs (< 3 MB)
    if (file.size <= 3 * 1024 * 1024) {
      const base64 = await fileToBase64(file);
      return {
        name: file.name,
        pageCount: totalPages,
        extractedText: '',
        fallbackBase64: base64,
        mimeType: 'application/pdf',
      };
    }

    throw new Error('Este PDF parece ser apenas imagem escaneada acima de 3 MB. Envie um PDF pesquisável (com texto selecionável).');
  } catch (err) {
    // Fallback if pdfjs fails on a small PDF
    if (file.size <= 3 * 1024 * 1024) {
      const base64 = await fileToBase64(file);
      return {
        name: file.name,
        pageCount: 0,
        extractedText: '',
        fallbackBase64: base64,
        mimeType: 'application/pdf',
      };
    }
    throw err instanceof Error ? err : new Error('Não foi possível ler este PDF.');
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      resolve(res.includes(',') ? res.split(',')[1] : res);
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}
