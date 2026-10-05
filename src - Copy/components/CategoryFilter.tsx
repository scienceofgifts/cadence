import React from 'react';
import { useTask } from '../context/TaskContext';
import { AreaId } from '../types';
import { ShoppingBag, Video, Home, BookOpen, Dumbbell, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Video,
  Home,
  BookOpen,
  Dumbbell,
};

export const CategoryFilter: React.FC = () => {
  const { categories, activeArea, setActiveArea, tasks } = useTask();

  const getAreaTaskCount = (areaId: AreaId | 'all') => {
    if (areaId === 'all') return tasks.length;
    return tasks.filter((t) => t.areaId === areaId).length;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
      <button
        onClick={() => setActiveArea('all')}
        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
          activeArea === 'all'
            ? 'bg-[#1B3D5F] text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
            : 'bg-white/80 dark:bg-[#142438] text-slate-600 dark:text-slate-300 hover:bg-white border border-[#1B3D5F]/10 dark:border-slate-800'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>All Areas</span>
        <span className="opacity-70 tabular-nums">({getAreaTaskCount('all')})</span>
      </button>

      {categories.map((cat) => {
        const IconComponent = ICON_MAP[cat.iconName] || Sparkles;
        const count = getAreaTaskCount(cat.id);
        const isActive = activeArea === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => setActiveArea(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-[#142438] text-[#1B3D5F] dark:text-slate-100 font-semibold shadow-xs ring-2 ring-[#99BFF9]'
                : 'bg-white/80 dark:bg-[#142438] text-slate-600 dark:text-slate-300 hover:bg-white border border-[#1B3D5F]/10 dark:border-slate-800'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.accentColor }}
            />
            <IconComponent className="w-3.5 h-3.5 opacity-80" />
            <span>{cat.shortName}</span>
            <span className="text-[11px] opacity-60 tabular-nums font-mono">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
