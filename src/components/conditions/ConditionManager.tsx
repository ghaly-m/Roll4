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
    <div className="relative flex flex-wrap items-center gap-1">
      {conditions.map(c => (
        <ConditionBadge
          key={c.instanceId}
          condition={c}
          onRemove={() => onRemove(c.instanceId)}
        />
      ))}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-parchment/10 text-parchment/50 hover:bg-parchment/20 hover:text-parchment transition-colors"
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
