import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { AreaId, Priority, RecurringCadence } from '../types';
import { formatNiceDate, formatTime12h } from '../utils/date';
import {
  X,
  Trash2,
  Check,
  Plus,
  Clock,
  Calendar,
  Flag,
  Repeat,
  Layers,
  Paperclip,
  CheckSquare,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const TaskDetailDrawer: React.FC = () => {
  const {
    activeDetailTaskId,
    closeTaskDetail,
    tasks,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    categories,
    projects,
  } = useTask();

  const task = tasks.find((t) => t.id === activeDetailTaskId);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDetailTaskId) {
        closeTaskDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDetailTaskId, closeTaskDetail]);

  if (!task) return null;

  const category = categories.find((c) => c.id === task.areaId);

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkUrl.trim()) return;
    const formattedUrl = newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`;
    const newLinkObj = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim() || formattedUrl,
      url: formattedUrl,
    };
    updateTask(task.id, {
      links: [...(task.links || []), newLinkObj],
    });
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLink(false);
  };

  const handleDeleteLink = (linkId: string) => {
    updateTask(task.id, {
      links: (task.links || []).filter((l) => l.id !== linkId),
    });
  };

  const filteredProjects = projects.filter((p) => p.areaId === task.areaId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1B3D5F]/30 dark:bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeTaskDetail} />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#142438] border-l border-[#1B3D5F]/15 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-[#FAF9F6]/50 dark:bg-slate-900/30">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                task.completed
                  ? 'bg-[#88C1A8] border-[#88C1A8] text-white'
                  : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9]'
              }`}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {task.completed ? 'Completed' : 'Active Task'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (window.confirm("Delete this task?")) {
                  deleteTask(task.id);
                  closeTaskDetail();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={closeTaskDetail}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Task Title Input */}
          <div className="space-y-1">
            <input
              type="text"
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="w-full text-xl sm:text-2xl font-bold tracking-tight text-[#1B3D5F] dark:text-slate-100 font-display bg-transparent border-b border-transparent hover:border-slate-200 focus:border-[#99BFF9] focus:outline-none py-1 transition-colors"
              placeholder="Task title..."
            />
          </div>

          {/* Core Attributes Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF9F6] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            
            {/* Area Category */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category?.accentColor || '#99BFF9' }}
                />
                Area
              </label>
              <select
                value={task.areaId}
                onChange={(e) => updateTask(task.id, { areaId: e.target.value as AreaId, projectId: undefined })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Layers className="w-3.5 h-3.5" />
                Project
              </label>
              <select
                value={task.projectId || ''}
                onChange={(e) => updateTask(task.id, { projectId: e.target.value || undefined })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="">No Project</option>
                {filteredProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none capitalize"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Repeat Cadence */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Repeat className="w-3.5 h-3.5" />
                Repeat
              </label>
              <select
                value={task.recurring}
                onChange={(e) => updateTask(task.id, { recurring: e.target.value as RecurringCadence })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none capitalize"
              >
                <option value="none">Off</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              />
            </div>

            {/* Due Time */}
            <div>
              <label className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5" />
                Time
              </label>
              <input
                type="time"
                value={task.dueTime || ''}
                onChange={(e) => updateTask(task.id, { dueTime: e.target.value || undefined })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              />
            </div>

          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1B3D5F] dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#99BFF9]" />
                Subtasks
              </span>
              {task.subtasks.length > 0 && (
                <span className="font-mono text-[11px] text-slate-500">
                  {task.subtasks.filter((s) => s.completed).length} / {task.subtasks.length}
                </span>
              )}
            </div>

            {/* List */}
            <div className="space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 bg-[#FAF9F6] dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700 group/sub"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleSubtask(task.id, sub.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                        sub.completed
                          ? 'bg-[#88C1A8] border-[#88C1A8] text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <span
                      className={`text-xs font-medium min-w-0 truncate ${
                        sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteSubtask(task.id, sub.id)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover/sub:opacity-100 transition-opacity p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#99BFF9]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="p-2 bg-[#99BFF9]/20 hover:bg-[#99BFF9]/30 text-[#1B3D5F] dark:text-[#99BFF9] disabled:opacity-40 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1B3D5F] dark:text-slate-200">
              Notes & Thoughts
            </label>
            <textarea
              rows={4}
              value={task.notes}
              onChange={(e) => updateTask(task.id, { notes: e.target.value })}
              placeholder="Add links, context, or outline notes..."
              className="w-full bg-[#FAF9F6] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#99BFF9] resize-y font-sans leading-relaxed"
            />
          </div>

          {/* Attachment Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1B3D5F] dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#99BFF9]" />
                Attachments & Links
              </span>
              <button
                onClick={() => setShowAddLink(!showAddLink)}
                className="text-[11px] font-semibold text-[#28537D] dark:text-[#99BFF9] hover:underline cursor-pointer"
              >
                + Add Link
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-2">
              {task.links &&
                task.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-2 p-2 bg-[#FAF9F6] dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-xs"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#28537D] dark:text-[#99BFF9] hover:underline truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{link.title}</span>
                    </a>

                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>

            {/* Add Link Form */}
            {showAddLink && (
              <form onSubmit={handleAddLinkSubmit} className="space-y-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <input
                  type="text"
                  placeholder="Link Title (e.g., Draft Doc)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="URL (e.g., https://...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddLink(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newLinkUrl.trim()}
                    className="px-3 py-1 bg-[#99BFF9] text-[#1B3D5F] font-semibold rounded-lg hover:opacity-90 cursor-pointer"
                  >
                    Save Link
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-[#FAF9F6]/50 dark:bg-slate-900/30 flex items-center justify-between text-[11px] text-slate-400">
          <span>Created {formatNiceDate(task.createdAt.split('T')[0])}</span>
          <button
            onClick={closeTaskDetail}
            className="px-4 py-1.5 text-xs font-semibold text-[#1B3D5F] dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
