import { useState } from 'react';
import { searchTasks } from '../api';

export function TaskSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const run = async () => {
    const data = await searchTasks(q);
    setResults(data.results);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" />
      <button onClick={run}>Search</button>
      {results.map((r) => (
        <div dangerouslySetInnerHTML={{ __html: r.title }} />
      ))}
    </div>
  );
}
