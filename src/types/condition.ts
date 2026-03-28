export interface ConditionDefinition {
  id: string;
  name: string;
  description: string;
}

export interface AppliedCondition {
  instanceId: string;
  conditionId: string;
  roundsRemaining: number | null;
  source?: string;
  appliedOnRound: number;
}
