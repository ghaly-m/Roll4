import type { Character } from './character';

export interface Encounter {
  id: string;
  name: string;
  sessionCode: string;
  characters: Character[];
  currentTurnIndex: number;
  round: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedEncounterEntry {
  id: string;
  name: string;
  savedAt: string;
  encounter: Encounter;
}
