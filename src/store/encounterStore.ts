import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, NewCharacter, Encounter, AppliedCondition } from '../types';
import { generateId } from '../utils/id';
import { sortByInitiative } from '../utils/initiative';
import { applyDamage, applyHealing } from '../utils/hp';

interface EncounterStore {
  encounter: Encounter | null;

  // Encounter lifecycle
  newEncounter: (name: string) => void;
  deleteEncounter: () => void;

  // Initiative actions
  addCharacter: (char: NewCharacter) => void;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  updateInitiative: (id: string, initiative: number) => void;

  // Turn actions
  nextTurn: () => void;
  prevTurn: () => void;
  resetEncounter: () => void;

  // HP actions
  dealDamage: (id: string, amount: number) => void;
  heal: (id: string, amount: number) => void;
  setTempHp: (id: string, amount: number) => void;

  // Condition actions
  addCondition: (charId: string, condition: Omit<AppliedCondition, 'instanceId'>) => void;
  removeCondition: (charId: string, instanceId: string) => void;
  tickConditionTimers: () => void;
}

function updateCharInEncounter(encounter: Encounter, charId: string, updater: (char: Character) => Character): Encounter {
  return {
    ...encounter,
    updatedAt: new Date().toISOString(),
    characters: encounter.characters.map(c => c.id === charId ? updater(c) : c),
  };
}

export const useEncounterStore = create<EncounterStore>()(
  persist(
    (set) => ({
      encounter: null,

      newEncounter: (name) => set({
        encounter: {
          id: generateId(),
          name,
          characters: [],
          currentTurnIndex: 0,
          round: 1,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),

      deleteEncounter: () => set({ encounter: null }),

      addCharacter: (char) => set((state) => {
        if (!state.encounter) return state;
        const newChar: Character = { ...char, id: generateId(), conditions: [] };
        return {
          encounter: {
            ...state.encounter,
            updatedAt: new Date().toISOString(),
            characters: [...state.encounter.characters, newChar],
          },
        };
      }),

      removeCharacter: (id) => set((state) => {
        if (!state.encounter) return state;
        const chars = state.encounter.characters.filter(c => c.id !== id);
        const sorted = sortByInitiative(chars);
        const currentTurnIndex = Math.min(state.encounter.currentTurnIndex, Math.max(0, sorted.length - 1));
        return {
          encounter: {
            ...state.encounter,
            updatedAt: new Date().toISOString(),
            characters: chars,
            currentTurnIndex,
          },
        };
      }),

      updateCharacter: (id, updates) => set((state) => {
        if (!state.encounter) return state;
        return { encounter: updateCharInEncounter(state.encounter, id, (c) => ({ ...c, ...updates })) };
      }),

      updateInitiative: (id, initiative) => set((state) => {
        if (!state.encounter) return state;
        return { encounter: updateCharInEncounter(state.encounter, id, (c) => ({ ...c, initiative })) };
      }),

      nextTurn: () => set((state) => {
        if (!state.encounter || state.encounter.characters.length === 0) return state;
        const sorted = sortByInitiative(state.encounter.characters);
        const nextIndex = state.encounter.currentTurnIndex + 1;
        const isNewRound = nextIndex >= sorted.length;

        let encounter: Encounter = {
          ...state.encounter,
          isActive: true,
          currentTurnIndex: isNewRound ? 0 : nextIndex,
          round: isNewRound ? state.encounter.round + 1 : state.encounter.round,
          updatedAt: new Date().toISOString(),
        };

        // Tick condition timers on new round
        if (isNewRound) {
          encounter = {
            ...encounter,
            characters: encounter.characters.map(c => ({
              ...c,
              conditions: c.conditions
                .map(cond => cond.roundsRemaining !== null
                  ? { ...cond, roundsRemaining: cond.roundsRemaining - 1 }
                  : cond)
                .filter(cond => cond.roundsRemaining === null || cond.roundsRemaining > 0),
            })),
          };
        }

        return { encounter };
      }),

      prevTurn: () => set((state) => {
        if (!state.encounter || state.encounter.characters.length === 0) return state;
        const sorted = sortByInitiative(state.encounter.characters);
        const prevIndex = state.encounter.currentTurnIndex - 1;
        const isPrevRound = prevIndex < 0;

        return {
          encounter: {
            ...state.encounter,
            currentTurnIndex: isPrevRound ? sorted.length - 1 : prevIndex,
            round: isPrevRound ? Math.max(1, state.encounter.round - 1) : state.encounter.round,
            updatedAt: new Date().toISOString(),
          },
        };
      }),

      resetEncounter: () => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: {
            ...state.encounter,
            currentTurnIndex: 0,
            round: 1,
            isActive: false,
            updatedAt: new Date().toISOString(),
            characters: state.encounter.characters.map(c => ({
              ...c,
              currentHp: c.maxHp,
              tempHp: 0,
              conditions: [],
            })),
          },
        };
      }),

      dealDamage: (id, amount) => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: updateCharInEncounter(state.encounter, id, (c) => {
            const result = applyDamage(c.currentHp, c.tempHp, amount);
            return { ...c, ...result };
          }),
        };
      }),

      heal: (id, amount) => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: updateCharInEncounter(state.encounter, id, (c) => ({
            ...c,
            currentHp: applyHealing(c.currentHp, c.maxHp, amount),
          })),
        };
      }),

      setTempHp: (id, amount) => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: updateCharInEncounter(state.encounter, id, (c) => ({
            ...c,
            tempHp: Math.max(0, amount),
          })),
        };
      }),

      addCondition: (charId, condition) => set((state) => {
        if (!state.encounter) return state;
        const appliedCondition: AppliedCondition = {
          ...condition,
          instanceId: generateId(),
        };
        return {
          encounter: updateCharInEncounter(state.encounter, charId, (c) => ({
            ...c,
            conditions: [...c.conditions, appliedCondition],
          })),
        };
      }),

      removeCondition: (charId, instanceId) => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: updateCharInEncounter(state.encounter, charId, (c) => ({
            ...c,
            conditions: c.conditions.filter(cond => cond.instanceId !== instanceId),
          })),
        };
      }),

      tickConditionTimers: () => set((state) => {
        if (!state.encounter) return state;
        return {
          encounter: {
            ...state.encounter,
            characters: state.encounter.characters.map(c => ({
              ...c,
              conditions: c.conditions
                .map(cond => cond.roundsRemaining !== null
                  ? { ...cond, roundsRemaining: cond.roundsRemaining - 1 }
                  : cond)
                .filter(cond => cond.roundsRemaining === null || cond.roundsRemaining > 0),
            })),
          },
        };
      }),
    }),
    {
      name: 'roll4-encounter',
      version: 1,
      partialize: (state) => ({ encounter: state.encounter }),
    }
  )
);
