import React, { useState, useEffect, useRef } from 'react';
import { CinemaImage, CinemaCollection } from '../data/cinemaData';
import { useTask } from '../context/TaskContext';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Sparkles,
  Layers,
} from 'lucide-react';

interface FilmFrameSlideshowProps {
  images: CinemaImage[];
  collections: CinemaCollection[];
  activeCollectionId: string;
  setActiveCollectionId: (id: string) => void;
  onOpenManager: () => void;
}

export const FilmFrameSlideshow: React.FC<FilmFrameSlideshowProps> = ({
  images,
  collections,
  activeCollectionId,
  setActiveCollectionId,
  onOpenManager,
}) => {
  const { isMuted, toggleGlobalMute } = useTask();

  const activeCollectionImages = images.filter((img) => img.collectionId === activeCollectionId);
  const displayImages = activeCollectionImages.length > 0 ? activeCollectionImages : images;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Keep index within bounds if image list changes
  useEffect(() => {
    if (currentIndex >= displayImages.length) {
      setCurrentIndex(0);
    }
  }, [displayImages, currentIndex]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 7000); // 7-second slide interval

    return () => clearInterval(interval);
  }, [isPlaying, displayImages.length, currentIndex]);

  const changeSlide = (newIndex: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 250);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % displayImages.length;
    changeSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + displayImages.length) % displayImages.length;
    changeSlide(prevIdx);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentImg = displayImages[currentIndex] || displayImages[0];
  const activeCol = collections.find((c) => c.id === activeCollectionId);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#070B12] text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-900 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-4 justify-center' : ''
      }`}
    >
      {/* 35mm Top Film Perforation Strip */}
      <div className="bg-[#05080E] px-4 py-1.5 flex items-center justify-between border-b border-slate-900/80 text-[10px] font-mono text-slate-500 select-none">
        
        {/* Sprocket Holes */}
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((hole) => (
            <div
              key={hole}
              className="w-2.5 h-1.5 bg-[#0D1522] rounded-xs border border-slate-800/60"
            />
          ))}
        </div>

        {/* Film markings */}
        <div className="flex items-center gap-3 tracking-widest text-[#99BFF9]/80 font-bold uppercase">
          <span>KODAK 400</span>
          <span>SAFETY FILM</span>
          <span>▶ {currentIndex + 12}A</span>
        </div>

        {/* Sprocket Holes */}
        <div className="hidden sm:flex items-center gap-3">
          {[9, 10, 11, 12, 13, 14].map((hole) => (
            <div
              key={hole}
              className="w-2.5 h-1.5 bg-[#0D1522] rounded-xs border border-slate-800/60"
            />
          ))}
        </div>

      </div>

      {/* Main Film Image Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] bg-black overflow-hidden group">
        
        {currentImg ? (
          <img
            src={currentImg.url}
            alt={currentImg.title}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              isFading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-editorial italic text-sm">
            No images in this collection.
          </div>
        )}

        {/* Subtle Vignette & Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* Top Overlay Bar inside image: Collection Selector & Manage Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          
          {/* Collection Selector Pills */}
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  setActiveCollectionId(col.id);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  col.id === activeCollectionId
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {col.name}
              </button>
            ))}
          </div>

          {/* Manage Button */}
          <button
            onClick={onOpenManager}
            className="p-1.5 bg-black/60 backdrop-blur-md hover:bg-black/80 text-slate-200 border border-white/15 rounded-xl transition-colors cursor-pointer"
            title="Manage Slideshow Collections & Uploads"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

        </div>

        {/* Center Hover Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          title="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          title="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Lower Overlay: Optional Cinematic Quote or Caption */}
        <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none space-y-1.5">
          {currentImg?.quote && (
            <div className="space-y-1 max-w-xl">
              <p className="text-sm sm:text-base font-editorial italic text-slate-100 leading-snug drop-shadow-md">
                "{currentImg.quote}"
              </p>
              {currentImg.quoteSource && (
                <div className="text-[10px] tracking-widest font-mono font-bold text-[#99BFF9] uppercase drop-shadow-sm">
                  — {currentImg.quoteSource}
                </div>
              )}
            </div>
          )}

          {currentImg?.caption && !currentImg.quote && (
            <p className="text-xs text-slate-300 font-editorial italic drop-shadow-sm">
              {currentImg.caption}
            </p>
          )}
        </div>

      </div>

      {/* 35mm Bottom Perforation & Controls Strip */}
      <div className="bg-[#05080E] px-4 py-2 flex items-center justify-between border-t border-slate-900/80 text-xs text-slate-400 select-none">
        
        {/* Play/Pause & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <span className="font-mono text-[11px] text-slate-400 tabular-nums">
            {displayImages.length > 0 ? `${currentIndex + 1} / ${displayImages.length}` : '0 / 0'}
          </span>
        </div>

        {/* Center Frame Number */}
        <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-500 tracking-widest">
          <span>EXP {currentIndex + 1}</span>
          <span>·</span>
          <span>35mm SLIDE</span>
        </div>

        {/* Mute & Fullscreen Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleGlobalMute}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
