import { useState, useCallback } from 'react';
import type { Encounter } from '../../types';
import { PlayerInitiativeList } from './PlayerInitiativeList';
import { SessionJoin } from './SessionJoin';
import { usePlayerPartySync } from '../../hooks/usePartySync';
import { useAnimateOnChange } from '../../hooks/useAnimateOnChange';

const SESSION_KEY = 'roll4-session-code';

function getInitialCode(): string | null {
  const params = new URLSearchParams(window.location.search);
  const urlCode = params.get('session');
  if (urlCode) {
    sessionStorage.setItem(SESSION_KEY, urlCode);
    return urlCode;
  }
  return sessionStorage.getItem(SESSION_KEY);
}

export function PlayerView() {
  const [sessionCode, setSessionCode] = useState<string | null>(getInitialCode);
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  const onEncounter = useCallback((e: Encounter) => setEncounter(e), []);
  usePlayerPartySync(sessionCode, onEncounter);

  const isRoundPulsing = useAnimateOnChange(encounter?.round ?? 1, 800);

  const handleJoin = (code: string) => {
    sessionStorage.setItem(SESSION_KEY, code);
    setSessionCode(code);
    setEncounter(null);
  };

  const handleLeave = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSessionCode(null);
    setEncounter(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="grimoire-bg" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-10 w-full flex-1">
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

              <div className="mt-6">
                <span className="font-display text-xs tracking-[0.3em] uppercase text-ash/50">
                  {encounter.isActive ? (
                    <>
                      <span className="text-amber/60">&#9876;</span>
                      {' '}Round <span className={`inline-block ${isRoundPulsing ? 'animate-round-pulse' : ''}`}>{encounter.round}</span>{' '}
                      <span className="text-amber/60">&#9876;</span>
                    </>
                  ) : (
                    'Awaiting Combat'
                  )}
                </span>
              </div>
            </>
          ) : sessionCode ? (
            <p className="text-sm tracking-[0.2em] text-slate mt-1 font-display uppercase">
              Connecting to {sessionCode}…
            </p>
          ) : (
            <p className="text-sm tracking-[0.2em] text-slate mt-1 font-display uppercase">
              Player View
            </p>
          )}
        </header>

        {/* Content */}
        {!sessionCode ? (
          <SessionJoin onJoin={handleJoin} />
        ) : encounter ? (
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
          <div className="text-center py-20">
            <p className="text-ash/40 text-sm tracking-wide font-display uppercase animate-pulse">
              Waiting for encounter...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center flex items-center justify-center gap-6">
        {sessionCode && (
          <button
            onClick={handleLeave}
            className="inline-block px-5 py-2 font-display text-xs tracking-[0.2em] uppercase text-ash hover:text-blood border border-slate/40 hover:border-blood/40 rounded transition-all duration-200"
          >
            Leave Session
          </button>
        )}
        <a
          href="#/dm"
          className="inline-block px-5 py-2 font-display text-xs tracking-[0.2em] uppercase text-ash hover:text-amber border border-slate/40 hover:border-amber/40 rounded transition-all duration-200"
        >
          DM Login
        </a>
      </footer>
    </div>
  );
}
