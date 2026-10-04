import React, { useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import { Search, X, CheckSquare, Layers, Clock, ArrowRight } from 'lucide-react';
import { formatNiceDate } from '../utils/date';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    tasks,
    projects,
    categories,
    openTaskDetail,
    openProjectDetail,
  } = useTask();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const matchingTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q) ||
          t.subtasks.some((st) => st.title.toLowerCase().includes(q))
      )
    : [];

  const matchingProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, notes, subtasks, projects... (e.g. gift guide, kettlebell, Atomic Habits)"
            className="w-full bg-transparent text-base font-semibold text-[#1B3D5F] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400 font-editorial italic">
              Type anything to search across all 5 areas.
            </div>
          ) : (
            <>
              {/* Tasks Results */}
              {matchingTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    Tasks ({matchingTasks.length})
                  </div>
                  {matchingTasks.map((t) => {
                    const cat = categories.find((c) => c.id === t.areaId);

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          openTaskDetail(t.id);
                        }}
                        className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-800 hover:bg-[#99BFF9]/15 border border-slate-200/80 dark:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckSquare className="w-4 h-4 text-[#99BFF9] shrink-0" />
                          <span className={`font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-[#1B3D5F] dark:text-slate-100'}`}>
                            {t.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
                          {cat && <span>{cat.shortName}</span>}
                          {t.dueDate && <span>· {formatNiceDate(t.dueDate)}</span>}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Projects Results */}
              {matchingProjects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    Projects ({matchingProjects.length})
                  </div>
                  {matchingProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        openProjectDetail(p.id);
                      }}
                      className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-800 hover:bg-[#99BFF9]/15 border border-slate-200/80 dark:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="w-4 h-4 text-[#28537D] shrink-0" />
                        <span className="font-bold text-[#1B3D5F] dark:text-slate-100 truncate font-display text-sm">
                          {p.name}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {matchingTasks.length === 0 && matchingProjects.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400 font-editorial italic">
                  No matching tasks or projects found.
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
