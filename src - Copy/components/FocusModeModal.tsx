import React, { useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Flame,
  CheckSquare,
  Volume2,
  VolumeX,
  Workflow,
  ArrowRight,
  Check,
} from 'lucide-react';
import { formatTime12h } from '../utils/date';

export const FocusModeModal: React.FC = () => {
  const {
    isFocusModeOpen,
    closeFocusMode,
    activeFocusTaskId,
    tasks,
    timerMode,
    setTimerMode,
    timerStatus,
    timerPreset,
    remainingSeconds,
    stopwatchSeconds,
    completedPomodorosToday,
    totalFocusTodaySeconds,
    startFocusForTask,
    pauseFocusTimer,
    resumeFocusTimer,
    resetFocusTimer,
    skipFocusSession,
    finishFocusSession,
    setTimerPresetDuration,
    toggleSubtask,
    toggleTaskComplete,
    settings,
    updateAmbient,
    // Workflows integration
    activeWorkflowStepId,
    getActiveWorkflow,
    completeWorkflowStep,
    toggleWorkflowSubtask,
    completionHandoff,
    continueToNextWorkflowStep,
    dismissCompletionHandoff,
  } = useTask();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusModeOpen) {
        closeFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusModeOpen, closeFocusMode]);

  if (!isFocusModeOpen) return null;

  // Workflow context if active
  const activeWorkflow = getActiveWorkflow();
  const currentWorkflowStep = activeWorkflowStepId && activeWorkflow
    ? activeWorkflow.generatedSteps.find((s) => s.id === activeWorkflowStepId)
    : null;

  const currentWorkflowStepIdx = currentWorkflowStep && activeWorkflow
    ? activeWorkflow.generatedSteps.findIndex((s) => s.id === currentWorkflowStep.id)
    : -1;
  const nextWorkflowStep = currentWorkflowStepIdx >= 0 && activeWorkflow
    ? activeWorkflow.generatedSteps[currentWorkflowStepIdx + 1]
    : undefined;

  const currentTask = tasks.find((t) => t.id === activeFocusTaskId) || tasks[0];

  // Time format
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatTotalFocus = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const h = Math.floor(m / 60);
    const remM = m % 60;
    if (h > 0) return `${h}h ${remM}m`;
    return `${m}m`;
  };

  const displayTime =
    timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(remainingSeconds);

  const toggleAmbientSound = () => {
    updateAmbient({ isPlaying: !settings.ambient.isPlaying });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0C1724]/90 dark:bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Top Header Actions */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#99BFF9] to-[#C3F3DF] text-[#1B3D5F] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold tracking-tight font-sans text-slate-100">
            Cadence Focus Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient sound toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              settings.ambient.isPlaying
                ? 'bg-[#C3F3DF] text-[#1B3D5F] border-[#C3F3DF]'
                : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
            }`}
            title="Toggle Ambient Audio"
          >
            {settings.ambient.isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Exit Focus */}
          <button
            onClick={closeFocusMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit Focus</span>
          </button>
        </div>
      </div>

      {/* Main Center Focus Container */}
      <div className="relative w-full max-w-2xl text-center space-y-8 z-10 text-white pt-10">
        
        {/* Task / Workflow Step Card Header */}
        {currentWorkflowStep ? (
          <div className="inline-flex flex-col items-center gap-2 bg-white/10 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/15 backdrop-blur-md max-w-lg w-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#99BFF9]">
              <Workflow className="w-3.5 h-3.5" />
              <span>{activeWorkflow?.projectName} · {currentWorkflowStep.categoryLabel}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              {currentWorkflowStep.stepTitle}
            </h2>

            {currentWorkflowStep.subtasks.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                {currentWorkflowStep.subtasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => toggleWorkflowSubtask(currentWorkflowStep.id, st.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                      st.completed
                        ? 'bg-[#88C1A8]/30 border-[#88C1A8] text-slate-300 line-through'
                        : 'bg-white/10 border-white/20 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <span>{st.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : currentTask ? (
          <div className="inline-flex flex-col items-center gap-2 bg-white/10 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/15 backdrop-blur-md max-w-lg w-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#99BFF9]">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Current Task</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              {currentTask.title}
            </h2>

            {currentTask.subtasks.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                {currentTask.subtasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => toggleSubtask(currentTask.id, st.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                      st.completed
                        ? 'bg-[#88C1A8]/30 border-[#88C1A8] text-slate-300 line-through'
                        : 'bg-white/10 border-white/20 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <span>{st.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Big Timer Display */}
        <div className="space-y-4">
          
          {/* Timer Mode Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-white/10 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setTimerMode('pomodoro')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timerMode === 'pomodoro' ? 'bg-white text-[#1B3D5F] shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Pomodoro
            </button>

            <button
              onClick={() => setTimerMode('stopwatch')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timerMode === 'stopwatch' ? 'bg-white text-[#1B3D5F] shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Stopwatch
            </button>
          </div>

          {/* Giant Time Numbers */}
          <div className="text-6xl sm:text-8xl font-bold font-mono tracking-tight text-slate-100 tabular-nums drop-shadow-md">
            {displayTime}
          </div>

          {/* Session Counter Subtitle */}
          <div className="text-xs text-slate-300 font-editorial italic flex items-center justify-center gap-2">
            <span>Focus Session {completedPomodorosToday + 1}</span>
            <span>·</span>
            <span>Today's focus: {formatTotalFocus(totalFocusTodaySeconds)}</span>
          </div>

          {/* Preset Buttons for Pomodoro */}
          {timerMode === 'pomodoro' && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setTimerPresetDuration('25-5')}
                className={`px-3 py-1 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${
                  timerPreset === '25-5'
                    ? 'bg-[#99BFF9] text-[#1B3D5F] font-bold border-[#99BFF9]'
                    : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
                }`}
              >
                25m
              </button>

              <button
                onClick={() => setTimerPresetDuration('50-10')}
                className={`px-3 py-1 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${
                  timerPreset === '50-10'
                    ? 'bg-[#99BFF9] text-[#1B3D5F] font-bold border-[#99BFF9]'
                    : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
                }`}
              >
                50m
              </button>

              <button
                onClick={() => setTimerPresetDuration('90-0')}
                className={`px-3 py-1 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${
                  timerPreset === '90-0'
                    ? 'bg-[#99BFF9] text-[#1B3D5F] font-bold border-[#99BFF9]'
                    : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
                }`}
              >
                90m Deep
              </button>
            </div>
          )}

        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          
          {timerStatus === 'running' ? (
            <button
              onClick={pauseFocusTimer}
              className="flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base rounded-2xl shadow-xl transition-transform active:scale-95 cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusTimer}
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 text-[#1B3D5F] font-bold text-base rounded-2xl shadow-xl transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{timerStatus === 'paused' ? 'Resume' : 'Start'}</span>
            </button>
          )}

          <button
            onClick={resetFocusTimer}
            className="p-3 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 rounded-2xl transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {currentWorkflowStep ? (
            <button
              onClick={() => completeWorkflowStep(currentWorkflowStep.id)}
              className="flex items-center gap-1.5 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Complete Step</span>
            </button>
          ) : (
            <button
              onClick={finishFocusSession}
              className="flex items-center gap-1.5 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-2xl text-xs font-semibold cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Session</span>
            </button>
          )}

        </div>

        {/* Forward trajectory hint for workflow */}
        {nextWorkflowStep && (
          <div className="text-xs font-mono text-slate-300 pt-2">
            After this step: <span className="text-[#C3F3DF] font-semibold">→ {nextWorkflowStep.itemIndex ? `Product ${nextWorkflowStep.itemIndex} · ${nextWorkflowStep.stepTitle}` : nextWorkflowStep.stepTitle}</span>
          </div>
        )}

      </div>

    </div>
  );
};
