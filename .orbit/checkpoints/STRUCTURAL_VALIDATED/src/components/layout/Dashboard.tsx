import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';
import { Priority } from '../../types';

export const Dashboard: React.FC = () => {
  const { metrics, filters, setPriorityFilter, clearFilters } = useTaskContext();

  const isPriorityActive = (p: Priority) => filters.priority === p;

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Tasks
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.total}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span>
              {metrics.byStatus['To Do'] + metrics.byStatus['In Progress']} active / {metrics.byStatus['Review']} in review
            </span>
          </div>
        </div>

        {/* Completion Progress Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completion Rate
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.completionPercentage}%
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${metrics.completionPercentage}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{metrics.byStatus['Done']} completed</span>
              <span>{metrics.total - metrics.byStatus['Done']} remaining</span>
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.byStatus['In Progress']}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-500" />
            <span>Currently being worked on</span>
          </div>
        </div>

        {/* Urgent & High Priority Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                High / Urgent
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.byPriority['Urgent'] + metrics.byPriority['High']}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
              {metrics.byPriority['Urgent']} Urgent
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
              {metrics.byPriority['High']} High
            </span>
          </div>
        </div>
      </div>

      {/* Quick Interactive Priority Filter Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
          Quick Filter Priority:
        </span>
        <button
          onClick={() => setPriorityFilter(null)}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
            filters.priority === null
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          All ({metrics.total})
        </button>
        {(['Urgent', 'High', 'Medium', 'Low'] as Priority[]).map((p) => {
          const count = metrics.byPriority[p];
          const isActive = isPriorityActive(p);
          let badgeColors = 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700';

          if (isActive) {
            if (p === 'Urgent') badgeColors = 'bg-rose-500 text-white shadow-sm';
            else if (p === 'High') badgeColors = 'bg-orange-500 text-white shadow-sm';
            else if (p === 'Medium') badgeColors = 'bg-amber-500 text-white shadow-sm';
            else badgeColors = 'bg-slate-600 text-white shadow-sm';
          }

          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(isActive ? null : p)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${badgeColors}`}
            >
              <span>{p}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {(filters.priority !== null || filters.search || filters.column !== null) && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};