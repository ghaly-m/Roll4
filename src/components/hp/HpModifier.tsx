import { useState } from 'react';
import { useEncounterStore } from '../../store/encounterStore';

export function HpModifier({ characterId }: { characterId: string }) {
  const [amount, setAmount] = useState('');
  const dealDamage = useEncounterStore((s) => s.dealDamage);
  const heal = useEncounterStore((s) => s.heal);
  const setTempHp = useEncounterStore((s) => s.setTempHp);

  const handleAction = (action: 'damage' | 'heal' | 'temp') => {
    const value = parseInt(amount);
    if (isNaN(value) || value <= 0) return;

    if (action === 'damage') dealDamage(characterId, value);
    else if (action === 'heal') heal(characterId, value);
    else setTempHp(characterId, value);

    setAmount('');
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="HP"
        className="w-14 px-2 py-1 text-xs rounded bg-ink-light/50 border border-parchment/10 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAction('damage');
        }}
      />
      <button
        onClick={() => handleAction('damage')}
        className="px-1.5 py-1 text-xs rounded bg-crimson/20 text-crimson hover:bg-crimson/30 transition-colors"
        title="Deal damage"
      >
        DMG
      </button>
      <button
        onClick={() => handleAction('heal')}
        className="px-1.5 py-1 text-xs rounded bg-emerald/20 text-emerald hover:bg-emerald/30 transition-colors"
        title="Heal"
      >
        HEAL
      </button>
      <button
        onClick={() => handleAction('temp')}
        className="px-1.5 py-1 text-xs rounded bg-royal/20 text-royal hover:bg-royal/30 transition-colors"
        title="Set temp HP"
      >
        TMP
      </button>
    </div>
  );
}
