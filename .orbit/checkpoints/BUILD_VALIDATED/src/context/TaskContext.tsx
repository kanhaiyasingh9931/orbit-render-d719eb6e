import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Status, Priority, Theme, TaskFilters, TaskMetrics } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  theme: Theme;
  filters: TaskFilters;
  metrics: TaskMetrics;
  isCreateModalOpen: boolean;
  editingTask: Task | null;
  toggleTheme: () => void;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  updateFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  resetFilters: () => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Status, targetIndex?: number) => void;
  reorderTasks: (status: Status, startIndex: number, endIndex: number) => void;
  openCreateModal: (defaultStatus?: Status) => void;
  closeCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeEditModal: () => void;
  defaultStatusForNewTask: Status;
}

const defaultTasks: Task[] = [
  {
    id: 'default-task-1',
    title: 'Research UI component libraries',
    description: 'Evaluate Tailwind CSS and dnd-kit for responsiveness and smooth drag-and-drop interactions.',
    status: 'Done',
    priority: 'Medium',
    tags: ['Research', 'Frontend'],
    createdAt: Date.now() - 3600000 * 24 * 3,
  },
  {
    id: 'default-task-2',
    title: 'Design Kanban board layout',
    description: 'Define columns, responsive metrics dashboard, and dark/light color schemes.',
    status: 'Done',
    priority: 'High',
    tags: ['Design', 'UI/UX'],
    createdAt: Date.now() - 3600000 * 24 * 2,
  },
  {
    id: 'default-task-3',
    title: 'Implement drag-and-drop mechanics',
    description: 'Integrate collision detection and touch sensor support using @dnd-kit.',
    status: 'In Progress',
    priority: 'Urgent',
    tags: ['Frontend', 'Interaction'],
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'default-task-4',
    title: 'Metrics dashboard widgets',
    description: 'Calculate real-time completion percentages and priority breakdowns.',
    status: 'Review',
    priority: 'Medium',
    tags: ['Analytics', 'Dashboard'],
    createdAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'default-task-5',
    title: 'Keyboard accessibility & Focus trapping',
    description: 'Ensure modal dialogs and board actions support standard accessibility keys.',
    status: 'To Do',
    priority: 'Low',
    tags: ['Accessibility', 'A11y'],
    createdAt: Date.now() - 3600000 * 2,
  },
];

const defaultFilters: TaskFilters = {
  searchQuery: '',
  priority: 'All',
  column: 'All',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('orbit_kanban_tasks', defaultTasks);
  const [theme, setTheme] = useLocalStorage<Theme>('orbit_kanban_theme', 'dark');
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState<Status>('To Do');

  // Synchronize HTML root element class for dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  };

  const moveTask = (id: string, newStatus: Status, targetIndex?: number) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === id);
      if (taskIndex === -1) return prev;

      const currentTask = prev[taskIndex];
      const updatedTask: Task = { ...currentTask, status: newStatus };

      const remaining = prev.filter((t) => t.id !== id);

      if (targetIndex !== undefined && targetIndex >= 0) {
        // Insert into specific position relative to tasks with the same status
        const sameStatusTasks = remaining.filter((t) => t.status === newStatus);
        const otherStatusTasks = remaining.filter((t) => t.status !== newStatus);

        const newSameStatusTasks = [...sameStatusTasks];
        newSameStatusTasks.splice(targetIndex, 0, updatedTask);

        return [...otherStatusTasks, ...newSameStatusTasks];
      }

      return [updatedTask, ...remaining];
    });
  };

  const reorderTasks = (status: Status, startIndex: number, endIndex: number) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.status === status);
      const otherTasks = prev.filter((t) => t.status !== status);

      if (startIndex < 0 || startIndex >= columnTasks.length || endIndex < 0 || endIndex >= columnTasks.length) {
        return prev;
      }

      const reorderedColumnTasks = [...columnTasks];
      const [movedItem] = reorderedColumnTasks.splice(startIndex, 1);
      reorderedColumnTasks.splice(endIndex, 0, movedItem);

      return [...otherTasks, ...reorderedColumnTasks];
    });
  };

  const openCreateModal = (defaultStatus: Status = 'To Do') => {
    setDefaultStatusForNewTask(defaultStatus);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
  };

  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Filtered tasks based on search query, priority, and column
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = filters.searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesPriority =
        filters.priority === 'All' || task.priority === filters.priority;

      const matchesColumn =
        filters.column === 'All' || task.status === filters.column;

      return matchesSearch && matchesPriority && matchesColumn;
    });
  }, [tasks, filters]);

  // Derived metrics calculation
  const metrics = useMemo<TaskMetrics>(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Done').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const byPriority: Record<Priority, number> = {
      Low: tasks.filter((t) => t.priority === 'Low').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      High: tasks.filter((t) => t.priority === 'High').length,
      Urgent: tasks.filter((t) => t.priority === 'Urgent').length,
    };

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      byPriority,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        theme,
        filters,
        metrics,
        isCreateModalOpen,
        editingTask,
        toggleTheme,
        setFilters,
        updateFilter,
        resetFilters,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        reorderTasks,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        defaultStatusForNewTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};