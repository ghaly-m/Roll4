import { useEffect, useRef, useCallback } from 'react';
import PartySocket from 'partysocket';
import type { Encounter } from '../types';

const PARTYKIT_HOST = (import.meta as unknown as { env: Record<string, string> }).env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

function toPlayerEncounter(encounter: Encounter): Encounter {
  return {
    ...encounter,
    characters: encounter.characters.map((c) => ({
      id: c.id,
      name: c.name,
      initiative: c.initiative,
      initiativeModifier: c.initiativeModifier,
      maxHp: c.maxHp,
      currentHp: c.currentHp,
      tempHp: c.tempHp,
      conditions: c.conditions,
      type: c.type,
      armorClass: c.armorClass,
      notes: c.notes,
    })),
  };
}

export function useDmPartySync(sessionCode: string | undefined, encounter: Encounter | null) {
  const socketRef = useRef<PartySocket | null>(null);

  useEffect(() => {
    if (!sessionCode) return;
    const socket = new PartySocket({ host: PARTYKIT_HOST, room: sessionCode });
    socketRef.current = socket;
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [sessionCode]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !encounter) return;
    socket.send(JSON.stringify(toPlayerEncounter(encounter)));
  }, [encounter]);
}

export function usePlayerPartySync(
  sessionCode: string | null,
  onEncounter: (encounter: Encounter) => void,
) {
  const onEncounterRef = useRef(onEncounter);
  onEncounterRef.current = onEncounter;

  const stableCallback = useCallback((e: MessageEvent) => {
    try {
      const encounter = JSON.parse(e.data as string) as Encounter;
      onEncounterRef.current(encounter);
    } catch { /* ignore malformed messages */ }
  }, []);

  useEffect(() => {
    if (!sessionCode) return;
    const socket = new PartySocket({ host: PARTYKIT_HOST, room: sessionCode });
    socket.addEventListener('message', stableCallback);
    return () => socket.close();
  }, [sessionCode, stableCallback]);
}
