const BASE = 'http://localhost:8000';

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

export async function searchTasks(q: string): Promise<any> {
  const res = await fetch('http://localhost:8000/tasks/search?q=' + q);
  return res.json();
}

export async function bulkComplete(ids: any) {
  await fetch('http://localhost:8000/tasks/bulk-complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}
