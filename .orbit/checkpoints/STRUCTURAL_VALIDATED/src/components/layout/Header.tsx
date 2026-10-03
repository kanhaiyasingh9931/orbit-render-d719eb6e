import React from 'react';
import { Plus, Search, Sun, Moon, SlidersHorizontal, X, Layers } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Priority, Status } from '../../types';
import { Button } from '../ui/Button';

export interface HeaderProps {
  onAddTask?: () => void;
  onNewTask?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTask, onNewTask }) => {
  const { theme, toggleTheme, filters, setFilters, resetFilters } = useTaskContext();
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const handleOpenModal = () => {
    if (onAddTask) {
      onAddTask();
    } else if (onNewTask) {
      onNewTask();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      priority: e.target.value as Priority | 'All',
    }));
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      column: e.target.value as Status | 'All',
    }));
  };

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.priority !== 'All' ||
    filters.column !== 'All' ||
    filters.tag !== '';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Orbit
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  Kanban
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                Task Management & Agile Workflow
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search tasks by title, description, or tags..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Priority Filter Select - Desktop */}
            <div className="hidden lg:flex items-center gap-1.5">
              <select
                value={filters.priority}
                onChange={handlePriorityChange}
                aria-label="Filter tasks by priority"
                className="text-xs font-medium py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <select
                value={filters.column}
                onChange={handleColumnChange}
                aria-label="Filter tasks by column"
                className="text-xs font-medium py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
              >
                <option value="All">All Columns</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1.5"
                  title="Reset all filters"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-2 rounded-xl"
              aria-label="Toggle search and filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-slate-200 dark:border-slate-700"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {/* Add Task Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenModal}
              className="gap-1.5 shadow-md shadow-indigo-500/20 px-3.5 py-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Mobile Filter & Search Expandable Panel */}
        {showMobileFilters && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute right-2.5 top-2.5 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.priority}
                onChange={handlePriorityChange}
                aria-label="Filter tasks by priority"
                className="w-full text-xs font-medium py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              <select
                value={filters.column}
                onChange={handleColumnChange}
                aria-label="Filter tasks by column"
                className="w-full text-xs font-medium py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              >
                <option value="All">All Columns</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 px-3 py-1.5"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;