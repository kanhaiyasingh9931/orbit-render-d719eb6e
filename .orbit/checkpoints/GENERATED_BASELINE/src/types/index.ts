export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Status = 'To Do' | 'In Progress' | 'Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: number;
}

export type Theme = 'light' | 'dark';

export interface BoardState {
  tasks: Task[];
  theme: Theme;
}

export interface ColumnDefinition {
  id: Status;
  title: string;
  color: string;
}

export interface TaskFilters {
  searchQuery: string;
  priority: Priority | 'All';
  column: Status | 'All';
}

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
}