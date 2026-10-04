import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { getCurrentWeekDays, formatTime12h, getTodayString } from '../utils/date';
import { Task } from '../types';
import {
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  Check,
} from 'lucide-react';

export const WeekView: React.FC = () => {
  const { tasks, updateTask, toggleTaskComplete, openTaskDetail, categories, addTask } = useTask();
  const [baseDate, setBaseDate] = useState(new Date());

  const weekDays = getCurrentWeekDays(baseDate);
  const todayStr = getTodayString();

  // Selected active day state (defaults to today if in current week, else first day)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const todayInWeek = weekDays.find((d) => d.dateStr === todayStr);
    return todayInWeek ? todayInWeek.dateStr : weekDays[0].dateStr;
  });

  // Keep selected date aligned when baseDate changes
  useEffect(() => {
    const isSelectedInWeek = weekDays.some((d) => d.dateStr === selectedDateStr);
    if (!isSelectedInWeek) {
      const todayInWeek = weekDays.find((d) => d.dateStr === todayStr);
      setSelectedDateStr(todayInWeek ? todayInWeek.dateStr : weekDays[0].dateStr);
    }
  }, [baseDate]);

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  const resetToday = () => {
    const today = new Date();
    setBaseDate(today);
    setSelectedDateStr(getTodayString());
  };

  // Drag and Drop between days
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnDay = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    updateTask(draggedTaskId, { dueDate: targetDateStr });
    setDraggedTaskId(null);
  };

  const handleQuickAddDayTask = (dateStr: string) => {
    const title = window.prompt("Task for " + dateStr + ":");
    if (!title || !title.trim()) return;

    addTask({
      title: title.trim(),
      dueDate: dateStr,
      areaId: 'website-shop',
      priority: 'none',
      recurring: 'none',
      notes: '',
      subtasks: [],
      links: [],
      completed: false,
    });
  };

  // Active selected day object
  const activeDay = weekDays.find((d) => d.dateStr === selectedDateStr) || weekDays[0];
  const activeDayTasks = tasks.filter((t) => t.dueDate === activeDay.dateStr);
  const activeCompletedCount = activeDayTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#142438] p-4 sm:p-5 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display">
            Weekly Rhythm
          </h2>
          <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
            {weekDays[0].monthName} {weekDays[0].dayNumber} – {weekDays[6].monthName} {weekDays[6].dayNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToday}
            className="px-3 py-1.5 text-xs font-semibold text-[#1B3D5F] dark:text-slate-200 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={prevWeek}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact 7-Day Horizontal Selector Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 p-1.5 bg-[#1B3D5F]/5 dark:bg-slate-900/60 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((t) => t.dueDate === day.dateStr);
          const completedCount = dayTasks.filter((t) => t.completed).length;
          const isSelected = day.dateStr === selectedDateStr;

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDateStr(day.dateStr)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDay(e, day.dateStr)}
              className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-xl transition-all cursor-pointer min-w-0 select-none ${
                isSelected
                  ? 'bg-white dark:bg-[#142438] text-[#1B3D5F] dark:text-slate-100 shadow-md ring-2 ring-[#99BFF9] font-bold scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-[#1B3D5F]'
              }`}
            >
              {/* Day Abbreviation */}
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                isSelected ? 'text-[#1B3D5F] dark:text-[#99BFF9]' : 'text-slate-400'
              }`}>
                {day.dayName.slice(0, 3)}
              </span>

              {/* Date Number */}
              <span className={`text-sm sm:text-base font-bold font-mono my-0.5 ${
                day.isToday && !isSelected ? 'text-[#28537D] dark:text-[#99BFF9] underline' : ''
              }`}>
                {day.dayNumber}
              </span>

              {/* Secondary Indicators: Pebble Dots / Task Counts */}
              <div className="flex items-center gap-1 h-3">
                {dayTasks.length > 0 ? (
                  <div className="flex items-center gap-0.5">
                    {completedCount === dayTasks.length ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#88C1A8]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#99BFF9]" />
                    )}
                    <span className="text-[9px] font-mono opacity-80">
                      {dayTasks.length}
                    </span>
                  </div>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 opacity-40" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* PRIMARY ACTIVE DAY: Focused Detailed Panel */}
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnDay(e, activeDay.dateStr)}
        className="bg-white dark:bg-[#142438] p-5 sm:p-7 rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-xs space-y-5 transition-all animate-in fade-in duration-200"
      >
        {/* Active Day Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#1B3D5F] dark:text-slate-100">
                {activeDay.dayName}, {activeDay.monthName} {activeDay.dayNumber}
              </h3>
              {activeDay.isToday && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] rounded-full">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
              {activeDayTasks.length > 0
                ? `${activeDayTasks.length} ${activeDayTasks.length === 1 ? 'task' : 'tasks'} scheduled (${activeCompletedCount} completed)`
                : 'No tasks scheduled for this day.'}
            </p>
          </div>

          <button
            onClick={() => handleQuickAddDayTask(activeDay.dateStr)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add task for {activeDay.dayName}</span>
          </button>
        </div>

        {/* Active Day Task List */}
        <div className="space-y-2.5">
          {activeDayTasks.length > 0 ? (
            activeDayTasks.map((t) => {
              const cat = categories.find((c) => c.id === t.areaId);

              return (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
                    t.completed
                      ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                      : 'bg-[#FAF9F6] dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-[#99BFF9] hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(t.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        t.completed
                          ? 'bg-[#88C1A8] border-[#88C1A8] text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9]'
                      }`}
                    >
                      {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Task Title & Meta */}
                    <div
                      onClick={() => openTaskDetail(t.id)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.accentColor || '#99BFF9' }}
                        />
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            t.completed
                              ? 'line-through text-slate-400'
                              : 'text-[#1B3D5F] dark:text-slate-100'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>

                      {t.notes && (
                        <p className="text-[11px] font-editorial italic text-slate-400 dark:text-slate-500 truncate pl-4 mt-0.5">
                          {t.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Task Time / Priority */}
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    {t.dueTime && (
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime12h(t.dueTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#99BFF9]" />
              <p className="text-xs sm:text-sm font-editorial italic text-slate-500 dark:text-slate-400">
                No tasks scheduled for {activeDay.dayName}.
              </p>
              <button
                onClick={() => handleQuickAddDayTask(activeDay.dateStr)}
                className="text-xs font-bold text-[#1B3D5F] dark:text-[#99BFF9] underline cursor-pointer"
              >
                + Add a task
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
