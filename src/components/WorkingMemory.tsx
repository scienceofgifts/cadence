import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cadence_working_memory_v1';

const INITIAL_TEXT = `Need to finish the Civil War intro.
Check the WWII tank poster tomorrow.
Maybe make the next video about...
Remember to research the Lincoln quote.
The product images still need updating.`;

export const WorkingMemory: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved !== null) return saved;
    } catch (e) {}
    return INITIAL_TEXT;
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
    } catch (e) {}
  }, [content]);

  return (
    <>
      {/* Normal Dashboard Scratchpad View */}
      <div className="flex flex-col h-full bg-white/70 dark:bg-[#142438]/70 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 p-4 sm:p-5 shadow-2xs transition-colors group">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#1B3D5F]/5 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#99BFF9]" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
              Working Memory
            </h2>
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200 hover:bg-[#1B3D5F]/5 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Expand to large writing window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scratchpad Text Area */}
        <div className="flex-1 flex flex-col min-h-[280px] sm:min-h-[320px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your thoughts, scratch notes, or ideas..."
            className="w-full flex-1 bg-transparent text-sm sm:text-base font-editorial text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
          />
        </div>

      </div>

      {/* Expanded Modal Window Mode */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />

          <div className="relative w-full max-w-3xl h-[82vh] bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl p-6 flex flex-col space-y-4 z-10">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1B3D5F]/10 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#99BFF9]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100 font-sans">
                  Working Memory
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-100 hover:bg-[#1B3D5F]/5 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Restore window"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Text Area */}
            <div className="flex-1 flex flex-col">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your thoughts, scratch notes, or ideas..."
                autoFocus
                className="w-full flex-1 bg-transparent text-base sm:text-lg font-editorial text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed resize-none focus:outline-none p-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
              />
            </div>

            {/* Modal Footer helper */}
            <div className="pt-2 border-t border-[#1B3D5F]/5 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{content.length} characters</span>
              <span>Saved automatically</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
