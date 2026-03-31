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
        className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded border border-slate/40 text-ash hover:text-bone hover:border-ash/60 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
      >
        Prev
      </button>
      <button
        onClick={nextTurn}
        className="px-5 py-2 text-sm font-display tracking-wider uppercase rounded bg-verdant/30 text-verdant font-semibold border border-verdant/40 hover:bg-verdant/40 transition-all duration-200"
      >
        {encounter.isActive ? 'Next' : 'Start'}
      </button>
      {encounter.isActive && (
        <button
          onClick={resetEncounter}
          className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded border border-blood/40 text-blood hover:bg-blood/10 hover:border-blood/60 transition-all duration-200"
        >
          Reset
        </button>
      )}
    </div>
  );
}
