import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { StickyNoteItem } from './StickyNoteItem';
import { ZenEmptyState } from './ZenEmptyState';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { tasks, activeArea, reorderTasks, settings } = useTask();
  const [showCompleted, setShowCompleted] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Filter tasks by active area
  let filteredTasks = tasks;
  if (activeArea !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.areaId === activeArea);
  }

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const dragIdx = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIdx = tasks.findIndex((t) => t.id === targetId);

    if (dragIdx === -1 || targetIdx === -1) return;

    const updated = [...tasks];
    const [removed] = updated.splice(dragIdx, 1);
    updated.splice(targetIdx, 0, removed);

    reorderTasks(updated);
    setDraggedTaskId(null);
  };

  if (activeTasks.length === 0 && completedTasks.length === 0) {
    return <ZenEmptyState />;
  }

  return (
    <div className="space-y-8">
      
      {/* Active Sticky Notes Board */}
      {activeTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-bg-secondary">
              Tasks Desk ({activeTasks.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {activeTasks.map((task) => (
              <StickyNoteItem
                key={task.id}
                task={task}
                isDragging={draggedTaskId === task.id}
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && settings.showCompletedTasks && (
        <div className="pt-6 border-t border-[#1B3D5F]/10 dark:border-slate-800 space-y-3">
          
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-xs font-semibold text-bg-secondary hover:text-bg-primary transition-colors cursor-pointer py-1"
          >
            {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <CheckCircle2 className="w-3.5 h-3.5 text-[#88C1A8]" />
            <span>Completed</span>
            <span className="font-mono text-[11px] opacity-70">({completedTasks.length})</span>
          </button>

          {showCompleted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 transition-all">
              {completedTasks.map((task) => (
                <StickyNoteItem key={task.id} task={task} />
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
