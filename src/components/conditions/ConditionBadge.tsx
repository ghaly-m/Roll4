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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-display tracking-wider uppercase rounded border border-arcane/30 bg-arcane/10 text-arcane cursor-default group"
      title={definition.description}
    >
      {definition.name}
      {condition.roundsRemaining !== null && (
        <span className="text-arcane/50 font-mono text-[10px] normal-case tracking-normal">
          {condition.roundsRemaining}r
        </span>
      )}
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-0 group-hover:opacity-100 text-arcane/40 hover:text-arcane transition-opacity text-xs"
      >
        &#x00d7;
      </button>
    </span>
  );
}
