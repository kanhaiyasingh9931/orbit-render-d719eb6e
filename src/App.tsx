import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/layout/Dashboard';
import { KanbanBoard } from './components/board/KanbanBoard';
import { TaskModal } from './components/modals/TaskModal';
import { Task } from './types';

interface ExtendedTaskContext {
  editingTask?: Task | null;
  setEditingTask?: (task: Task | null) => void;
}

const AppContent: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const context = useTaskContext();
  const extendedContext = context as typeof context & ExtendedTaskContext;

  const handleOpenAddModal = () => {
    if (extendedContext.setEditingTask) {
      extendedContext.setEditingTask(null);
    }
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    if (extendedContext.setEditingTask) {
      extendedContext.setEditingTask(null);
    }
  };

  const isModalOpen = isAddModalOpen || Boolean(extendedContext.editingTask);
  const activeTask = extendedContext.editingTask || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header onAddTask={handleOpenAddModal} onNewTask={handleOpenAddModal} />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex flex-col">
        <Dashboard />
        <div className="flex-1 min-h-0">
          <KanbanBoard />
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-3 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Orbit Kanban Task Board &bull; Drag &amp; drop tasks across columns &bull; Persisted to LocalStorage
        </p>
      </footer>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={activeTask}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;