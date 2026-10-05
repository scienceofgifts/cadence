import React, { useState, useEffect } from 'react';
import { QUICK_LINKS } from '../data/quickLinks';
import { QuickLink } from '../types';
import {
  Globe,
  Eye,
  BookOpen,
  Wand2,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Folder,
  Home as House,
  ShoppingBag,
  Video,
  Image as ImageIcon,
  PenLine,
  Sparkles,
  Code,
  Github,
  Mail,
  Calendar,
  Settings,
  Monitor,
  Database,
  Search,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from 'lucide-react';

const LOCAL_STORAGE_QUICK_LINKS_KEY = 'cadence_my_quick_links_v2';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Globe,
  Eye,
  BookOpen,
  Wand2,
  ExternalLink,
  Link: LinkIcon,
  FileText,
  Folder,
  House,
  ShoppingBag,
  Video,
  Image: ImageIcon,
  PenLine,
  Sparkles,
  Code,
  Github,
  Mail,
  Calendar,
  Settings,
  Monitor,
  Database,
  Search,
};

const ICON_OPTIONS = [
  { name: 'Globe', label: 'Globe', Icon: Globe },
  { name: 'ExternalLink', label: 'External Link', Icon: ExternalLink },
  { name: 'Link', label: 'Chain Link', Icon: LinkIcon },
  { name: 'BookOpen', label: 'Book', Icon: BookOpen },
  { name: 'FileText', label: 'Document', Icon: FileText },
  { name: 'Folder', label: 'Folder', Icon: Folder },
  { name: 'House', label: 'Home', Icon: House },
  { name: 'ShoppingBag', label: 'Shop', Icon: ShoppingBag },
  { name: 'Video', label: 'Video', Icon: Video },
  { name: 'Image', label: 'Image', Icon: ImageIcon },
  { name: 'PenLine', label: 'Pen', Icon: PenLine },
  { name: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { name: 'Code', label: 'Code', Icon: Code },
  { name: 'Github', label: 'Github', Icon: Github },
  { name: 'Mail', label: 'Mail', Icon: Mail },
  { name: 'Calendar', label: 'Calendar', Icon: Calendar },
  { name: 'Settings', label: 'Settings', Icon: Settings },
  { name: 'Monitor', label: 'Monitor', Icon: Monitor },
  { name: 'Database', label: 'Database', Icon: Database },
  { name: 'Search', label: 'Search', Icon: Search },
];

export const QuickLinks: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_QUICK_LINKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load quick links', e);
    }
    return QUICK_LINKS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Globe');
  const [error, setError] = useState('');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_QUICK_LINKS_KEY, JSON.stringify(links));
    } catch (e) {
      console.error('Error saving quick links', e);
    }
  }, [links]);

  const openAddModal = () => {
    setEditingLinkId(null);
    setTitle('');
    setUrl('');
    setDescription('');
    setSelectedIcon('Globe');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (link: QuickLink, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLinkId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description || '');
    setSelectedIcon(link.iconName || 'Globe');
    setError('');
    setIsModalOpen(true);
  };

  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Remove this link from My Links?')) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
      if (editingLinkId === id) {
        setIsModalOpen(false);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a link title.');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a target URL.');
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('Please enter a valid web URL.');
      return;
    }

    if (editingLinkId) {
      setLinks((prev) =>
        prev.map((l) =>
          l.id === editingLinkId
            ? {
                ...l,
                title: title.trim(),
                url: formattedUrl,
                description: description.trim(),
                iconName: selectedIcon,
              }
            : l
        )
      );
    } else {
      const newLink: QuickLink = {
        id: `quick-link-${Date.now()}`,
        title: title.trim(),
        url: formattedUrl,
        description: description.trim() || 'Custom Shortcut',
        iconName: selectedIcon,
        isExternal: true,
        isCustom: true,
      };
      setLinks((prev) => [...prev, newLink]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-bg-secondary">
          My Links
        </h2>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#1B3D5F] dark:text-[#99BFF9] hover:bg-[#99BFF9]/15 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Grid of Link Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {links.map((link) => {
          const IconComponent = ICON_MAP[link.iconName] || Globe;

          return (
            <a
              key={link.id}
              href={link.url}
              target={link.isExternal ? '_blank' : '_self'}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="group relative flex items-center justify-between p-3 bg-white/80 dark:bg-[#142438]/80 hover:bg-white dark:hover:bg-[#142438] rounded-xl border border-[#1B3D5F]/10 dark:border-slate-800 hover:border-[#99BFF9] dark:hover:border-[#99BFF9] shadow-2xs hover:shadow-xs transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] dark:bg-slate-800 text-[#1B3D5F] dark:text-[#99BFF9] group-hover:bg-[#99BFF9]/20 flex items-center justify-center shrink-0 transition-colors">
                  <IconComponent className="w-4 h-4 stroke-[2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#1B3D5F] dark:text-slate-100 truncate group-hover:text-[#28537D] dark:group-hover:text-[#99BFF9] transition-colors">
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-editorial italic truncate">
                      {link.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Link Indicator */}
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {/* Subtle Hover Edit / Delete for user-created links */}
                {link.isCustom ? (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => openEditModal(link, e)}
                      className="p-1 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-[#99BFF9] hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                      title="Edit link"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteLink(link.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1B3D5F] dark:group-hover:text-slate-200 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          );
        })}

        {/* Inline Add Link Card Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 p-3 bg-white/40 dark:bg-[#142438]/40 hover:bg-white dark:hover:bg-[#142438] rounded-xl border border-dashed border-[#1B3D5F]/20 dark:border-slate-800 hover:border-[#99BFF9] text-slate-500 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-[#99BFF9] transition-all duration-200 cursor-pointer text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Add / Edit Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl p-6 space-y-4 z-10 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#1B3D5F] dark:text-slate-100 font-bold text-base">
                <Sparkles className="w-4 h-4 text-[#99BFF9]" />
                <span>{editingLinkId ? 'Edit My Link' : 'Add My Link'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Google Analytics"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://analytics.google.com/"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Subtitle / Description <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Website analytics"
                  className="w-full p-2.5 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
                />
              </div>

              {/* Icon Selector Grid */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Select Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-[#FAF9F6] dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {ICON_OPTIONS.map(({ name, label, Icon }) => {
                    const isSelected = selectedIcon === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedIcon(name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F] shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                        }`}
                        title={label}
                      >
                        <Icon className="w-4 h-4 stroke-[2]" />
                        <span className="text-[9px] font-medium mt-1 truncate max-w-full">
                          {name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingLinkId ? (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteLink(editingLinkId, e)}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] font-bold rounded-xl hover:opacity-90 shadow-xs cursor-pointer"
                  >
                    {editingLinkId ? 'Save Changes' : 'Add Link'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
