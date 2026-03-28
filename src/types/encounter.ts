import type { Character } from './character';

export interface Encounter {
  id: string;
  name: string;
  characters: Character[];
  currentTurnIndex: number;
  round: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
