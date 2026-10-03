import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Status, Task } from '../../types';
import { SortableTask } from './SortableTask';

export interface ColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onAddTask?: (status: Status) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusConfig: Record<
  Status,
  {
    headerBg: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    accentBorder: string;
  }
> = {
  'To Do': {
    headerBg: 'bg-slate-100 dark:bg-slate-800/80',
    dotColor: 'bg-slate-500 dark:bg-slate-400',
    badgeBg: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    accentBorder: 'border-t-slate-500',
  },
  'In Progress': {
    headerBg: 'bg-blue-50/70 dark:bg-blue-950/30',
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-t-blue-500',
  },
  Review: {
    headerBg: 'bg-purple-50/70 dark:bg-purple-950/30',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accentBorder: 'border-t-purple-500',
  },
  Done: {
    headerBg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-t-emerald-500',
  },
};

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const taskIds = tasks.map((task) => task.id);
  const config = statusConfig[id];

  return (
    <div
      className={`flex flex-col flex-shrink-0 w-80 sm:w-84 max-h-full rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200 ${
        config.accentBorder
      } border-t-4 ${
        isOver ? 'ring-2 ring-primary-500/50 bg-primary-50/20 dark:bg-primary-950/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl flex items-center justify-between ${config.headerBg}`}>
        <div className="flex items-center space-x-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <h2 className="font-semibold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase">
            {title}
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
          >
            {tasks.length}
          </span>
        </div>

        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(id)}
            title={`Add task to ${title}`}
            aria-label={`Add task to ${title}`}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task List / Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[160px] max-h-[calc(100vh-280px)]"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask && onAddTask(id)}
            className={`h-28 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors ${
              onAddTask ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-400' : ''
            }`}
          >
            <span className="font-medium">No tasks yet</span>
            {onAddTask && <span className="text-[11px] mt-1 text-primary-600 dark:text-primary-400 font-semibold">+ Add Task</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;