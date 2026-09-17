import type { Task } from './types';

const BASE = 'http://localhost:8000';

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) {
    throw new Error(`Could not load tasks (${res.status}).`);
  }
  return res.json();
}

export async function createTask(title: string, assignee: string): Promise<any> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignee }),
  });
  return res.json();
}

export async function updateStatus(id: number, status: string) {
  await fetch(`${BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
