import { useEffect, useState } from 'react';
import { getTasks } from './api';
import type { Task } from './types';
import { TaskList } from './components/TaskList';
import { NewTaskForm } from './components/NewTaskForm';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>TaskFlow</h1>
      <NewTaskForm onCreated={load} />
      {loading && <p role="status">Loading tasks…</p>}
      {!loading && error && (
        <p role="alert">
          {error} <button onClick={load}>Retry</button>
        </p>
      )}
      {!loading && !error && <TaskList tasks={tasks} onChanged={load} />}
    </main>
  );
}
