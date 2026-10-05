import React, { useState } from 'react';
import { CinemaImage, CinemaCollection } from '../data/cinemaData';
import { saveAsset, deleteAsset, getAssetUrl } from '../utils/assetStorage';
import {
  X,
  Plus,
  Trash2,
  Upload,
  FolderPlus,
  Image as ImageIcon,
  Edit2,
  Check,
  Sparkles,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface SlideshowManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: CinemaCollection[];
  images: CinemaImage[];
  activeCollectionId: string;
  setActiveCollectionId: (id: string) => void;
  onUpdateCollections: (cols: CinemaCollection[]) => void;
  onUpdateImages: (imgs: CinemaImage[]) => void;
}

export const SlideshowManagerModal: React.FC<SlideshowManagerModalProps> = ({
  isOpen,
  onClose,
  collections,
  images,
  activeCollectionId,
  setActiveCollectionId,
  onUpdateCollections,
  onUpdateImages,
}) => {
  const [newColName, setNewColName] = useState('');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // Edit fields for an image
  const [editTitle, setEditTitle] = useState('');
  const [editQuote, setEditQuote] = useState('');
  const [editQuoteSource, setEditQuoteSource] = useState('');
  const [editCaption, setEditCaption] = useState('');

  if (!isOpen) return null;

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol: CinemaCollection = {
      id: `col-${Date.now()}`,
      name: newColName.trim().toUpperCase(),
      description: 'Personal image collection',
    };

    onUpdateCollections([...collections, newCol]);
    setNewColName('');
    setActiveCollectionId(newCol.id);
  };

  const handleDeleteCollection = (id: string) => {
    if (collections.length <= 1) {
      alert("At least one collection must remain.");
      return;
    }
    if (window.confirm("Delete this collection and its images?")) {
      onUpdateCollections(collections.filter((c) => c.id !== id));
      onUpdateImages(images.filter((img) => img.collectionId !== id));
      if (activeCollectionId === id) {
        const remaining = collections.filter((c) => c.id !== id);
        setActiveCollectionId(remaining[0].id);
      }
    }
  };

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: CinemaImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `img-user-${Date.now()}-${i}`;
      const title = file.name.replace(/\.[^/.]+$/, "");

      // Save actual file/blob to IndexedDB
      await saveAsset(id, file, 'slideshow_image', title);
      const url = await getAssetUrl(id);

      newImages.push({
        id,
        title,
        url: url || '',
        collectionId: activeCollectionId,
      });
    }

    onUpdateImages([...images, ...newImages]);
  };

  const handleDeleteImage = async (id: string) => {
    await deleteAsset(id);
    onUpdateImages(images.filter((img) => img.id !== id));
  };

  const startEditImage = (img: CinemaImage) => {
    setEditingImageId(img.id);
    setEditTitle(img.title);
    setEditQuote(img.quote || '');
    setEditQuoteSource(img.quoteSource || '');
    setEditCaption(img.caption || '');
  };

  const saveEditImage = (id: string) => {
    onUpdateImages(
      images.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            title: editTitle,
            quote: editQuote || undefined,
            quoteSource: editQuoteSource || undefined,
            caption: editCaption || undefined,
          };
        }
        return img;
      })
    );
    setEditingImageId(null);
  };

  const activeCollection = collections.find((c) => c.id === activeCollectionId);
  const activeImages = images.filter((img) => img.collectionId === activeCollectionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B12]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#0E1726] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-6 z-10 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 font-bold font-display text-base sm:text-lg text-slate-100">
            <Sparkles className="w-4 h-4 text-[#99BFF9]" />
            <span>Cinematic Slideshow & Collection Manager</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs">
          
          {/* Collections Selector & Create New */}
          <div className="space-y-3 p-4 bg-[#070D18] rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">Collections</label>
              <form onSubmit={handleCreateCollection} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New collection name..."
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="px-2.5 py-1 bg-[#121E2E] border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newColName.trim()}
                  className="px-3 py-1 bg-[#99BFF9] text-[#1B3D5F] font-bold rounded-lg disabled:opacity-40 cursor-pointer"
                >
                  + Add
                </button>
              </form>
            </div>

            {/* Collection Tabs */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    col.id === activeCollectionId
                      ? 'bg-[#1B3D5F] text-white border-[#99BFF9]'
                      : 'bg-[#121E2E] text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => setActiveCollectionId(col.id)}
                >
                  <span className="font-bold tracking-wider">{col.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(col.id);
                    }}
                    className="p-0.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Images & Current Collection Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[#99BFF9]">
                {activeCollection?.name} ({activeImages.length} images)
              </div>

              {/* Multiple Upload */}
              <label className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl cursor-pointer hover:opacity-90 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>Upload Local Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeImages.map((img) => (
                <div
                  key={img.id}
                  className="p-3 bg-[#070D18] rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                      <img
                        src={img.url}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {editingImageId === img.id ? (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title..."
                          className="w-full p-1.5 bg-[#121E2E] border border-slate-700 rounded text-slate-100 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editQuote}
                          onChange={(e) => setEditQuote(e.target.value)}
                          placeholder="Overlaid Quote (optional)..."
                          className="w-full p-1.5 bg-[#121E2E] border border-slate-700 rounded text-slate-100 focus:outline-none font-editorial italic"
                        />
                        <input
                          type="text"
                          value={editQuoteSource}
                          onChange={(e) => setEditQuoteSource(e.target.value)}
                          placeholder="Quote Source (e.g. INTERSTELLAR)..."
                          className="w-full p-1.5 bg-[#121E2E] border border-slate-700 rounded text-slate-100 focus:outline-none uppercase font-mono"
                        />
                        <input
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          placeholder="Caption (optional)..."
                          className="w-full p-1.5 bg-[#121E2E] border border-slate-700 rounded text-slate-100 focus:outline-none font-editorial italic"
                        />
                        <button
                          onClick={() => saveEditImage(img.id)}
                          className="w-full py-1 bg-[#99BFF9] text-[#1B3D5F] font-bold rounded cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-200 truncate">{img.title}</div>
                        {img.quote && (
                          <div className="text-[11px] font-editorial italic text-slate-400 line-clamp-2">
                            "{img.quote}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingImageId !== img.id && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <button
                        onClick={() => startEditImage(img)}
                        className="flex items-center gap-1 text-slate-400 hover:text-[#99BFF9] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Quote/Caption</span>
                      </button>

                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B3D5F] text-white font-bold rounded-xl cursor-pointer hover:opacity-90"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
