import { useEffect, useState } from 'react';
import type { SwapRequest } from '../types';
import { swaps } from '../services';

export default function Requests() {
  const [incoming, setIncoming] = useState<SwapRequest[]>([]);
  const [outgoing, setOutgoing] = useState<SwapRequest[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    Promise.all([swaps.incoming(), swaps.outgoing()])
      .then(([inc, out]) => {
        setIncoming(inc);
        setOutgoing(out);
      })
      .catch((e: any) => setError(e.response?.data?.error || 'Failed to load requests'));
  };

  useEffect(() => load(), []);

  const respond = async (id: string, status: 'accepted' | 'rejected') => {
    await swaps.respond(id, status === 'accepted');
    load();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Swap Requests</h1>
      {error && <p className="text-red-400">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Incoming</h2>
        {incoming.length === 0 && <p className="text-neutral-400">None.</p>}
        {incoming.map((r) => (
          <div key={r.id} className="card p-4">
            <p className="text-sm text-neutral-300">
              <strong className="text-white">{r.requester?.name ?? 'Unknown'}</strong> wants to swap
            </p>
            {r.requesterEvent && (
              <p className="text-xs text-neutral-400 mt-1">
                Their: {new Date(r.requesterEvent.startTime).toLocaleString()}
              </p>
            )}
            {r.targetEvent && (
              <p className="text-xs text-neutral-400">
                Your: {new Date(r.targetEvent.startTime).toLocaleString()}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={() => respond(r.id, 'accepted')} className="btn-secondary bg-green-700 hover:bg-green-600">
                Accept
              </button>
              <button onClick={() => respond(r.id, 'rejected')} className="btn-secondary bg-red-700 hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Outgoing</h2>
        {outgoing.length === 0 && <p className="text-neutral-400">None.</p>}
        {outgoing.map((r) => (
          <div key={r.id} className="card p-4">
            <p className="text-sm text-neutral-300">
              You requested a swap with <strong className="text-white">{r.target?.name ?? 'Unknown'}</strong>
            </p>
            <p className="text-xs text-neutral-400">
              Status: <span className="capitalize">{r.status}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}