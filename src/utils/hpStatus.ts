export type HpStatus = 'Healthy' | 'Wounded' | 'Bloodied' | 'Critical' | 'Down';

export function getHpStatus(current: number, max: number): HpStatus {
  if (current <= 0) return 'Down';
  const ratio = current / max;
  if (ratio > 0.75) return 'Healthy';
  if (ratio > 0.5) return 'Wounded';
  if (ratio > 0.25) return 'Bloodied';
  return 'Critical';
}

export const hpStatusColor: Record<HpStatus, string> = {
  Healthy: 'text-verdant',
  Wounded: 'text-amber',
  Bloodied: 'text-blood',
  Critical: 'text-blood font-bold',
  Down: 'text-blood font-bold',
};
