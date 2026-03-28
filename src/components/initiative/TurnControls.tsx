import { useEncounterStore } from '../../store/encounterStore';

export function TurnControls() {
  const encounter = useEncounterStore((s) => s.encounter);
  const nextTurn = useEncounterStore((s) => s.nextTurn);
  const prevTurn = useEncounterStore((s) => s.prevTurn);
  const resetEncounter = useEncounterStore((s) => s.resetEncounter);

  if (!encounter || encounter.characters.length === 0) return null;

  const canGoPrev = encounter.isActive && (encounter.currentTurnIndex > 0 || encounter.round > 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prevTurn}
        disabled={!canGoPrev}
        className="px-3 py-1.5 text-sm rounded bg-steel/30 text-parchment hover:bg-steel/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>
      <button
        onClick={nextTurn}
        className="px-4 py-1.5 text-sm rounded bg-emerald text-white font-medium hover:bg-emerald-dark transition-colors"
      >
        {encounter.isActive ? 'Next' : 'Start'}
      </button>
      {encounter.isActive && (
        <button
          onClick={resetEncounter}
          className="px-3 py-1.5 text-sm rounded bg-crimson/20 text-crimson hover:bg-crimson/30 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
