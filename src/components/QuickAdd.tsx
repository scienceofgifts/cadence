import React, { useState, useRef, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { AreaId, Priority, RecurringCadence } from '../types';
import { Plus, Calendar, Clock, Flag, Repeat, Layers, X, Sparkles } from 'lucide-react';
import { getTodayString } from '../utils/date';

export const QuickAdd: React.FC = () => {
  const {
    addTask,
    categories,
    projects,
    isQuickAddOpen,
    setIsQuickAddOpen,
    activeArea,
  } = useTask();

  const [title, setTitle] = useState('');
  const [areaId, setAreaId] = useState<AreaId>(
    activeArea !== 'all' ? activeArea : 'website-shop'
  );
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState<string>(getTodayString());
  const [dueTime, setDueTime] = useState<string>('');
  const [recurring, setRecurring] = useState<RecurringCadence>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickAddOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isQuickAddOpen]);

  // Keep areaId synced with active filter if changed
  useEffect(() => {
    if (activeArea !== 'all') {
      setAreaId(activeArea);
    }
  }, [activeArea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      areaId,
      projectId: projectId || undefined,
      priority,
      dueDate: dueDate || getTodayString(),
      dueTime: dueTime || undefined,
      recurring,
      notes: '',
      subtasks: [],
      links: [],
      completed: false,
    });

    setTitle('');
    setIsExpanded(false);
    if (isQuickAddOpen) {
      setIsQuickAddOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setIsQuickAddOpen(false);
    }
  };

  const filteredProjects = projects.filter((p) => p.areaId === areaId);

  return (
    <>
      {/* Inline Quick Add Card (Always present at top of list) */}
      <div className="mb-6 bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/10 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#99BFF9]/20 text-[#1B3D5F] dark:text-[#99BFF9] flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task... (Press Enter to save)"
              className="w-full bg-transparent text-sm font-semibold text-[#1B3D5F] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-3 py-1.5 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs hover:opacity-90 transition-all shrink-0 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Quick Toolbar options when expanded or typed */}
          {(isExpanded || title.trim().length > 0) && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              
              {/* Category Area Selector */}
              <select
                value={areaId}
                onChange={(e) => {
                  setAreaId(e.target.value as AreaId);
                  setProjectId(undefined);
                }}
                className="px-2.5 py-1 bg-[#FAF9F6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#99BFF9] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName}
                  </option>
                ))}
              </select>

              {/* Project Selector */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Layers className="w-3 h-3 text-slate-400" />
                  <select
                    value={projectId || ''}
                    onChange={(e) => setProjectId(e.target.value || undefined)}
                    className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="">No project</option>
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Priority */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Flag className="w-3 h-3 text-slate-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer capitalize"
                >
                  <option value="none">Priority: None</option>
                  <option value="low">Priority: Low</option>
                  <option value="medium">Priority: Med</option>
                  <option value="high">Priority: High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Calendar className="w-3 h-3 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Due Time */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Clock className="w-3 h-3 text-slate-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Recurring */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Repeat className="w-3 h-3 text-slate-400" />
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as RecurringCadence)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer capitalize"
                >
                  <option value="none">Repeat: Off</option>
                  <option value="daily">Every day</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

            </div>
          )}
        </form>
      </div>

      {/* Quick Add Modal Overlay (Triggered by + Add task button or N key) */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#142438] rounded-2xl border border-[#1B3D5F]/15 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#1B3D5F] dark:text-slate-100 font-bold">
                <Sparkles className="w-4 h-4 text-[#99BFF9]" />
                <span>Quick Task Entry</span>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs doing?"
                className="w-full text-base font-semibold text-[#1B3D5F] dark:text-slate-100 placeholder:text-slate-400 bg-[#FAF9F6] dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#99BFF9]"
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Area / Category</label>
                  <select
                    value={areaId}
                    onChange={(e) => {
                      setAreaId(e.target.value as AreaId);
                      setProjectId(undefined);
                    }}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Project</label>
                  <select
                    value={projectId || ''}
                    onChange={(e) => setProjectId(e.target.value || undefined)}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">None</option>
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Due Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none capitalize"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Repeat Cadence</label>
                  <select
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value as RecurringCadence)}
                    className="w-full p-2 bg-[#FAF9F6] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none capitalize"
                  >
                    <option value="none">Off</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2 text-xs font-semibold text-[#1B3D5F] bg-gradient-to-r from-[#99BFF9] to-[#C3F3DF] rounded-xl hover:opacity-90 disabled:opacity-40 shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
