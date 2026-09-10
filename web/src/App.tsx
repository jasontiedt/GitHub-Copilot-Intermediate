import { useEffect, useState } from 'react';
import { getTasks } from './api';
import type { Task } from './types';
import { TaskList } from './components/TaskList';
import { NewTaskForm } from './components/NewTaskForm';

export function TaskListState({
  tasks,
  loading,
  error,
  onChanged,
}: {
  tasks: Task[];
  loading: boolean;
  error: boolean;
  onChanged: () => void;
}) {
  if (loading) {
    return <p>Loading tasks…</p>;
  }
  if (error) {
    return <p role="alert">Unable to load tasks. Please try again.</p>;
  }
  return <TaskList tasks={tasks} onChanged={onChanged} />;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setTasks(await getTasks());
    } catch {
      setError(true);
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
      <TaskListState tasks={tasks} loading={loading} error={error} onChanged={load} />
    </main>
  );
}
