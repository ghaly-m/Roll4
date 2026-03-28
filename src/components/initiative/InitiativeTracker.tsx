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
    <div className="space-y-3">
      <AddCharacterForm />

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-parchment/40">
          <p className="text-lg mb-1">No combatants yet</p>
          <p className="text-sm">Add characters above or search for monsters from Open5e</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((char) => (
            <InitiativeRow
              key={char.id}
              character={char}
              isActive={encounter.isActive && char.id === activeCharId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
