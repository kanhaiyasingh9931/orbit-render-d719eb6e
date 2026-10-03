import React from 'react';
import { Pencil, Trash2, Calendar, GripVertical } from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';

export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, any>;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  isDragging = false,
  dragHandleProps,
}) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`group relative flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 dark:bg-slate-800 ${
        isDragging
          ? 'rotate-2 scale-105 border-primary-500 shadow-xl ring-2 ring-primary-500/20 dark:border-primary-400'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md dark:border-slate-700/80 dark:hover:border-slate-600'
      }`}
    >
      {/* Header: Priority & Quick Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <button
              type="button"
              {...dragHandleProps}
              aria-label="Drag handle"
              className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:text-slate-500 dark:hover:text-slate-300"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}
          <Badge priority={task.priority} size="sm">
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit Task"
              aria-label="Edit Task"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Delete Task"
              aria-label="Delete Task"
              className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="mt-2.5">
        <h4 className="font-semibold text-slate-900 line-clamp-2 dark:text-slate-100 text-sm leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-3 dark:text-slate-400 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="tag" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer: Metadata */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-700/60 dark:text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
