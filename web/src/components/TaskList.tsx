import type { Task } from '../types';
import { updateStatus } from '../api';

export function TaskList({ tasks, onChanged }: { tasks: Task[]; onChanged: () => void }) {
  const advance = async (t: Task) => {
    const next = t.status === 'todo' ? 'in_progress' : 'done';
    await updateStatus(t.id, next);
    onChanged();
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((t) => (
        <li key={t.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
          <b>{t.title}</b> — {t.status} · P{t.priority} · {t.assignee}
          {t.status !== 'done' && (
            <button style={{ marginLeft: 8 }} onClick={() => advance(t)}>
              advance
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
