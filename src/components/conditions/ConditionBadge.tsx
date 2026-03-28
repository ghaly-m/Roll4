import { CONDITIONS_5E } from '../../data/conditions5e';
import type { AppliedCondition } from '../../types';

interface ConditionBadgeProps {
  condition: AppliedCondition;
  onRemove: () => void;
}

export function ConditionBadge({ condition, onRemove }: ConditionBadgeProps) {
  const definition = CONDITIONS_5E.find(c => c.id === condition.conditionId);
  if (!definition) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-royal/20 text-royal border border-royal/30 cursor-default group"
      title={definition.description}
    >
      {definition.name}
      {condition.roundsRemaining !== null && (
        <span className="text-royal/60">{condition.roundsRemaining}r</span>
      )}
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-0 group-hover:opacity-100 text-royal/60 hover:text-royal transition-opacity"
      >
        ×
      </button>
    </span>
  );
}
