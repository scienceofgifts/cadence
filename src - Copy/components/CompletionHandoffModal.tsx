import React from 'react';
import { useTask } from '../context/TaskContext';
import { Check, Play, X, ArrowRight } from 'lucide-react';

export const CompletionHandoffModal: React.FC = () => {
  const {
    completionHandoff,
    startNextWorkflowFocus,
    dismissCompletionHandoff,
    closeFocusMode,
    isFocusModeOpen,
    getActiveWorkflow,
  } = useTask();

  if (!completionHandoff) return null;

  const { completedStep, nextStep, nextAfterNextStep, totalStepsCount, completedStepsCount } = completionHandoff;
  const activeWorkflow = getActiveWorkflow();
  const projectName = activeWorkflow?.projectName || 'Project';

  const handleExitOrDismiss = () => {
    if (isFocusModeOpen) {
      closeFocusMode();
    }
    dismissCompletionHandoff();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={handleExitOrDismiss}
      />

      <div className="relative bg-[#142438] text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl max-w-lg w-full text-center space-y-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Close icon button */}
        <button
          onClick={handleExitOrDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer p-1"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {nextStep ? (
          <>
            {/* Step Complete Section */}
            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                <span>STEP COMPLETE</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 uppercase">
                {completedStep.stepTitle}
              </h2>

              <p className="text-xs font-mono text-slate-400">
                {projectName} · {completedStep.categoryLabel}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800/80 my-2" />

            {/* UP NEXT Preview Section */}
            <div className="p-4 sm:p-5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-left space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                UP NEXT
              </span>

              <h3 className="text-lg sm:text-xl font-extrabold text-[#99BFF9] uppercase tracking-tight">
                {nextStep.stepTitle}
              </h3>

              <p className="text-xs font-medium text-slate-300">
                {nextStep.categoryLabel}
              </p>

              {nextAfterNextStep && (
                <div className="pt-2 text-xs font-mono text-slate-400 flex items-center gap-1 border-t border-slate-800/60 mt-3">
                  <span className="text-slate-500">After this:</span>
                  <span className="text-slate-300 font-medium">
                    → {nextAfterNextStep.categoryLabel ? `${nextAfterNextStep.categoryLabel} · ${nextAfterNextStep.stepTitle}` : nextAfterNextStep.stepTitle}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => startNextWorkflowFocus()}
                className="w-full sm:flex-1 py-3 px-5 text-sm font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-95 transition-transform active:scale-98 cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Next Step</span>
              </button>

              <button
                onClick={handleExitOrDismiss}
                className="w-full sm:w-auto py-3 px-5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
              >
                {isFocusModeOpen ? 'Exit Focus' : 'Close Preview'}
              </button>
            </div>
          </>
        ) : (
          /* WORKFLOW COMPLETE (Final step behavior) */
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                ✓ WORKFLOW COMPLETE
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {projectName}
              </h2>

              <p className="text-sm font-mono text-[#99BFF9] pt-1">
                {completedStepsCount || totalStepsCount || 55} / {totalStepsCount || 55} steps completed
              </p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/30 text-xs text-slate-300">
              All repeated products and publication stages have been completed successfully.
            </div>

            <div className="pt-2">
              <button
                onClick={handleExitOrDismiss}
                className="w-full py-3 px-5 text-sm font-bold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-95 transition-transform active:scale-98 cursor-pointer shadow-lg"
              >
                Exit Focus
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
