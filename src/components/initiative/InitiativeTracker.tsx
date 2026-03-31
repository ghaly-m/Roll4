import { useEncounterStore } from '../../store/encounterStore';
import { sortByInitiative } from '../../utils/initiative';
import { InitiativeRow } from './InitiativeRow';
import { AddCharacterForm } from './AddCharacterForm';

export function InitiativeTracker() {
  const encounter = useEncounterStore((s) => s.encounter);
  if (!encounter) return null;

  const sorted = sortByInitiative(encounter.characters);
  const activeCharId = sorted[encounter.currentTurnIndex]?.id ?? null;

  return (
    <div className="space-y-4">
      <AddCharacterForm />

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-display text-sm tracking-[0.15em] uppercase text-ash/40 mb-2">
            No combatants yet
          </p>
          <p className="text-xs text-ash/30">
            Add characters above or search for monsters from Open5e
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((char, i) => (
            <div
              key={char.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <InitiativeRow
                character={char}
                isActive={encounter.isActive && char.id === activeCharId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
