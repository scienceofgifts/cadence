import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useTask } from '../context/TaskContext';

export const ZenEmptyState: React.FC = () => {
  const { setIsQuickAddOpen } = useTask();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/60 dark:bg-[#142438]/60 rounded-2xl border border-dashed border-[#1B3D5F]/15 dark:border-slate-800 my-4">
      {/* Serene Graphic Motif */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#99BFF9]/20 to-[#C3F3DF]/30 flex items-center justify-center mb-4 shadow-xs">
        <svg className="w-8 h-8 text-[#1B3D5F] dark:text-slate-300 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="8" strokeOpacity="0.3" strokeDasharray="3 3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
        </svg>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 mb-1">
        Nothing pressing.
      </h3>
      <p className="text-sm font-editorial italic text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
        Enjoy the empty space, or plant a new seed.
      </p>

      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-90 shadow-xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add a task</span>
      </button>
    </div>
  );
};
