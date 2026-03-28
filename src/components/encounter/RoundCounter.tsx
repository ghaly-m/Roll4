import { useEncounterStore } from '../../store/encounterStore';

export function RoundCounter() {
  const round = useEncounterStore((s) => s.encounter?.round ?? 1);

  return (
    <div className="flex items-center gap-2 text-sm text-parchment-dark">
      <span className="uppercase tracking-wider text-xs">Round</span>
      <span className="text-gold font-bold text-lg">{round}</span>
    </div>
  );
}
