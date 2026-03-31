import { useState } from 'react';
import { useEncounterStore } from '../../store/encounterStore';
import { MonsterSearch } from '../monsters/MonsterSearch';
import type { CharacterType, NewCharacter } from '../../types';

export function AddCharacterForm() {
  const addCharacter = useEncounterStore((s) => s.addCharacter);
  const [showMonsterSearch, setShowMonsterSearch] = useState(false);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [ac, setAc] = useState('');
  const [maxHp, setMaxHp] = useState('');
  const [type, setType] = useState<CharacterType>('pc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const char: NewCharacter = {
      name: name.trim(),
      initiative: parseInt(initiative) || 0,
      initiativeModifier: 0,
      armorClass: parseInt(ac) || undefined,
      maxHp: parseInt(maxHp) || 0,
      currentHp: parseInt(maxHp) || 0,
      tempHp: 0,
      type,
    };

    addCharacter(char);
    setName('');
    setInitiative('');
    setAc('');
    setMaxHp('');
  };

  const inputClasses = "w-full px-3 py-2 text-sm rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber transition-colors font-body";
  const numInputClasses = `${inputClasses} text-center font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate/20 bg-obsidian/30 p-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          {/* Name */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-display tracking-[0.15em] uppercase text-ash/60 mb-1.5">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Character name"
              className={inputClasses}
            />
          </div>

          {/* Initiative */}
          <div className="w-[68px]">
            <label className="block text-[10px] font-display tracking-[0.15em] uppercase text-ash/60 mb-1.5">
              Init
            </label>
            <input
              type="number"
              value={initiative}
              onChange={(e) => setInitiative(e.target.value)}
              placeholder="0"
              className={numInputClasses}
            />
          </div>

          {/* AC */}
          <div className="w-[68px]">
            <label className="block text-[10px] font-display tracking-[0.15em] uppercase text-ash/60 mb-1.5">
              AC
            </label>
            <input
              type="number"
              value={ac}
              onChange={(e) => setAc(e.target.value)}
              placeholder="—"
              className={numInputClasses}
            />
          </div>

          {/* HP */}
          <div className="w-[68px]">
            <label className="block text-[10px] font-display tracking-[0.15em] uppercase text-ash/60 mb-1.5">
              HP
            </label>
            <input
              type="number"
              value={maxHp}
              onChange={(e) => setMaxHp(e.target.value)}
              placeholder="0"
              className={numInputClasses}
            />
          </div>

          {/* Type */}
          <div className="w-[90px]">
            <label className="block text-[10px] font-display tracking-[0.15em] uppercase text-ash/60 mb-1.5">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CharacterType)}
              className="w-full px-3 py-2 text-sm rounded bg-void/60 border border-slate/30 text-bone focus:border-amber transition-colors font-body"
            >
              <option value="pc">PC</option>
              <option value="npc">NPC</option>
              <option value="monster">Monster</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-display tracking-wider uppercase rounded bg-amber/30 text-amber font-semibold border border-amber/40 hover:bg-amber/40 transition-all duration-200"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowMonsterSearch(true)}
              className="px-4 py-2 text-sm font-display tracking-wider uppercase rounded border border-arcane/40 text-arcane hover:bg-arcane/10 hover:border-arcane/60 transition-all duration-200"
              title="Search Open5e for a monster"
            >
              Lookup
            </button>
          </div>
        </div>
      </form>

      {showMonsterSearch && (
        <MonsterSearch onClose={() => setShowMonsterSearch(false)} />
      )}
    </>
  );
}
