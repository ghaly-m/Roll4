import { useEncounterStore } from '../../store/encounterStore';
import { EncounterHeader } from './EncounterHeader';
import { InitiativeTracker } from '../initiative/InitiativeTracker';

export function EncounterView() {
  const encounter = useEncounterStore((s) => s.encounter);

  if (!encounter) {
    return (
      <div className="text-center py-32 animate-fade-up">
        {/* Decorative d20 shape */}
        <div className="inline-block mb-8 relative">
          <svg width="80" height="80" viewBox="0 0 80 80" className="text-amber/15">
            <polygon
              points="40,4 72,22 72,58 40,76 8,58 8,22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <polygon
              points="40,12 64,26 64,54 40,68 16,54 16,26"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <text
              x="40"
              y="45"
              textAnchor="middle"
              fill="currentColor"
              className="font-display text-lg"
              style={{ fontSize: '16px' }}
            >
              20
            </text>
          </svg>
        </div>

        <h2 className="font-display text-2xl font-bold tracking-[0.15em] uppercase text-bone/20 mb-3">
          Roll for Initiative
        </h2>
        <p className="text-ash/40 text-sm tracking-wide">
          Create a new encounter to begin your session
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <EncounterHeader />
      <InitiativeTracker />
    </div>
  );
}
