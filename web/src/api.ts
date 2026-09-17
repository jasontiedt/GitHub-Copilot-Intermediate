import type { Task, TaskStatus } from './types';

const BASE = 'http://localhost:8000';

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`);
  return (await res.json()) as Task[];
}

export async function createTask(title: string, assignee: string): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignee }),
  });
  return (await res.json()) as Task;
}

export async function updateStatus(id: number, status: TaskStatus): Promise<void> {
  await fetch(`${BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
