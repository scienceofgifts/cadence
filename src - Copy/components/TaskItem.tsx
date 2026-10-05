import React from 'react';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import { formatTime12h, formatNiceDate } from '../utils/date';
import { Check, Clock, Repeat, CheckSquare, GripVertical, Paperclip, Flame, ChevronRight } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { toggleTaskComplete, openTaskDetail, categories, projects } = useTask();

  const category = categories.find((c) => c.id === task.areaId);
  const project = projects.find((p) => p.id === task.projectId);

  const subtasksCount = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

  const priorityColors = {
    high: 'bg-rose-500',
    medium: 'bg-amber-400',
    low: 'bg-sky-400',
    none: 'bg-transparent',
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative flex items-center justify-between gap-3 p-3.5 sm:p-4 bg-white dark:bg-[#142438] rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-xs ${
        task.completed
          ? 'opacity-65 bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
          : 'border-[#1B3D5F]/10 dark:border-slate-800 hover:border-[#99BFF9]/60 dark:hover:border-[#99BFF9]/40'
      } ${isDragging ? 'opacity-40 border-dashed border-[#99BFF9]' : ''}`}
    >
      {/* Drag Handle & Checkbox */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        
        {/* Drag handle */}
        <div
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Tactile Animated Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className={`relative w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer border ${
            task.completed
              ? 'bg-[#88C1A8] border-[#88C1A8] text-white animate-bloom shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9] bg-transparent'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 stroke-white stroke-[3.5] fill-none" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" className="animate-check-draw" />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div
          onClick={() => openTaskDetail(task.id)}
          className="min-w-0 flex-1 cursor-pointer space-y-1 py-0.5"
        >
          {/* Title Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold transition-all duration-200 ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-[#1B3D5F] dark:text-slate-100'
              }`}
            >
              {task.title}
            </span>

            {/* Priority Dot */}
            {task.priority !== 'none' && !task.completed && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`}
                title={`Priority: ${task.priority}`}
              />
            )}
          </div>

          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 flex-wrap">
            
            {/* Category Name */}
            {category && (
              <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: category.accentColor }}
                />
                {category.shortName}
              </span>
            )}

            {/* Project indicator */}
            {project && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                  {project.name}
                </span>
              </>
            )}

            {/* Due Date/Time */}
            {task.dueDate && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 opacity-60" />
                  <span>{formatNiceDate(task.dueDate)}</span>
                  {task.dueTime && (
                    <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                      {formatTime12h(task.dueTime)}
                    </span>
                  )}
                </span>
              </>
            )}

            {/* Subtasks Progress */}
            {subtasksCount > 0 && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <CheckSquare className="w-3 h-3 opacity-60" />
                  <span>
                    {completedSubtasks}/{subtasksCount}
                  </span>
                </span>
              </>
            )}

            {/* Recurring & Streak */}
            {task.recurring !== 'none' && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="flex items-center gap-1 text-[#28537D] dark:text-[#99BFF9] font-medium">
                  <Repeat className="w-3 h-3" />
                  <span className="capitalize">{task.recurring}</span>
                  {task.streak && task.streak > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#88C1A8]">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      {task.streak}
                    </span>
                  ) : null}
                </span>
              </>
            )}

            {/* Links / attachments icon */}
            {task.links && task.links.length > 0 && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <Paperclip className="w-3 h-3 opacity-60" />
              </>
            )}

          </div>
        </div>

      </div>

      {/* Right chevron hover affordance */}
      <div
        onClick={() => openTaskDetail(task.id)}
        className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 cursor-pointer p-1 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </div>

    </div>
  );
};
