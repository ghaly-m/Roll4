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
    <div className="absolute z-10 top-full left-0 mt-1 w-64 bg-ink border border-parchment/20 rounded-lg shadow-xl p-2">
      <input
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search conditions..."
        className="w-full px-2 py-1.5 text-xs rounded bg-ink-light/50 border border-parchment/10 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold mb-2"
      />
      <div className="flex items-center gap-2 mb-2 px-1">
        <label className="text-xs text-parchment/50">Rounds:</label>
        <input
          type="number"
          min="1"
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
          placeholder="∞"
          className="w-12 px-1.5 py-0.5 text-xs rounded bg-ink-light/50 border border-parchment/10 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => handleAdd(c.id)}
            className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-royal/10 text-parchment transition-colors"
            title={c.description}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
