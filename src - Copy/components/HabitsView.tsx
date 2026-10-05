import React from 'react';
import { useTask } from '../context/TaskContext';
import { Repeat, Flame, Check, Sparkles, Plus } from 'lucide-react';
import { getTodayString } from '../utils/date';

export const HabitsView: React.FC = () => {
  const { tasks, toggleTaskComplete, categories, setIsQuickAddOpen } = useTask();
  const todayStr = getTodayString();

  const habitTasks = tasks.filter((t) => t.recurring !== 'none');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#142438] p-5 rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[#99BFF9]" />
            Recurring Rhythms & Habits
          </h2>
          <p className="text-xs font-editorial italic text-slate-500 dark:text-slate-400">
            Small daily practices that build compounding momentum over time.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] hover:opacity-90 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Rhythm</span>
        </button>
      </div>

      {/* Habits List Grid */}
      {habitTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habitTasks.map((habit) => {
            const category = categories.find((c) => c.id === habit.areaId);
            const isDoneToday = habit.completed && habit.dueDate === todayStr;

            return (
              <div
                key={habit.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  isDoneToday
                    ? 'bg-white dark:bg-[#142438] border-[#88C1A8] shadow-xs'
                    : 'bg-white dark:bg-[#142438] border-[#1B3D5F]/10 dark:border-slate-800 hover:border-[#99BFF9]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category?.accentColor || '#99BFF9' }}
                      />
                      {category?.shortName} · <span className="capitalize">{habit.recurring}</span>
                    </span>

                    <h3 className={`text-base font-bold ${isDoneToday ? 'line-through text-slate-400' : 'text-[#1B3D5F] dark:text-slate-100'}`}>
                      {habit.title}
                    </h3>

                    {habit.notes && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {habit.notes}
                      </p>
                    )}
                  </div>

                  {/* Toggle Checkbox */}
                  <button
                    onClick={() => toggleTaskComplete(habit.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                      isDoneToday
                        ? 'bg-[#88C1A8] border-[#88C1A8] text-white shadow-xs'
                        : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9] bg-[#FAF9F6] dark:bg-slate-800'
                    }`}
                  >
                    {isDoneToday ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Run</span>
                    )}
                  </button>
                </div>

                {/* Streak Counter & 7-Day Heat Dots */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#88C1A8] font-bold">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{habit.streak || 0} day streak</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((dot, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx < (habit.streak || 0) % 7 || isDoneToday
                            ? 'bg-[#88C1A8]'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white/60 dark:bg-[#142438]/60 rounded-2xl border border-dashed border-[#1B3D5F]/15">
          <Sparkles className="w-8 h-8 text-[#99BFF9] mx-auto" />
          <h3 className="text-lg font-bold text-[#1B3D5F] dark:text-slate-100">No recurring habits set yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-editorial italic">
            Add recurring habits like "Morning Workout", "Read 20 pages", or "Weekly Espresso Descaling".
          </p>
        </div>
      )}

    </div>
  );
};
