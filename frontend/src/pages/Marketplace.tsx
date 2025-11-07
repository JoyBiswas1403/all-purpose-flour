import { useEffect, useState } from 'react';
import type { Event } from '../types';
import { swaps, events } from '../services';

export default function Marketplace() {
  const [slots, setSlots] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI modal state
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [selectedMine, setSelectedMine] = useState<string>('');

  useEffect(() => {
    setError('');
    Promise.all([swaps.swappable(), events.list()])
      .then(([market, mine]) => {
        setSlots(market);
        setMyEvents(mine);
      })
      .catch((e: any) => setError(e.response?.data?.error || 'Failed to load slots'))
      .finally(() => setLoading(false));
  }, []);

  const mySwappable = myEvents.filter((e) => e.status === 'swappable');

  const openModal = (targetId: string) => {
    setActiveTarget(targetId);
    // Preselect first swappable if available
    setSelectedMine(mySwappable[0]?.id ?? '');
  };

  const closeModal = () => {
    setActiveTarget(null);
    setSelectedMine('');
  };

  const submitSwap = async () => {
    if (!activeTarget || !selectedMine) return;
    try {
      await swaps.request({ mySlotId: selectedMine, theirSlotId: activeTarget });
      closeModal();
      alert('Swap request sent!');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Request failed');
    }
  };

  const formatRange = (ev: Event) => {
    const start = new Date(ev.startTime);
    const end = new Date(ev.endTime);
    return `${start.toLocaleString()} – ${end.toLocaleTimeString()}`;
  };

  if (loading) return <p className="text-neutral-400">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Swappable Slots</h1>
      {error && <p className="text-red-400">{error}</p>}
      {slots.length === 0 && !error && <p className="text-neutral-400">None available.</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((s) => (
          <div key={s.id} className="card p-4">
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-sm text-neutral-400">{formatRange(s)}</p>
            {s.description && (
              <p className="text-sm mt-2 text-neutral-300">{s.description}</p>
            )}
            <button onClick={() => openModal(s.id)} className="btn-primary mt-4">
              Request Swap
            </button>
          </div>
        ))}
      </div>

      {activeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-xl font-semibold">Offer one of your slots</h2>
            {mySwappable.length === 0 ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-neutral-300">
                  You have no swappable slots. Go to your Dashboard and mark a slot swappable.
                </p>
                <a href="/" className="btn-secondary">Go to Dashboard</a>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="text-sm text-neutral-300">Select your slot to offer</label>
                <select
                  value={selectedMine}
                  onChange={(e) => setSelectedMine(e.target.value)}
                  className="w-full rounded-md bg-neutral-700 text-white px-3 py-2"
                >
                  {mySwappable.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — {formatRange(ev)}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3 pt-2">
                  <button onClick={submitSwap} disabled={!selectedMine} className="btn-primary disabled:opacity-60">Send Request</button>
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}