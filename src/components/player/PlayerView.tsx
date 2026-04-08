import { useEffect } from 'react';
import { useEncounterStore } from '../../store/encounterStore';
import { PlayerInitiativeList } from './PlayerInitiativeList';

export function PlayerView() {
  const encounter = useEncounterStore((s) => s.encounter);

  // Sync state from DM tab via localStorage storage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'roll4-encounter' && e.newValue) {
        useEncounterStore.persist.rehydrate();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="grimoire-bg" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="font-display text-2xl font-bold tracking-[0.15em] uppercase">
            <span className="text-amber text-shadow-glow">Roll4</span>
          </h1>

          {encounter ? (
            <>
              <p className="font-display text-sm tracking-[0.2em] uppercase text-ash mt-1">
                {encounter.name}
              </p>
              <div className="divider-ornament mt-6">
                <span className="font-display text-[10px] tracking-[0.5em] uppercase">
                  &#10022;
                </span>
              </div>

              {/* Round counter */}
              <div className="mt-6">
                <span className="font-display text-xs tracking-[0.3em] uppercase text-ash/50">
                  {encounter.isActive ? (
                    <>
                      <span className="text-amber/60">&#9876;</span>
                      {' '}Round {encounter.round}{' '}
                      <span className="text-amber/60">&#9876;</span>
                    </>
                  ) : (
                    'Awaiting Combat'
                  )}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm tracking-[0.2em] text-slate mt-1 font-display uppercase">
              Player View
            </p>
          )}
        </header>

        {/* DM link — subtle, bottom-right */}
        <a
          href="#/dm"
          className="fixed bottom-4 right-4 z-10 font-display text-[10px] tracking-[0.3em] uppercase text-ash/20 hover:text-ash/50 transition-colors duration-300"
        >
          DM
        </a>

        {/* Content */}
        {encounter ? (
          encounter.characters.length > 0 ? (
            <PlayerInitiativeList encounter={encounter} />
          ) : (
            <div className="text-center py-20">
              <p className="text-ash/40 text-sm tracking-wide font-display uppercase">
                Waiting for combatants...
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-32 animate-fade-up">
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
              No Active Encounter
            </h2>
            <p className="text-ash/40 text-sm tracking-wide">
              Waiting for the DM to start an encounter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
