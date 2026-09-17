import { API_BASE_URL } from './config';

export async function getTasks(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  return res.json();
}

export async function createTask(title: string, assignee: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignee }),
  });
  return res.json();
}

export async function updateStatus(id: number, status: string) {
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
