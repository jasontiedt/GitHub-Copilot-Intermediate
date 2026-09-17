export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
  priority: number;
  tags: string[];
}
