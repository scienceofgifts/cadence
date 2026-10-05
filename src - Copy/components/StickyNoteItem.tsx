import React from 'react';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import { formatTime12h, formatNiceDate } from '../utils/date';
import { Clock, Check, Repeat, Flame, CheckSquare, Maximize2, Timer } from 'lucide-react';

interface StickyNoteItemProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

// Rotation angles for organic desk placement
const ROTATIONS = ['rotate-1', '-rotate-1', 'rotate-0.5', '-rotate-0.5', 'rotate-1.5', '-rotate-1.5'];

// Warm, subtle note surface tints per area category
const SURFACE_STYLES: Record<string, { bg: string; border: string; accent: string }> = {
  'website-shop': {
    bg: 'bg-[#F2F6FE] dark:bg-[#16253A]',
    border: 'border-[#99BFF9]/40 dark:border-[#99BFF9]/25',
    accent: '#99BFF9',
  },
  youtube: {
    bg: 'bg-[#F3F5FA] dark:bg-[#18283E]',
    border: 'border-[#28537D]/25 dark:border-[#28537D]/30',
    accent: '#28537D',
  },
  house: {
    bg: 'bg-[#F3FAF6] dark:bg-[#132A22]',
    border: 'border-[#88C1A8]/40 dark:border-[#88C1A8]/30',
    accent: '#88C1A8',
  },
  reading: {
    bg: 'bg-[#F3FCF7] dark:bg-[#142B23]',
    border: 'border-[#C3F3DF]/60 dark:border-[#C3F3DF]/30',
    accent: '#C3F3DF',
  },
  workout: {
    bg: 'bg-[#F1F6FD] dark:bg-[#15283E]',
    border: 'border-[#5C93D6]/40 dark:border-[#5C93D6]/30',
    accent: '#5C93D6',
  },
};

export const StickyNoteItem: React.FC<StickyNoteItemProps> = ({
  task,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { toggleTaskComplete, openTaskDetail, startFocusForTask, categories, projects } = useTask();

  const category = categories.find((c) => c.id === task.areaId);
  const project = projects.find((p) => p.id === task.projectId);

  // Deterministic rotation based on task ID
  const rotIndex = Math.abs(
    task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % ROTATIONS.length;
  const rotationClass = ROTATIONS[rotIndex];

  const surface = SURFACE_STYLES[task.areaId] || SURFACE_STYLES['website-shop'];

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
      onClick={() => openTaskDetail(task.id)}
      className={`group relative flex flex-col justify-between p-5 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-1 hover:rotate-0 sm:${rotationClass} ${
        task.completed
          ? 'opacity-65 bg-[#F4F4F6] dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
          : `${surface.bg} ${surface.border}`
      } ${isDragging ? 'opacity-40 border-dashed border-[#99BFF9]' : ''}`}
    >
      {/* Top Bar: Visual Pin/Accent + Checkbox */}
      <div className="flex items-center justify-between gap-3 mb-3">
        
        {/* Category indicator & tape/pin accent */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: surface.accent }}
          />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
            {category?.shortName || 'Task'}
          </span>
          {project && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate hidden sm:inline">
              / {project.name}
            </span>
          )}
        </div>

        {/* Tactile Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className={`relative w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer border ${
            task.completed
              ? 'bg-[#88C1A8] border-[#88C1A8] text-white animate-bloom shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-[#99BFF9] bg-white/80 dark:bg-slate-800/80'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 stroke-white stroke-[3.5] fill-none" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" className="animate-check-draw" />
            </svg>
          )}
        </button>

      </div>

      {/* Task Title Content */}
      <div className="my-1 space-y-1">
        <h3
          className={`text-sm sm:text-base font-bold leading-snug transition-all duration-200 ${
            task.completed
              ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
              : 'text-[#1B3D5F] dark:text-slate-100'
          }`}
        >
          {task.title}
        </h3>
      </div>

      {/* Bottom Bar: Quiet Unboxed Metadata + Details link + Focus action */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
        
        {/* Left Metadata */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          
          {/* Priority indicator */}
          {task.priority !== 'none' && !task.completed && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`}
              title={`Priority: ${task.priority}`}
            />
          )}

          {/* Due date/time */}
          {task.dueDate && (
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Clock className="w-3 h-3 opacity-60" />
              <span>{formatNiceDate(task.dueDate)}</span>
              {task.dueTime && <span>{formatTime12h(task.dueTime)}</span>}
            </span>
          )}

          {/* Subtasks counter */}
          {subtasksCount > 0 && (
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <CheckSquare className="w-3 h-3 opacity-60" />
              <span>{completedSubtasks}/{subtasksCount}</span>
            </span>
          )}

          {/* Recurring badge */}
          {task.recurring !== 'none' && (
            <span className="flex items-center gap-1 text-[#28537D] dark:text-[#99BFF9]">
              <Repeat className="w-3 h-3" />
              {task.streak ? (
                <span className="flex items-center text-[#88C1A8] font-bold">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                  {task.streak}
                </span>
              ) : null}
            </span>
          )}

        </div>

        {/* Right Actions: Focus + Details */}
        <div className="flex items-center gap-2 text-[10px] shrink-0">
          {!task.completed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startFocusForTask(task.id);
              }}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-800/80 hover:bg-[#99BFF9] hover:text-[#1B3D5F] text-[#28537D] dark:text-[#99BFF9] transition-colors font-semibold cursor-pointer border border-slate-200/60 dark:border-slate-700"
              title="Start Focus Timer for this task"
            >
              <Timer className="w-3 h-3" />
              <span>Focus</span>
            </button>
          )}

          <div className="flex items-center gap-0.5 text-slate-400 hover:text-[#1B3D5F] dark:hover:text-slate-200 transition-colors font-medium">
            <span>Details</span>
            <Maximize2 className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

      </div>

    </div>
  );
};

