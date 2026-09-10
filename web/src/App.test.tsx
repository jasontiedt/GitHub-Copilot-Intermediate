import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TaskListState } from './App';

describe('TaskListState', () => {
  it('shows a loading state', () => {
    const markup = renderToStaticMarkup(
      <TaskListState tasks={[]} loading error={false} onChanged={() => {}} />,
    );

    expect(markup).toContain('Loading tasks…');
  });

  it('shows an error state', () => {
    const markup = renderToStaticMarkup(
      <TaskListState tasks={[]} loading={false} error onChanged={() => {}} />,
    );

    expect(markup).toContain('Unable to load tasks. Please try again.');
    expect(markup).toContain('role="alert"');
  });
});
