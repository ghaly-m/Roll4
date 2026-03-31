import { useState } from 'react';
import type { AppliedCondition } from '../../types';
import { ConditionBadge } from './ConditionBadge';
import { ConditionPicker } from './ConditionPicker';

interface ConditionManagerProps {
  characterId: string;
  conditions: AppliedCondition[];
  onRemove: (instanceId: string) => void;
}

export function ConditionManager({ characterId, conditions, onRemove }: ConditionManagerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative flex flex-wrap items-center gap-1.5">
      {conditions.map(c => (
        <ConditionBadge
          key={c.instanceId}
          condition={c}
          onRemove={() => onRemove(c.instanceId)}
        />
      ))}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="inline-flex items-center justify-center w-6 h-6 text-xs rounded border border-dashed border-ash/20 text-ash/40 hover:border-arcane/40 hover:text-arcane hover:bg-arcane/5 transition-all duration-200"
        title="Add condition"
      >
        +
      </button>
      {showPicker && (
        <ConditionPicker characterId={characterId} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}
