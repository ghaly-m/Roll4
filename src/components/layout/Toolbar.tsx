import { useState } from 'react';
import { useEncounterStore } from '../../store/encounterStore';

export function Toolbar() {
  const encounter = useEncounterStore((s) => s.encounter);
  const newEncounter = useEncounterStore((s) => s.newEncounter);
  const deleteEncounter = useEncounterStore((s) => s.deleteEncounter);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      newEncounter(name.trim());
      setName('');
      setShowNew(false);
    }
  };

  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-gold">Roll4</span>
        {encounter && <span className="text-parchment-dark text-lg ml-3">/ {encounter.name}</span>}
      </h1>

      <div className="flex gap-2">
        {encounter && (
          <button
            onClick={deleteEncounter}
            className="px-3 py-1.5 text-sm rounded bg-crimson/20 text-crimson hover:bg-crimson/30 transition-colors"
          >
            End Encounter
          </button>
        )}
        {!showNew && !encounter && (
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-1.5 text-sm rounded bg-gold text-ink font-medium hover:bg-gold-dark transition-colors"
          >
            New Encounter
          </button>
        )}
        {showNew && !encounter && (
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="flex gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Encounter name..."
              className="px-3 py-1.5 text-sm rounded bg-ink-light/50 border border-parchment/20 text-parchment placeholder:text-parchment/40 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="px-3 py-1.5 text-sm rounded bg-gold text-ink font-medium hover:bg-gold-dark transition-colors">
              Create
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="px-3 py-1.5 text-sm rounded text-parchment/60 hover:text-parchment transition-colors">
              Cancel
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
