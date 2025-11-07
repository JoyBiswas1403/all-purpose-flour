import { useState } from 'react';
import type { FormEvent } from 'react';
import dayjs from 'dayjs';
import { events } from '../services';

export default function NewEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toISO = (value: string) =>
    value ? dayjs(value).toISOString() : '';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await events.create({
        title,
        description: description || undefined,
        startTime: toISO(start),
        endTime: toISO(end),
      });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">New Event</h1>
      {error && <p className="text-red-400 mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Start</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">End</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Creating…' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}