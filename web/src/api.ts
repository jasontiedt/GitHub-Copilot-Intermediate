import type { Task } from './types';

const BASE = 'http://localhost:8000';

export async function getTask(id: number): Promise<Task | null> {
  const res = await fetch(`${BASE}/tasks/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load task ${id}: ${res.status}`);
  return (await res.json()) as Task;
}

export async function getTasks(): Promise<any> {
  const res = await fetch(`${BASE}/tasks`);
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
