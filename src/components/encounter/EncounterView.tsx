import { useEncounterStore } from '../../store/encounterStore';
import { EncounterHeader } from './EncounterHeader';
import { InitiativeTracker } from '../initiative/InitiativeTracker';

export function EncounterView() {
  const encounter = useEncounterStore((s) => s.encounter);

  if (!encounter) {
    return (
      <div className="text-center py-24">
        <h2 className="text-3xl font-bold text-parchment/30 mb-3">Roll for Initiative</h2>
        <p className="text-parchment/20">Create a new encounter to get started</p>
      </div>
    );
  }

  return (
    <div>
      <EncounterHeader />
      <InitiativeTracker />
    </div>
  );
}
