import { useEffect, useState } from 'react';
import type { Event } from '../types';
import { events } from '../services';

export default function Dashboard() {
  const [list, setList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    events.list().then((data) => {
      setList(data);
      setLoading(false);
    });
  }, []);

  const toggleSwappable = async (ev: Event) => {
    const newStatus = ev.status === 'swappable' ? 'scheduled' : 'swappable';
    await events.updateStatus(ev.id, newStatus);
    setList((prev) =>
      prev.map((e) => (e.id === ev.id ? { ...e, status: newStatus } : e))
    );
  };

  const remove = async (id: string) => {
    await events.remove(id);
    setList((prev) => prev.filter((e) => e.id !== id));
  };

  if (loading) return <p className="text-neutral-400">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">My Schedule</h1>
        <a href="/new" className="btn-primary">+ New Event</a>
      </div>
      {list.length === 0 && (
        <p className="text-neutral-400">No events yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ev) => (
          <div key={ev.id} className="card p-4">
            <h3 className="font-semibold text-lg">{ev.title}</h3>
            <p className="text-sm text-neutral-400">
              {new Date(ev.startTime).toLocaleString()} –{' '}
              {new Date(ev.endTime).toLocaleTimeString()}
            </p>
            {ev.description && (
              <p className="text-sm mt-2 text-neutral-300">{ev.description}</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <span className="badge capitalize">
                {ev.status}
              </span>
              <button onClick={() => toggleSwappable(ev)} className="text-xs text-neutral-300 hover:text-white underline">
                {ev.status === 'swappable' ? 'Unlist' : 'Make swappable'}
              </button>
              <button onClick={() => remove(ev.id)} className="text-xs text-red-400 hover:text-red-300 underline ml-auto">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}