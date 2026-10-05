import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { AreaId, ViewMode } from '../types';
import {
  CheckSquare,
  Calendar,
  Layers,
  Repeat,
  Search,
  Plus,
  Settings,
  Timer,
  Volume2,
  VolumeX,
  Menu,
  X,
  Workflow,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    tasks,
    setIsSearchOpen,
    setIsQuickAddOpen,
    setIsSettingsOpen,
    openFocusMode,
    timerStatus,
    remainingSeconds,
    timerMode,
    stopwatchSeconds,
    isMuted,
    toggleGlobalMute,
    settings,
  } = useTask();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const todayRemaining = todayTasks.filter((t) => !t.completed).length;

  const habitTasks = tasks.filter((t) => t.recurring !== 'none');

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 w-full max-w-full overflow-x-hidden bg-[#FAF9F6]/95 dark:bg-[#0C1724]/95 backdrop-blur-md border-b border-[#1B3D5F]/10 dark:border-slate-800 transition-colors">
      
      {/* DESKTOP HEADER (md:flex) */}
      <div className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 h-16 items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('today');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#99BFF9] to-[#C3F3DF] flex items-center justify-center text-[#1B3D5F] shadow-xs group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display">
              Cadence
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Views */}
        <nav className="flex items-center gap-1 p-1 bg-[#1B3D5F]/5 dark:bg-slate-800/60 rounded-xl">
          <button
            onClick={() => setActiveView('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'today'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today</span>
            {todayRemaining > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#99BFF9]/30 text-[#1B3D5F] dark:text-slate-200 font-bold tabular-nums">
                {todayRemaining}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'week'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Week</span>
          </button>

          <button
            onClick={() => setActiveView('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'projects'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveView('habits')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'habits'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Rhythms</span>
            {habitTasks.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#C3F3DF]/40 text-[#1B3D5F] dark:text-slate-200 font-bold tabular-nums">
                {habitTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('workflows')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'workflows'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-[#99BFF9]" />
            <span>Workflows</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Focus Mode Launch */}
          <button
            onClick={() => openFocusMode()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timerStatus === 'running'
                ? 'bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F] animate-pulse'
                : 'bg-[#1B3D5F]/5 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#1B3D5F]/10'
            }`}
            title="Launch Focus Timer (Press F)"
          >
            <Timer className="w-3.5 h-3.5 text-[#99BFF9] dark:text-current" />
            <span>
              {timerStatus === 'running'
                ? timerMode === 'stopwatch'
                  ? formatSec(stopwatchSeconds)
                  : formatSec(remainingSeconds)
                : 'Focus'}
            </span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-100 bg-[#1B3D5F]/5 dark:bg-slate-800 hover:bg-[#1B3D5F]/10 rounded-lg transition-colors cursor-pointer"
            title="Search tasks (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>

          {/* Quick Add Task */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-95 shadow-xs hover:shadow-md active:scale-98 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add task</span>
          </button>

          {/* Global Audio Mute Toggle */}
          <button
            onClick={toggleGlobalMute}
            className={`relative p-1.5 rounded-lg transition-colors cursor-pointer ${
              isMuted
                ? 'text-rose-400 hover:text-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                : 'text-slate-500 hover:text-[#1B3D5F] dark:hover:text-slate-100 hover:bg-[#1B3D5F]/5 dark:hover:bg-slate-800'
            }`}
            title={isMuted ? "Unmute all audio" : "Mute all audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {!isMuted && settings.ambient.isPlaying && settings.ambient.environment !== 'silence' && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#88C1A8]" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-500 hover:text-[#1B3D5F] dark:hover:text-slate-100 hover:bg-[#1B3D5F]/5 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Settings & Personalization"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* MOBILE COMPACT HEADER (< md) */}
      <div className="md:hidden flex flex-col w-full px-3 py-2 space-y-2">
        
        {/* Row 1: Logo & Compact Action Buttons */}
        <div className="flex items-center justify-between gap-2 w-full">
          
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('today');
            }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#99BFF9] to-[#C3F3DF] flex items-center justify-center text-[#1B3D5F] shadow-xs">
              <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display">
              Cadence
            </span>
          </a>

          {/* Compact Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Quick Add Task */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="p-1.5 text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-lg cursor-pointer shadow-xs"
              title="Add task"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Focus Launch */}
            <button
              onClick={() => openFocusMode()}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                timerStatus === 'running'
                  ? 'bg-[#1B3D5F] text-white dark:bg-[#99BFF9] dark:text-[#1B3D5F]'
                  : 'bg-[#1B3D5F]/5 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title="Focus timer"
            >
              <Timer className="w-4 h-4 text-[#99BFF9] dark:text-current" />
            </button>

            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-slate-600 dark:text-slate-400 bg-[#1B3D5F]/5 dark:bg-slate-800 rounded-lg cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Global Mute */}
            <button
              onClick={toggleGlobalMute}
              className={`relative p-1.5 rounded-lg cursor-pointer ${
                isMuted
                  ? 'text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'text-slate-500 bg-[#1B3D5F]/5 dark:bg-slate-800'
              }`}
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 text-slate-500 bg-[#1B3D5F]/5 dark:bg-slate-800 rounded-lg cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Row 2: 5-Column Segmented Control Nav Tabs (Fits 100% within width down to 320px) */}
        <nav className="grid grid-cols-5 gap-1 p-1 bg-[#1B3D5F]/5 dark:bg-slate-800/60 rounded-xl w-full">
          <button
            onClick={() => setActiveView('today')}
            className={`flex items-center justify-center gap-1 py-1.5 px-0.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeView === 'today'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">Today</span>
            {todayRemaining > 0 && (
              <span className="px-1 py-0.1 rounded-full text-[9px] bg-[#99BFF9]/40 text-[#1B3D5F] dark:text-slate-100 font-bold tabular-nums">
                {todayRemaining}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('week')}
            className={`flex items-center justify-center gap-1 py-1.5 px-0.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeView === 'week'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">Week</span>
          </button>

          <button
            onClick={() => setActiveView('projects')}
            className={`flex items-center justify-center gap-1 py-1.5 px-0.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeView === 'projects'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span className="truncate">Projects</span>
          </button>

          <button
            onClick={() => setActiveView('habits')}
            className={`flex items-center justify-center gap-1 py-1.5 px-0.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeView === 'habits'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Repeat className="w-3 h-3 shrink-0" />
            <span className="truncate">Rhythms</span>
            {habitTasks.length > 0 && (
              <span className="px-1 py-0.1 rounded-full text-[9px] bg-[#C3F3DF]/60 text-[#1B3D5F] dark:text-slate-100 font-bold tabular-nums">
                {habitTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('workflows')}
            className={`flex items-center justify-center gap-1 py-1.5 px-0.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeView === 'workflows'
                ? 'bg-white dark:bg-slate-700 text-[#1B3D5F] dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Workflow className="w-3 h-3 shrink-0 text-[#99BFF9]" />
            <span className="truncate">Workflows</span>
          </button>
        </nav>

      </div>

    </header>
  );
};
