import type { AppliedCondition } from './condition';
import type { MonsterStatBlock } from './monster';

export type CharacterType = 'pc' | 'npc' | 'monster';

export interface Character {
  id: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  conditions: AppliedCondition[];
  type: CharacterType;
  armorClass?: number;
  notes?: string;
  statBlock?: MonsterStatBlock;
}

export type NewCharacter = Omit<Character, 'id' | 'conditions'>;
