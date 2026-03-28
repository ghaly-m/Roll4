import { useState } from 'react';
import type { Character } from '../../types';
import { useEncounterStore } from '../../store/encounterStore';
import { HpDisplay } from '../hp/HpDisplay';
import { HpBar } from '../hp/HpBar';
import { HpModifier } from '../hp/HpModifier';
import { ConditionManager } from '../conditions/ConditionManager';
import { MonsterStatBlockDisplay } from '../monsters/MonsterStatBlock';

interface InitiativeRowProps {
  character: Character;
  isActive: boolean;
}

export function InitiativeRow({ character, isActive }: InitiativeRowProps) {
  const removeCharacter = useEncounterStore((s) => s.removeCharacter);
  const removeCondition = useEncounterStore((s) => s.removeCondition);
  const updateInitiative = useEncounterStore((s) => s.updateInitiative);
  const [expanded, setExpanded] = useState(false);
  const [editingInit, setEditingInit] = useState(false);
  const [initValue, setInitValue] = useState(String(character.initiative));

  const typeLabel = character.type === 'pc' ? 'PC' : character.type === 'npc' ? 'NPC' : 'MON';
  const typeBg = character.type === 'pc' ? 'bg-emerald/20 text-emerald' : character.type === 'npc' ? 'bg-gold/20 text-gold' : 'bg-crimson/20 text-crimson';

  return (
    <div className={`rounded-lg border transition-all ${isActive ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-parchment/10 bg-parchment/5'}`}>
      <div className="p-3">
        <div className="flex items-center gap-3 mb-2">
          {editingInit ? (
            <input
              autoFocus
              type="number"
              value={initValue}
              onChange={(e) => setInitValue(e.target.value)}
              onBlur={() => {
                updateInitiative(character.id, parseInt(initValue) || 0);
                setEditingInit(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateInitiative(character.id, parseInt(initValue) || 0);
                  setEditingInit(false);
                }
                if (e.key === 'Escape') {
                  setInitValue(String(character.initiative));
                  setEditingInit(false);
                }
              }}
              className="w-10 text-xl font-bold font-mono text-gold bg-ink border border-gold/50 rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
          ) : (
            <span
              className="text-xl font-bold font-mono text-gold w-8 text-center cursor-pointer hover:text-gold-dark"
              onClick={() => { setInitValue(String(character.initiative)); setEditingInit(true); }}
              title="Click to edit initiative"
            >
              {character.initiative}
            </span>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${typeBg}`}>{typeLabel}</span>
              <span className="font-medium text-parchment truncate">{character.name}</span>
              {character.armorClass != null && (
                <span className="text-xs text-steel" title="Armor Class">AC {character.armorClass}</span>
              )}
              {isActive && <span className="text-xs text-gold animate-pulse">&#9654;</span>}
            </div>
          </div>

          <HpDisplay current={character.currentHp} max={character.maxHp} temp={character.tempHp} />

          <button
            onClick={() => removeCharacter(character.id)}
            className="text-parchment/30 hover:text-crimson transition-colors text-sm"
            title="Remove character"
          >
            ✕
          </button>
        </div>

        <div className="mb-2">
          <HpBar current={character.currentHp} max={character.maxHp} temp={character.tempHp} />
        </div>

        <div className="flex items-start justify-between gap-2 flex-wrap">
          <HpModifier characterId={character.id} />
          <ConditionManager
            characterId={character.id}
            conditions={character.conditions}
            onRemove={(instanceId) => removeCondition(character.id, instanceId)}
          />
        </div>

        {character.statBlock && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-steel hover:text-parchment transition-colors"
          >
            {expanded ? '▾ Hide Stat Block' : '▸ Show Stat Block'}
          </button>
        )}
      </div>

      {expanded && character.statBlock && (
        <MonsterStatBlockDisplay statBlock={character.statBlock} />
      )}
    </div>
  );
}
