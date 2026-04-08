import type { Encounter } from '../../types';
import { sortByInitiative } from '../../utils/initiative';
import { PlayerCharacterCard } from './PlayerCharacterCard';

interface PlayerInitiativeListProps {
  encounter: Encounter;
}

export function PlayerInitiativeList({ encounter }: PlayerInitiativeListProps) {
  const sorted = sortByInitiative(encounter.characters);
  const activeCharId = encounter.isActive ? sorted[encounter.currentTurnIndex]?.id : null;

  // Find who's up next
  const nextIndex = encounter.currentTurnIndex + 1;
  const nextChar = encounter.isActive
    ? sorted[nextIndex < sorted.length ? nextIndex : 0]
    : null;

  return (
    <div>
      <div className="space-y-3">
        {sorted.map((char) => (
          <div key={char.id} className="animate-fade-up">
            <PlayerCharacterCard
              character={char}
              isActive={char.id === activeCharId}
            />
          </div>
        ))}
      </div>

      {/* Up Next teaser */}
      {nextChar && sorted.length > 1 && (
        <div className="mt-8">
          <div className="divider-ornament">
            <span className="font-display text-[10px] tracking-[0.5em] uppercase">
              &#10022;
            </span>
          </div>
          <p className="text-center mt-4 font-display text-sm tracking-[0.15em] uppercase text-ash/60">
            Up Next:{' '}
            <span className="text-bone/80">{nextChar.name}</span>
          </p>
        </div>
      )}
    </div>
  );
}
