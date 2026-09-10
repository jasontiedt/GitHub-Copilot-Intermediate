import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('shows an empty state when there are no tasks', () => {
    const markup = renderToStaticMarkup(<TaskList tasks={[]} onChanged={() => {}} />);

    expect(markup).toContain('No tasks yet.');
  });
});
