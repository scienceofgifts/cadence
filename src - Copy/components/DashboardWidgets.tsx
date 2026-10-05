import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { Timer, Clock, Flame, CheckCircle2, Sparkles, StickyNote, Play, Pause, Square } from 'lucide-react';

export const DashboardWidgets: React.FC = () => {
  const {
    settings,
    totalFocusTodaySeconds,
    completedPomodorosToday,
    tasks,
    activeFocusTaskId,
    timerStatus,
    resumeFocusTimer,
    pauseFocusTimer,
    finishFocusSession,
    openFocusMode,
    setDailyIntention,
    setQuickNote,
  } = useTask();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const w = settings.widgets;
  const activeTask = tasks.find((t) => t.id === activeFocusTaskId);

  // Format focus time (seconds -> "1h 42m" or "25m")
  const formatFocusTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remainingMins}m`;
    return `${mins}m`;
  };

  const hasAnyWidget =
    w.focusToday ||
    w.pomodoros ||
    w.dailyIntention ||
    w.quickNote ||
    w.clock ||
    (w.currentFocus && activeTask);

  if (!hasAnyWidget) return null;

  return (
    <div className="mb-6 space-y-4">
      
      {/* Top Row: Daily Intention & Clock */}
      {(w.dailyIntention || w.clock) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-[#142438]/70 backdrop-blur-xs p-4 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-2xs">
          
          {/* Daily Intention */}
          {w.dailyIntention && (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Sparkles className="w-4 h-4 text-[#99BFF9] shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Today's Intention
                </span>
                <input
                  type="text"
                  value={settings.dailyIntention}
                  onChange={(e) => setDailyIntention(e.target.value)}
                  placeholder="Set a single focus prompt for today..."
                  className="w-full bg-transparent text-xs font-semibold text-[#1B3D5F] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Live Clock */}
          {w.clock && (
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-right font-mono text-xs text-slate-500 dark:text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-4">
              <Clock className="w-3.5 h-3.5 opacity-60" />
              <span className="font-bold text-[#1B3D5F] dark:text-slate-200">{timeStr}</span>
              <span className="opacity-60">· {dateStr}</span>
            </div>
          )}

        </div>
      )}

      {/* Grid Row: Focus Stats, Current Focus Task & Quick Scratchpad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Widget 1: Focus Time Today */}
        {w.focusToday && (
          <div
            onClick={() => openFocusMode()}
            className="p-3.5 bg-white/80 dark:bg-[#142438]/80 hover:bg-white rounded-xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Focus Today</span>
              <Timer className="w-3.5 h-3.5 text-[#99BFF9] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-[#1B3D5F] dark:text-slate-100 tabular-nums">
              {formatFocusTime(totalFocusTodaySeconds)}
            </div>
          </div>
        )}

        {/* Widget 2: Pomodoros Completed */}
        {w.pomodoros && (
          <div
            onClick={() => openFocusMode()}
            className="p-3.5 bg-white/80 dark:bg-[#142438]/80 hover:bg-white rounded-xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Pomodoros</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#88C1A8] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-bold font-mono text-[#1B3D5F] dark:text-slate-100 tabular-nums">
              {completedPomodorosToday} completed
            </div>
          </div>
        )}

        {/* Widget 3: Current Focus Task */}
        {w.currentFocus && activeTask && (
          <div className="p-3.5 bg-gradient-to-r from-[#99BFF9]/20 to-[#C3F3DF]/20 dark:from-[#112438] dark:to-[#0D241D] rounded-xl border border-[#99BFF9]/40 shadow-2xs flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#28537D] dark:text-[#99BFF9] block">
                Current Focus
              </span>
              <div className="text-xs font-bold text-[#1B3D5F] dark:text-slate-100 truncate">
                {activeTask.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {timerStatus === 'running' ? (
                <button
                  onClick={pauseFocusTimer}
                  className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-[#1B3D5F] dark:text-slate-100 shadow-xs hover:bg-slate-50 cursor-pointer"
                  title="Pause timer"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={resumeFocusTimer}
                  className="p-1.5 bg-[#1B3D5F] text-white rounded-lg shadow-xs hover:opacity-90 cursor-pointer"
                  title="Resume timer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={() => openFocusMode()}
                className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 shadow-xs cursor-pointer"
                title="Expand Focus Mode"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Widget 4: Quick Scratchpad Note */}
        {w.quickNote && (
          <div className="p-3 bg-white/80 dark:bg-[#142438]/80 rounded-xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-1 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <StickyNote className="w-3 h-3 text-[#99BFF9]" />
                Quick Scratchpad
              </span>
            </div>
            <textarea
              rows={2}
              value={settings.quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Jot temporary thoughts..."
              className="w-full bg-transparent text-xs text-[#1B3D5F] dark:text-slate-200 placeholder:text-slate-400 focus:outline-none resize-none font-sans leading-snug"
            />
          </div>
        )}

      </div>

    </div>
  );
};
