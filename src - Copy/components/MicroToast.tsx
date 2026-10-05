import React from 'react';
import { useTask } from '../context/TaskContext';
import { Check } from 'lucide-react';

export const MicroToastContainer: React.FC = () => {
  const { toasts } = useTask();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1B3D5F] text-white dark:bg-slate-800 dark:text-slate-100 px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#C3F3DF] text-[#1B3D5F] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold tracking-tight">
              {toast.text}
            </p>
            {toast.subtext && (
              <p className="text-[11px] font-editorial italic text-slate-300 truncate">
                {toast.subtext}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
