import React from 'react';
import { useTask } from '../context/TaskContext';
import { getGreeting, getTodayString } from '../utils/date';
import { DailySpark } from './DailySpark';
import { Sparkles, CheckCircle2, Flame } from 'lucide-react';

export const DayProgress: React.FC = () => {
  const { tasks, settings } = useTask();
  const todayStr = getTodayString();

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedToday = todayTasks.filter((t) => t.completed);
  const totalToday = todayTasks.length;
  const remainingToday = totalToday - completedToday.length;
  const percent = totalToday > 0 ? Math.round((completedToday.length / totalToday) * 100) : 100;

  const { title } = getGreeting(settings.userName || 'Dattaraj');

  // Calculate current streak across recurring tasks
  const maxStreak = Math.max(
    0,
    ...tasks.map((t) => t.streak || 0)
  );

  return (
    <div className="bg-white dark:bg-[#142438] rounded-2xl p-6 sm:p-7 border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs mb-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Greeting & Dynamic Daily Spark */}
        <div className="space-y-2 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100">
            {title}
          </h1>
          <DailySpark
            remainingTasks={remainingToday}
            totalTasks={totalToday}
            focusStreak={maxStreak}
          />
        </div>

        {/* Right: Subtle Visual Progress Horizon */}
        <div className="flex items-center gap-5 sm:gap-6 shrink-0 bg-[#FAF9F6] dark:bg-[#0C1724] p-4 sm:p-5 rounded-xl border border-[#1B3D5F]/5 dark:border-slate-800">
          
          {/* Zen Progress Arc */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-slate-200 dark:text-slate-700 stroke-current"
                strokeWidth="3.2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Animated Progress path */}
              <path
                className="stroke-current transition-all duration-700 ease-out"
                strokeWidth="3.5"
                strokeDasharray={`${percent}, 100`}
                strokeLinecap="round"
                style={{
                  stroke: percent === 100 ? '#88C1A8' : '#99BFF9',
                }}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-bold font-mono text-[#1B3D5F] dark:text-slate-200 tabular-nums">
                {percent}%
              </span>
            </div>
          </div>

          {/* Stats & Zen Pebbles */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-[#1B3D5F] dark:text-slate-100 tabular-nums">
                {completedToday.length} of {totalToday} done
              </span>
              {maxStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C3F3DF]/40 text-[#1B3D5F] text-[11px] font-semibold">
                  <Flame className="w-3 h-3 fill-[#88C1A8] text-[#88C1A8]" />
                  <span>{maxStreak}d streak</span>
                </span>
              )}
            </div>

            {/* Zen Pebbles Visual */}
            {totalToday > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    title={t.title}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      t.completed
                        ? 'bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] scale-110 shadow-xs'
                        : 'border border-slate-300 dark:border-slate-600 bg-transparent'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-[#99BFF9]" />
                <span>Ready for momentum</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
