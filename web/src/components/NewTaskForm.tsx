import { useState } from 'react';
import { createTask } from '../api';

export function NewTaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');

  // TODO: real assignee, empty-title validation, loading + error states
  const submit = async (e: any) => {
    e.preventDefault();
    await createTask(title, 'me');
    setTitle('');
    onCreated();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task title"
      />
      <button type="submit">Add</button>
    </form>
  );
}
