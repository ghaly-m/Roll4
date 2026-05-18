import { useState } from 'react';
import type { Character } from '../../types';
import { useEncounterStore } from '../../store/encounterStore';
import { HpDisplay } from '../hp/HpDisplay';
import { HpBar } from '../hp/HpBar';
import { HpModifier } from '../hp/HpModifier';
import { ConditionManager } from '../conditions/ConditionManager';
import { MonsterStatBlockDisplay } from '../monsters/MonsterStatBlock';
import { useHpFlash } from '../../hooks/useHpFlash';
import { CharacterAvatar } from '../character/CharacterAvatar';

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
  const [pickerOpen, setPickerOpen] = useState(false);

  const typeConfig = {
    pc: { label: 'PC', border: 'border-verdant/40', text: 'text-verdant', bg: 'bg-verdant/10' },
    npc: { label: 'NPC', border: 'border-amber/40', text: 'text-amber', bg: 'bg-amber/10' },
    monster: { label: 'MON', border: 'border-blood/40', text: 'text-blood', bg: 'bg-blood/10' },
  }[character.type];

  const isDowned = character.currentHp <= 0;
  const hpFlash = useHpFlash(character.currentHp, character.maxHp);

  const flashClass =
    hpFlash === 'damage' ? 'animate-damage-flash' :
    hpFlash === 'heal' ? 'animate-heal-glow' :
    hpFlash === 'death' ? 'animate-death' : '';

  return (
    <div
      className={`
        card-ornate rounded-lg border card-turn-enter relative flex flex-col overflow-hidden
        ${isActive
          ? 'border-amber/40 bg-amber/[0.03] glow-active'
          : isDowned
            ? 'border-blood/20 bg-blood/[0.02] opacity-60 is-downed'
            : 'border-slate/20 bg-obsidian/40 hover:border-slate/30'
        }
        ${flashClass}
      `}
      style={pickerOpen ? { zIndex: 50 } : undefined}
    >
      {/* Main row: avatar only stretches to this row's height, not stat block */}
      <div className="flex overflow-hidden">
        <div className="relative flex-shrink-0 self-stretch w-40">
          <CharacterAvatar character={character} className="w-full h-full" />
        </div>

        <div className="flex-1 min-w-0 p-4">
          {/* Top row: Initiative + Name + HP + Remove */}
          <div className="flex items-center gap-3 mb-3">
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
                className="w-12 h-10 text-xl font-bold font-mono text-amber bg-void border border-amber/40 rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <button
                className="w-10 h-10 flex items-center justify-center text-xl font-bold font-mono text-amber hover:text-amber-dark transition-colors cursor-pointer"
                onClick={() => { setInitValue(String(character.initiative)); setEditingInit(true); }}
                title="Click to edit initiative"
              >
                {character.initiative}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-display tracking-[0.15em] uppercase px-2 py-0.5 rounded ${typeConfig.border} ${typeConfig.text} ${typeConfig.bg} border`}>
                  {typeConfig.label}
                </span>
                <span className={`font-display text-sm font-semibold tracking-wide truncate ${isDowned ? 'text-blood/60 line-through' : 'text-bone'}`}>
                  {character.name}
                </span>
                {character.armorClass != null && (
                  <span className="text-[10px] font-mono text-ash flex items-center gap-1" title="Armor Class">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="opacity-50">
                      <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 8 3.5-1.5 6-4.5 6-8V4L8 1z"/>
                    </svg>
                    {character.armorClass}
                  </span>
                )}
                {isActive && (
                  <span className="rune-shimmer text-amber text-xs ml-1">&#9670;</span>
                )}
              </div>
            </div>

            <HpDisplay current={character.currentHp} max={character.maxHp} temp={character.tempHp} />

            <button
              onClick={() => removeCharacter(character.id)}
              className="text-ash/30 hover:text-blood transition-colors text-sm w-6 h-6 flex items-center justify-center rounded hover:bg-blood/10"
              title="Remove character"
            >
              &#x2715;
            </button>
          </div>

          <div className="mb-3">
            <HpBar current={character.currentHp} max={character.maxHp} temp={character.tempHp} />
          </div>

          <div className="flex items-start justify-between gap-3 flex-wrap">
            <HpModifier characterId={character.id} />
            <ConditionManager
              characterId={character.id}
              conditions={character.conditions}
              onRemove={(instanceId) => removeCondition(character.id, instanceId)}
              onPickerToggle={setPickerOpen}
            />
          </div>

          {character.statBlock && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-[11px] font-display tracking-wider uppercase text-ash hover:text-bone transition-colors flex items-center gap-1.5"
            >
              <span className="text-amber/50">{expanded ? '▾' : '▸'}</span>
              {expanded ? 'Hide Stat Block' : 'Show Stat Block'}
            </button>
          )}
        </div>
      </div>

      {/* Stat block — full width below the row, avatar height unaffected */}
      {expanded && character.statBlock && (
        <MonsterStatBlockDisplay statBlock={character.statBlock} />
      )}
    </div>
  );
}
