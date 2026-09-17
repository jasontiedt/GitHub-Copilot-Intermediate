import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskList } from './TaskList';
import type { Task } from '../types';

describe('TaskList', () => {
  it('shows an empty state when there are no tasks', () => {
    const html = renderToStaticMarkup(<TaskList tasks={[]} onChanged={() => {}} />);

    expect(html).toContain('No tasks yet. Add your first task above.');
    expect(html).not.toContain('<ul');
  });

  it('renders the tasks when there are some', () => {
    const tasks: Task[] = [
      { id: 1, title: 'Write tests', status: 'todo', assignee: 'me', priority: 2, tags: [] },
    ];

    const html = renderToStaticMarkup(<TaskList tasks={tasks} onChanged={() => {}} />);

    expect(html).toContain('Write tests');
    expect(html).not.toContain('No tasks yet.');
  });
});
