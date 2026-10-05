import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Play, Check, ArrowRight, Workflow, CheckCircle2, Sparkles, X } from 'lucide-react';

export const WhatsNextWidget: React.FC = () => {
  const {
    getWhatsNextState,
    startWorkflowFocus,
    completeWorkflowStep,
    setActiveView,
    resetWorkflowProgress,
  } = useTask();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const whatsNext = getWhatsNextState();

  // If no workflow is active, show a quiet card offering to create one
  if (!whatsNext) {
    return (
      <div className="mb-8 bg-white/70 dark:bg-[#142438]/70 rounded-2xl p-5 border border-[#1B3D5F]/10 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center font-bold">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3D5F] dark:text-slate-100">
              Guided Workflow System
            </h4>
            <p className="text-xs font-editorial italic text-slate-500">
              No active workflow. Define a repeatable process once and let Cadence guide your daily steps.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveView('workflows')}
          className="px-3.5 py-1.5 text-xs font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-90 cursor-pointer whitespace-nowrap"
        >
          Open Workflows
        </button>
      </div>
    );
  }

  // If all steps in the workflow are complete
  if (whatsNext.isComplete) {
    return (
      <div className="mb-8 bg-gradient-to-br from-[#C3F3DF]/20 via-white to-[#FAF9F6] dark:from-[#142438] dark:to-[#0C1724] rounded-2xl p-6 sm:p-7 border border-[#88C1A8]/40 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#88C1A8]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9]">
              WORKFLOW COMPLETE · {whatsNext.projectName}
            </span>
          </div>
          <button
            onClick={() => setActiveView('workflows')}
            className="text-xs font-semibold text-[#1B3D5F] dark:text-[#99BFF9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1B3D5F] dark:text-slate-100">
              All Products & Guide Published
            </h3>
            <p className="text-xs font-editorial italic text-slate-600 dark:text-slate-300">
              Every repeated product step and linear publishing stage was completed cleanly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetWorkflowProgress(whatsNext.workflowId)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B3D5F] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
            >
              Reset for QA Test
            </button>
            <button
              onClick={() => setActiveView('workflows')}
              className="px-4 py-2 bg-[#1B3D5F] text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold rounded-xl cursor-pointer"
            >
              Start Another Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { currentStep } = whatsNext;

  return (
    <div className="mb-8 bg-gradient-to-br from-white via-white to-[#FAF9F6] dark:from-[#142438] dark:to-[#0C1724] rounded-2xl p-6 sm:p-7 border border-[#1B3D5F]/15 dark:border-slate-800 shadow-sm transition-all relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#99BFF9] via-[#C3F3DF] to-[#99BFF9]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#99BFF9] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B3D5F] dark:text-[#99BFF9] font-sans">
            WHAT'S NEXT
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-slate-200 font-bold uppercase tracking-wider">
            Guided Workflow
          </span>
          {whatsNext.totalStepsCount !== undefined && whatsNext.completedStepsCount !== undefined && (
            <span className="text-[11px] font-mono text-slate-400 pl-1">
              Step {whatsNext.completedStepsCount + 1} of {whatsNext.totalStepsCount} ({Math.round((whatsNext.completedStepsCount / whatsNext.totalStepsCount) * 100)}%)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('workflows')}
            className="text-xs font-semibold text-[#1B3D5F] dark:text-[#99BFF9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
            title="Dismiss widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 5-Question Action Banner */}
      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          {/* Project Name (Cormorant Garamond / Lora Serif) & What's Next Label (Serif) */}
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1B3D5F] dark:text-slate-100">
              {whatsNext.projectName}
            </h2>
            <div className="font-serif text-xs font-semibold uppercase tracking-widest text-[#28537D] dark:text-[#99BFF9]">
              What's Next
            </div>
          </div>

          {/* Question 3: Current Step (clean sans-serif, uppercase) & Category/Product count (sans-serif, muted) */}
          <div className="space-y-1">
            <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1B3D5F] dark:text-slate-100 uppercase leading-tight">
              {currentStep.stepTitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
              {currentStep.categoryLabel}
            </p>
          </div>

          {/* Question 4: What did I just finish? */}
          {whatsNext.completedInItem.length > 0 && (
            <div className="space-y-1.5 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                {whatsNext.completedInItem.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C3F3DF]/30 dark:bg-emerald-950/40 text-[#1B3D5F] dark:text-emerald-300 border border-[#88C1A8]/40 dark:border-emerald-700/50 font-sans"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {whatsNext.completedInItem.length === 0 && whatsNext.justFinishedContext && (
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C3F3DF]/30 dark:bg-emerald-950/40 text-[#1B3D5F] dark:text-emerald-300 border border-[#88C1A8]/40 dark:border-emerald-700/50 font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span>{whatsNext.justFinishedContext}</span>
              </span>
            </div>
          )}
        </div>

        {/* Question 5: Action & What comes after this? */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => startWorkflowFocus(currentStep.id, whatsNext.workflowId)}
              className="font-sans flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 shadow-sm active:scale-98 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus</span>
            </button>

            <button
              onClick={() => completeWorkflowStep(currentStep.id, whatsNext.workflowId)}
              className="font-sans flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
              title="Mark step complete"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <span>After this:</span>
            <span className="text-[#1B3D5F] dark:text-slate-200 font-bold">
              → {whatsNext.nextStepLabel || whatsNext.nextStepTitle || 'Workflow Complete'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
