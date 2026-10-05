/**
 * IndexedDB persistence bridge for images and media assets.
 * Backed by assetStorage.ts to ensure unified, robust binary storage.
 */

import { saveAsset, getAssetBlob, deleteAsset, getAssetUrl } from './assetStorage';

export async function saveImageBlob(id: string, dataUrlOrBlob: string | Blob): Promise<void> {
  await saveAsset(id, dataUrlOrBlob, 'slideshow_image');
}

export async function getImageBlob(id: string): Promise<string | null> {
  const url = await getAssetUrl(id);
  return url;
}

export async function deleteImageBlob(id: string): Promise<void> {
  await deleteAsset(id);
}
