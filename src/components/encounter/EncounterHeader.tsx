import { RoundCounter } from './RoundCounter';
import { TurnControls } from '../initiative/TurnControls';

export function EncounterHeader() {
  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-parchment/10">
      <RoundCounter />
      <TurnControls />
    </div>
  );
}
