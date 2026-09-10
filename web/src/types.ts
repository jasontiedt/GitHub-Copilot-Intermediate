export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
  priority: number;
  tags: string[];
}
