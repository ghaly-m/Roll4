import { useEncounterStore } from '../../store/encounterStore';

interface Props {
  onClose: () => void;
}

export function EncounterLibrary({ onClose }: Props) {
  const encounter = useEncounterStore((s) => s.encounter);
  const savedEncounters = useEncounterStore((s) => s.savedEncounters);
  const saveCurrentEncounter = useEncounterStore((s) => s.saveCurrentEncounter);
  const loadSavedEncounter = useEncounterStore((s) => s.loadSavedEncounter);
  const deleteSavedEncounter = useEncounterStore((s) => s.deleteSavedEncounter);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-obsidian border border-slate/20 rounded-lg shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate/20">
          <h2 className="font-display text-sm tracking-[0.2em] uppercase text-amber">
            Encounter Library
          </h2>
          <button
            onClick={onClose}
            className="text-ash hover:text-bone transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Save current */}
        {encounter && (
          <div className="px-6 py-4 border-b border-slate/10 flex items-center justify-between gap-3">
            <span className="text-sm text-ash font-body truncate">
              Current: <span className="text-bone">{encounter.name}</span>
            </span>
            <button
              onClick={() => saveCurrentEncounter()}
              className="px-3 py-1.5 text-xs font-display tracking-wider uppercase rounded bg-amber/10 border border-amber/30 text-amber hover:bg-amber/20 transition-all shrink-0"
            >
              Save
            </button>
          </div>
        )}

        {/* Saved list */}
        <div className="max-h-72 overflow-y-auto">
          {savedEncounters.length === 0 ? (
            <p className="px-6 py-8 text-center text-ash/40 text-sm font-body">
              No saved encounters
            </p>
          ) : (
            <ul className="divide-y divide-slate/10">
              {savedEncounters.map((entry) => (
                <li key={entry.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-bone font-body truncate">{entry.name}</p>
                    <p className="text-xs text-ash/50 mt-0.5">{formatDate(entry.savedAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { loadSavedEncounter(entry.id); onClose(); }}
                      className="px-3 py-1 text-xs font-display tracking-wider uppercase rounded border border-amber/30 text-amber hover:bg-amber/10 transition-all"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteSavedEncounter(entry.id)}
                      className="px-2 py-1 text-xs font-display tracking-wider uppercase rounded border border-blood/20 text-blood/60 hover:text-blood hover:border-blood/40 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
