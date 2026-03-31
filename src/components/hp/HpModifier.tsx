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

  const btnBase = "px-2 py-1 text-[10px] font-display tracking-wider uppercase rounded border transition-all duration-200";

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="HP"
        className="w-14 px-2 py-1 text-xs font-mono rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAction('damage');
        }}
      />
      <button
        onClick={() => handleAction('damage')}
        className={`${btnBase} border-blood/30 text-blood hover:bg-blood/10 hover:border-blood/50`}
        title="Deal damage"
      >
        DMG
      </button>
      <button
        onClick={() => handleAction('heal')}
        className={`${btnBase} border-verdant/30 text-verdant hover:bg-verdant/10 hover:border-verdant/50`}
        title="Heal"
      >
        HEAL
      </button>
      <button
        onClick={() => handleAction('temp')}
        className={`${btnBase} border-arcane/30 text-arcane hover:bg-arcane/10 hover:border-arcane/50`}
        title="Set temp HP"
      >
        TMP
      </button>
    </div>
  );
}
