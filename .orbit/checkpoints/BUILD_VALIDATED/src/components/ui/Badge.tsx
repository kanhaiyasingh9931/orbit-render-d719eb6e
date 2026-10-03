import React from 'react';
import { Priority } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'priority' | 'outline' | 'tag';
  priority?: Priority;
  size?: 'sm' | 'md';
  onRemove?: () => void;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  priority,
  size = 'sm',
  onRemove,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  const getPriorityClasses = (p?: Priority): string => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50';
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  let variantClasses = '';
  if (variant === 'priority' || priority) {
    variantClasses = getPriorityClasses(priority);
  } else if (variant === 'tag') {
    variantClasses =
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50';
  } else if (variant === 'outline') {
    variantClasses =
      'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent';
  } else {
    variantClasses =
      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700';
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-colors ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-0.5 inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
          aria-label="Remove item"
        >
          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;