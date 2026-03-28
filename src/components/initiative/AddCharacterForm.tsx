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

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 p-3 bg-parchment/5 rounded-lg border border-parchment/10">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-parchment/50 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name"
            className="w-full px-2 py-1.5 text-sm rounded bg-ink border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold"
          />
        </div>
        <div className="w-16">
          <label className="block text-xs text-parchment/50 mb-1">Init</label>
          <input
            type="number"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1.5 text-sm rounded bg-ink border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="w-16">
          <label className="block text-xs text-parchment/50 mb-1">AC</label>
          <input
            type="number"
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1.5 text-sm rounded bg-ink border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="w-16">
          <label className="block text-xs text-parchment/50 mb-1">HP</label>
          <input
            type="number"
            value={maxHp}
            onChange={(e) => setMaxHp(e.target.value)}
            placeholder="0"
            className="w-full px-2 py-1.5 text-sm rounded bg-ink border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="w-20">
          <label className="block text-xs text-parchment/50 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CharacterType)}
            className="w-full px-2 py-1.5 text-sm rounded bg-ink border border-parchment/20 text-parchment focus:outline-none focus:border-gold"
          >
            <option value="pc">PC</option>
            <option value="npc">NPC</option>
            <option value="monster">Monster</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 text-sm rounded bg-gold text-ink font-medium hover:bg-gold-dark transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setShowMonsterSearch(true)}
          className="px-3 py-1.5 text-sm rounded bg-crimson/20 text-crimson hover:bg-crimson/30 transition-colors"
          title="Search Open5e for a monster"
        >
          Lookup Monster
        </button>
      </form>

      {showMonsterSearch && (
        <MonsterSearch onClose={() => setShowMonsterSearch(false)} />
      )}
    </>
  );
}
