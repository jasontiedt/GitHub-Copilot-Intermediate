import { useEffect, useState } from 'react';
import { getTasks } from './api';
import type { Task } from './types';
import { TaskList } from './components/TaskList';
import { NewTaskForm } from './components/NewTaskForm';
import { TaskSearch } from './components/TaskSearch';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = async () => setTasks(await getTasks());

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>TaskFlow</h1>
      <NewTaskForm onCreated={load} />
      <TaskSearch />
      <TaskList tasks={tasks} onChanged={load} />
    </main>
  );
}
