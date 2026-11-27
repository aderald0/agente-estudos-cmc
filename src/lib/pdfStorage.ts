export interface StoredApostilaMeta {
  apostilaId: string;
  fileName: string;
  size: number;
  updatedAt: number;
}

interface StoredApostilaRecord extends StoredApostilaMeta {
  buffer: ArrayBuffer;
}

const DB_NAME = 'cmc-apostilas-library-v1';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB indisponível neste navegador.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'apostilaId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Falha ao abrir banco local de PDFs.'));
  });
}

export async function saveApostilaPdf(apostilaId: string, file: File): Promise<StoredApostilaMeta> {
  const buffer = await file.arrayBuffer();
  const db = await openDb();
  const record: StoredApostilaRecord = {
    apostilaId,
    fileName: file.name,
    size: file.size,
    updatedAt: Date.now(),
    buffer,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve({
        apostilaId: record.apostilaId,
        fileName: record.fileName,
        size: record.size,
        updatedAt: record.updatedAt,
      });
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Erro ao salvar PDF localmente.'));
    };
  });
}

export async function getApostilaPdf(apostilaId: string): Promise<StoredApostilaRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(apostilaId);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as StoredApostilaRecord) || null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error || new Error('Erro ao carregar PDF local.'));
    };
  });
}

export async function listStoredApostilas(): Promise<Record<string, StoredApostilaMeta>> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => {
        db.close();
        const out: Record<string, StoredApostilaMeta> = {};
        const rows = (req.result || []) as StoredApostilaRecord[];
        for (const r of rows) {
          out[r.apostilaId] = {
            apostilaId: r.apostilaId,
            fileName: r.fileName,
            size: r.size,
            updatedAt: r.updatedAt,
          };
        }
        resolve(out);
      };
      req.onerror = () => {
        db.close();
        reject(req.error || new Error('Erro ao listar PDFs locais.'));
      };
    });
  } catch {
    return {};
  }
}

export async function deleteApostilaPdf(apostilaId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(apostilaId);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Erro ao remover PDF local.'));
    };
  });
}

const LAST_PAGE_KEY = 'cmc_last_read_pages_v1';

export function saveLastReadPage(apostilaId: string, pdfPage: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LAST_PAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[apostilaId] = pdfPage;
    localStorage.setItem(LAST_PAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota errors
  }
}

export function getLastReadPage(apostilaId: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_PAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, number>;
    return typeof map[apostilaId] === 'number' ? map[apostilaId] : null;
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
