import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTask, getTasks, updateStatus } from './api';

vi.mock('./config', () => ({ API_BASE_URL: 'https://api.example.test' }));

const fetchMock = vi.fn<typeof fetch>();

describe('task API', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('uses the configured base URL for task requests', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([])));

    await getTasks();
    await createTask('Task', 'Ada');
    await updateStatus(1, 'done');

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.test/tasks');
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.example.test/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Task', assignee: 'Ada' }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'https://api.example.test/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
  });
});
