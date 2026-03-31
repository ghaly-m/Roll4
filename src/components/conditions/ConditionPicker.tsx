import { useState } from 'react';
import { CONDITIONS_5E } from '../../data/conditions5e';
import { useEncounterStore } from '../../store/encounterStore';

interface ConditionPickerProps {
  characterId: string;
  onClose: () => void;
}

export function ConditionPicker({ characterId, onClose }: ConditionPickerProps) {
  const [search, setSearch] = useState('');
  const [rounds, setRounds] = useState('');
  const encounter = useEncounterStore((s) => s.encounter);
  const addCondition = useEncounterStore((s) => s.addCondition);

  const filtered = CONDITIONS_5E.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (conditionId: string) => {
    const roundsNum = parseInt(rounds);
    addCondition(characterId, {
      conditionId,
      roundsRemaining: isNaN(roundsNum) || roundsNum <= 0 ? null : roundsNum,
      appliedOnRound: encounter?.round ?? 1,
    });
    onClose();
  };

  return (
    <div className="absolute z-10 top-full left-0 mt-2 w-72 bg-obsidian border border-slate/30 rounded-lg shadow-2xl shadow-void/80 animate-slide-down">
      {/* Header */}
      <div className="p-3 border-b border-slate/20">
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conditions..."
          className="w-full px-3 py-1.5 text-sm rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber transition-colors font-body"
        />
        <div className="flex items-center gap-2 mt-2 px-1">
          <label className="text-[10px] font-display tracking-wider uppercase text-ash/50">
            Rounds:
          </label>
          <input
            type="number"
            min="1"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            placeholder="&#8734;"
            className="w-14 px-2 py-1 text-xs font-mono rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
          />
        </div>
      </div>

      {/* Condition list */}
      <div className="max-h-52 overflow-y-auto p-1.5">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => handleAdd(c.id)}
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-arcane/10 text-bone/80 hover:text-bone transition-colors"
            title={c.description}
          >
            {c.name}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-ash/40 text-center py-3">No conditions found</p>
        )}
      </div>
    </div>
  );
}
