import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTask } from './api';
import type { Task } from './types';

const task: Task = {
  id: 1,
  title: 'Set up CI pipeline',
  status: 'todo',
  assignee: 'alice',
  priority: 5,
  tags: ['infra'],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getTask', () => {
  it('fetches and returns a task', async () => {
    const json = vi.fn().mockResolvedValue(task);
    const fetchMock = vi.fn().mockResolvedValue({ json });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getTask(task.id)).resolves.toEqual(task);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/tasks/1');
  });
});
