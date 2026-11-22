import { CmsSnapshot } from './types';
import { DEFAULT_CMS_SNAPSHOT } from './defaultContent';

const DB_NAME = 'atlas_holland_cms_db_v1';
const DB_VERSION = 1;
const STORE_NAME = 'cms_store';
const SNAPSHOT_KEY = 'cms_snapshot';

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB niet beschikbaar in deze omgeving.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadLocalSnapshot(): Promise<CmsSnapshot> {
  if (typeof window === 'undefined') {
    return DEFAULT_CMS_SNAPSHOT;
  }

  try {
    const db = await openIdb();
    return await new Promise<CmsSnapshot>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(SNAPSHOT_KEY);

      getReq.onsuccess = () => {
        if (getReq.result) {
          // Merge with defaults so newly added keys (including English content) are always present
          const saved = getReq.result as Partial<CmsSnapshot>;
          const defaultEnProjects = DEFAULT_CMS_SNAPSHOT.projectsEn || [];
          const defaultEnServices = DEFAULT_CMS_SNAPSHOT.servicesEn || [];
          const defaultEnVacancies = DEFAULT_CMS_SNAPSHOT.vacanciesEn || [];

          const nlProjects = (saved.projects || DEFAULT_CMS_SNAPSHOT.projects).map((p) => {
            const enMatch =
              (saved.projectsEn || defaultEnProjects).find((e) => e.id === p.id) ||
              defaultEnProjects.find((e) => e.id === p.id);
            return {
              ...p,
              slugEn: p.slugEn || enMatch?.slugEn || enMatch?.slug || p.slug,
              statusEn: p.statusEn || enMatch?.status || p.status,
            };
          });

          const nlServices = (saved.services || DEFAULT_CMS_SNAPSHOT.services).map((s) => {
            const enMatch =
              (saved.servicesEn || defaultEnServices).find((e) => e.id === s.id) ||
              defaultEnServices.find((e) => e.id === s.id);
            return {
              ...s,
              slugEn: s.slugEn || enMatch?.slugEn || enMatch?.slug || s.slug,
              statusEn: s.statusEn || enMatch?.status || s.status,
            };
          });

          const nlVacancies = (saved.vacancies || DEFAULT_CMS_SNAPSHOT.vacancies).map((v) => {
            const enMatch =
              (saved.vacanciesEn || defaultEnVacancies).find((e) => e.id === v.id) ||
              defaultEnVacancies.find((e) => e.id === v.id);
            return {
              ...v,
              slugEn: v.slugEn || enMatch?.slugEn || enMatch?.slug || v.slug,
              statusEn: v.statusEn || enMatch?.status || v.status,
            };
          });

          resolve({
            settings: { ...DEFAULT_CMS_SNAPSHOT.settings, ...(saved.settings || {}) },
            pages: {
              ...DEFAULT_CMS_SNAPSHOT.pages,
              ...(saved.pages || {}),
              home: {
                ...DEFAULT_CMS_SNAPSHOT.pages.home,
                ...(saved.pages?.home || {}),
              },
            },
            projects: nlProjects,
            services: nlServices,
            vacancies: nlVacancies,
            settingsEn: {
              ...(DEFAULT_CMS_SNAPSHOT.settingsEn || DEFAULT_CMS_SNAPSHOT.settings),
              ...(saved.settingsEn || {}),
            },
            pagesEn: {
              ...(DEFAULT_CMS_SNAPSHOT.pagesEn || DEFAULT_CMS_SNAPSHOT.pages),
              ...(saved.pagesEn || {}),
              home: {
                ...(DEFAULT_CMS_SNAPSHOT.pagesEn?.home || DEFAULT_CMS_SNAPSHOT.pages.home),
                ...(saved.pagesEn?.home || {}),
              },
            },
            projectsEn: saved.projectsEn || defaultEnProjects,
            servicesEn: saved.servicesEn || defaultEnServices,
            vacanciesEn: saved.vacanciesEn || defaultEnVacancies,
            media: saved.media || DEFAULT_CMS_SNAPSHOT.media,
            submissions: saved.submissions || DEFAULT_CMS_SNAPSHOT.submissions,
          });
        } else {
          resolve(DEFAULT_CMS_SNAPSHOT);
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch {
    return DEFAULT_CMS_SNAPSHOT;
  }
}

export async function saveLocalSnapshot(snapshot: CmsSnapshot): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const db = await openIdb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put(snapshot, SNAPSHOT_KEY);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.error('[Atlas CMS IndexedDB] Opslaan mislukt:', err);
  }
}

export async function clearLocalSnapshot(): Promise<CmsSnapshot> {
  await saveLocalSnapshot(DEFAULT_CMS_SNAPSHOT);
  return DEFAULT_CMS_SNAPSHOT;
}

/**
 * Compress and convert an uploaded image File into a data URL (or Blob)
 * If file > 1.5MB and compress=true, downscales cleanly to max 1920px width.
 */
export async function processImageFileToDataUrl(
  file: File,
  compressLarge = true
): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Bestand lezen mislukt.'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (file.type === 'image/svg+xml') {
        resolve({
          dataUrl: rawDataUrl,
          width: 800,
          height: 600,
          sizeBytes: file.size,
        });
        return;
      }

      const img = new window.Image();
      img.onerror = () =>
        resolve({
          dataUrl: rawDataUrl,
          width: 1200,
          height: 800,
          sizeBytes: file.size,
        });
      img.onload = () => {
        const shouldCompress = compressLarge && file.size > 1.5 * 1024 * 1024;
        if (!shouldCompress && img.width <= 2200) {
          resolve({
            dataUrl: rawDataUrl,
            width: img.width,
            height: img.height,
            sizeBytes: file.size,
          });
          return;
        }

        const maxDim = 1920;
        let targetW = img.width;
        let targetH = img.height;
        if (targetW > maxDim) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            width: img.width,
            height: img.height,
            sizeBytes: file.size,
          });
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.86);
        const approxBytes = Math.round((compressedUrl.length * 3) / 4);
        resolve({
          dataUrl: compressedUrl,
          width: targetW,
          height: targetH,
          sizeBytes: approxBytes,
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
