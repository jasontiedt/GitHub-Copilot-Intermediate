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

function mockFetch(response: Response): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getTask', () => {
  it('returns the task when found', async () => {
    mockFetch(new Response(JSON.stringify(task), { status: 200 }));
    await expect(getTask(1)).resolves.toEqual(task);
  });

  it('returns null when the task is missing', async () => {
    mockFetch(new Response(JSON.stringify({ detail: 'task not found' }), { status: 404 }));
    await expect(getTask(999)).resolves.toBeNull();
  });

  it('throws on other errors', async () => {
    mockFetch(new Response('boom', { status: 500 }));
    await expect(getTask(1)).rejects.toThrow('Failed to load task 1: 500');
  });
});
