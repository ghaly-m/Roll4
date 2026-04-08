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
    <header className="mb-10">
      <div className="flex items-end justify-between">
        {/* Title */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-[0.15em] uppercase">
            <span className="text-amber text-shadow-glow">Roll4</span>
          </h1>
          {encounter ? (
            <p className="font-display text-sm tracking-[0.2em] uppercase text-ash mt-1">
              {encounter.name}
            </p>
          ) : (
            <p className="text-sm tracking-[0.2em] text-slate mt-1 font-display uppercase">
              Initiative Tracker
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {encounter && (
            <>
              <button
                onClick={() => window.open(`${window.location.pathname}#/player`, '_blank')}
                className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded border border-arcane/40 text-arcane hover:bg-arcane/10 hover:border-arcane/60 transition-all duration-200"
                title="Open a read-only view for players"
              >
                Player View
              </button>
              <button
                onClick={deleteEncounter}
                className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded border border-blood/40 text-blood hover:bg-blood/10 hover:border-blood/60 transition-all duration-200"
              >
                End Encounter
              </button>
            </>
          )}
          {!showNew && !encounter && (
            <button
              onClick={() => setShowNew(true)}
              className="px-5 py-2.5 text-sm font-display tracking-wider uppercase rounded bg-amber text-void font-semibold hover:bg-amber-dark transition-all duration-200 shadow-lg shadow-amber/20"
            >
              New Encounter
            </button>
          )}
          {showNew && !encounter && (
            <form
              onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
              className="flex items-center gap-2 animate-fade-up"
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your encounter..."
                className="px-4 py-2 text-sm rounded bg-obsidian border border-slate/40 text-bone placeholder:text-ash/40 focus:border-amber transition-colors font-body"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded bg-amber text-void font-semibold hover:bg-amber-dark transition-all duration-200"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="px-3 py-2 text-sm text-ash hover:text-bone transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Ornamental divider */}
      <div className="divider-ornament mt-6">
        <span className="font-display text-[10px] tracking-[0.5em] uppercase">
          &#10022;
        </span>
      </div>
    </header>
  );
}
