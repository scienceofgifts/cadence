import React, { useState, useEffect } from 'react';
import { FilmFrameSlideshow } from './FilmFrameSlideshow';
import { WorkingMemory } from './WorkingMemory';
import { SlideshowManagerModal } from './SlideshowManagerModal';
import {
  INITIAL_COLLECTIONS,
  INITIAL_CINEMA_IMAGES,
  CinemaCollection,
  CinemaImage,
} from '../data/cinemaData';
import { getAssetUrl } from '../utils/assetStorage';

const LOCAL_STORAGE_COLLECTIONS_KEY = 'cadence_cinema_collections_v1';
const LOCAL_STORAGE_IMAGES_KEY = 'cadence_cinema_images_v1';

export const CinematicHero: React.FC = () => {
  const [collections, setCollections] = useState<CinemaCollection[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COLLECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COLLECTIONS;
  });

  const [images, setImages] = useState<CinemaImage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_IMAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CINEMA_IMAGES;
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>('col-films');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Restore & hydrate Object URLs from IndexedDB for any custom uploaded images
  useEffect(() => {
    let isMounted = true;
    async function hydrateCustomImages() {
      try {
        const hasCustom = images.some((img) => img.id.startsWith('img-user-'));
        if (!hasCustom) return;

        const updated = await Promise.all(
          images.map(async (img) => {
            if (img.id.startsWith('img-user-')) {
              const liveUrl = await getAssetUrl(img.id);
              if (liveUrl) {
                return { ...img, url: liveUrl };
              }
            }
            return img;
          })
        );

        if (isMounted) {
          setImages(updated);
        }
      } catch (err) {
        console.warn('Failed to hydrate custom slideshow images from IndexedDB:', err);
      }
    }

    hydrateCustomImages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (e) {}
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_IMAGES_KEY, JSON.stringify(images));
    } catch (e) {}
  }, [images]);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Working Memory Digital Scratchpad (5 cols on LG) */}
        <div className="lg:col-span-5 h-full">
          <WorkingMemory />
        </div>

        {/* Right Side: 35mm Film Frame Slideshow (7 cols on LG) */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center">
          <FilmFrameSlideshow
            images={images}
            collections={collections}
            activeCollectionId={activeCollectionId}
            setActiveCollectionId={setActiveCollectionId}
            onOpenManager={() => setIsManagerOpen(true)}
          />
        </div>

      </div>

      {/* Slideshow & Collection Manager Modal */}
      <SlideshowManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        collections={collections}
        images={images}
        activeCollectionId={activeCollectionId}
        setActiveCollectionId={setActiveCollectionId}
        onUpdateCollections={setCollections}
        onUpdateImages={setImages}
      />
    </div>
  );
};
