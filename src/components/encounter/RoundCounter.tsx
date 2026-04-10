import { useEncounterStore } from '../../store/encounterStore';
import { useAnimateOnChange } from '../../hooks/useAnimateOnChange';

export function RoundCounter() {
  const round = useEncounterStore((s) => s.encounter?.round ?? 1);
  const isPulsing = useAnimateOnChange(round, 800);

  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-[10px] tracking-[0.4em] uppercase text-ash">
        Round
      </span>
      <span className={`font-display text-2xl font-bold text-amber tabular-nums inline-block ${isPulsing ? 'animate-round-pulse' : ''}`}>
        {round}
      </span>
    </div>
  );
}
