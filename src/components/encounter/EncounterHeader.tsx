import { RoundCounter } from './RoundCounter';
import { TurnControls } from '../initiative/TurnControls';

export function EncounterHeader() {
  return (
    <div className="flex items-center justify-between mb-6 pb-5 border-b border-amber/10">
      <RoundCounter />
      <TurnControls />
    </div>
  );
}
