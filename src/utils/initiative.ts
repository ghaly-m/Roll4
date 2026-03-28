import type { Character } from '../types';

export function sortByInitiative(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    return b.initiativeModifier - a.initiativeModifier;
  });
}
