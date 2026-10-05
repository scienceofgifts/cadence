/**
 * Asset Storage Persistence Layer (IndexedDB)
 * 
 * Provides robust, persistent client-side storage for:
 * - User-uploaded custom backgrounds
 * - Slideshow images and film frame assets
 * - User-selected visual media
 * 
 * Stores actual Blobs/Files in IndexedDB to avoid localStorage size limits (5MB)
 * and guarantees persistence across page reloads, browser restarts, and new tabs.
 */

export interface StoredAsset {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  blob: Blob;
  type: 'custom_background' | 'slideshow_image' | 'user_asset';
  active?: boolean;
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'cadence_asset_db_v2';
const DB_VERSION = 1;
const ASSETS_STORE = 'assets';

// In-memory object URL cache to prevent memory leaks and redundant createObjectURL calls
const objectUrlCache = new Map<string, string>();

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Opens or initializes the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(ASSETS_STORE)) {
        const store = db.createObjectStore(ASSETS_STORE, { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('active', 'active', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

/**
 * Saves an asset (Blob, File, or Data URL) into IndexedDB
 */
export async function saveAsset(
  id: string,
  fileOrBlobOrDataUrl: Blob | File | string,
  type: StoredAsset['type'] = 'user_asset',
  name?: string,
  active: boolean = false
): Promise<StoredAsset> {
  try {
    const db = await openDB();
    let blob: Blob;
    let assetName = name;
    let mimeType = 'image/jpeg';

    if (typeof fileOrBlobOrDataUrl === 'string') {
      if (fileOrBlobOrDataUrl.startsWith('data:')) {
        blob = dataUrlToBlob(fileOrBlobOrDataUrl);
        mimeType = blob.type;
      } else {
        // Assume text or fetch
        blob = new Blob([fileOrBlobOrDataUrl], { type: 'text/plain' });
      }
    } else {
      blob = fileOrBlobOrDataUrl;
      mimeType = blob.type || 'image/jpeg';
      if (!assetName && fileOrBlobOrDataUrl instanceof File) {
        assetName = fileOrBlobOrDataUrl.name;
      }
    }

    if (!assetName) {
      assetName = `asset-${Date.now()}`;
    }

    const now = Date.now();

    const storedAsset: StoredAsset = {
      id,
      name: assetName,
      mimeType,
      size: blob.size,
      blob,
      type,
      active,
      createdAt: now,
      updatedAt: now,
    };

    // If this asset is being set as active, deactivate previous active assets of the same type
    if (active) {
      await deactivateAssetsOfType(db, type);
    }

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, 'readwrite');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.put(storedAsset);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Revoke previous cached URL if exists and create fresh URL
    if (objectUrlCache.has(id)) {
      try {
        URL.revokeObjectURL(objectUrlCache.get(id)!);
      } catch {}
    }
    const newUrl = URL.createObjectURL(blob);
    objectUrlCache.set(id, newUrl);

    return storedAsset;
  } catch (error) {
    console.error('Failed to save asset to IndexedDB:', error);
    throw error;
  }
}

/**
 * Helper to deactivate active assets of a given type
 */
async function deactivateAssetsOfType(db: IDBDatabase, type: StoredAsset['type']): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(ASSETS_STORE, 'readwrite');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.openCursor();

      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.value.type === type && cursor.value.active) {
            const updated = { ...cursor.value, active: false };
            cursor.update(updated);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Retrieves an asset record by ID
 */
export async function getAsset(id: string): Promise<StoredAsset | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, 'readonly');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn(`Could not retrieve asset with id ${id}:`, error);
    return null;
  }
}

/**
 * Retrieves the Blob for an asset by ID
 */
export async function getAssetBlob(id: string): Promise<Blob | null> {
  const asset = await getAsset(id);
  return asset ? asset.blob : null;
}

/**
 * Retrieves a live Object URL for an asset by ID (uses cache)
 */
export async function getAssetUrl(id: string): Promise<string | null> {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }
  const blob = await getAssetBlob(id);
  if (!blob) return null;

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(id, url);
  return url;
}

/**
 * Deletes an asset by ID from IndexedDB and cleans up object URLs
 */
export async function deleteAsset(id: string): Promise<void> {
  try {
    if (objectUrlCache.has(id)) {
      try {
        URL.revokeObjectURL(objectUrlCache.get(id)!);
      } catch {}
      objectUrlCache.delete(id);
    }
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, 'readwrite');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error(`Failed to delete asset ${id}:`, error);
  }
}

/**
 * Lists all stored assets, optionally filtered by type
 */
export async function listAssets(type?: StoredAsset['type']): Promise<StoredAsset[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, 'readonly');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        let results: StoredAsset[] = req.result || [];
        if (type) {
          results = results.filter((a) => a.type === type);
        }
        resolve(results.sort((a, b) => b.createdAt - a.createdAt));
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Failed to list assets from IndexedDB:', error);
    return [];
  }
}

/**
 * Sets an asset as active for its type
 */
export async function setActiveAsset(type: StoredAsset['type'], id: string): Promise<void> {
  try {
    const db = await openDB();
    await deactivateAssetsOfType(db, type);

    const asset = await getAsset(id);
    if (asset) {
      await saveAsset(id, asset.blob, type, asset.name, true);
    }
  } catch (error) {
    console.error(`Failed to set active asset ${id}:`, error);
  }
}

/**
 * Gets the active asset for a given type
 */
export async function getActiveAsset(type: StoredAsset['type']): Promise<StoredAsset | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(ASSETS_STORE, 'readonly');
      const store = tx.objectStore(ASSETS_STORE);
      const req = store.openCursor();

      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.value.type === type && cursor.value.active) {
            resolve(cursor.value);
            return;
          }
          cursor.continue();
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn(`Failed to get active asset of type ${type}:`, error);
    return null;
  }
}

/**
 * Gets a live Object URL for the active asset of a given type
 */
export async function getActiveAssetUrl(type: StoredAsset['type']): Promise<string | null> {
  const activeAsset = await getActiveAsset(type);
  if (!activeAsset) return null;
  return getAssetUrl(activeAsset.id);
}

/**
 * Clears active status for all assets of a given type
 */
export async function clearActiveAsset(type: StoredAsset['type']): Promise<void> {
  try {
    const db = await openDB();
    await deactivateAssetsOfType(db, type);
  } catch (error) {
    console.error(`Failed to clear active asset for ${type}:`, error);
  }
}

/* ========================================================
   CONVENIENCE HELPERS: CUSTOM BACKGROUNDS
   ======================================================== */

const CUSTOM_BG_ID_PREFIX = 'cadence-bg-custom';

/**
 * Saves a user-uploaded background image to IndexedDB and marks it active
 */
export async function saveCustomBackground(fileOrBlobOrDataUrl: Blob | File | string): Promise<{ id: string; url: string }> {
  const id = `${CUSTOM_BG_ID_PREFIX}-${Date.now()}`;
  const asset = await saveAsset(id, fileOrBlobOrDataUrl, 'custom_background', 'Custom Wallpaper', true);
  const url = await getAssetUrl(asset.id);
  return { id: asset.id, url: url || '' };
}

/**
 * Retrieves the currently active custom background URL on app startup
 */
export async function getActiveCustomBackgroundUrl(): Promise<string | null> {
  return getActiveAssetUrl('custom_background');
}

/**
 * Clears the active custom background in IndexedDB
 */
export async function clearCustomBackground(): Promise<void> {
  await clearActiveAsset('custom_background');
}
