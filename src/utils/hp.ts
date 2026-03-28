export function clampHp(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

export function applyDamage(currentHp: number, tempHp: number, damage: number): { currentHp: number; tempHp: number } {
  let remaining = damage;

  let newTempHp = tempHp;
  if (newTempHp > 0) {
    const absorbed = Math.min(newTempHp, remaining);
    newTempHp -= absorbed;
    remaining -= absorbed;
  }

  const newCurrentHp = Math.max(0, currentHp - remaining);
  return { currentHp: newCurrentHp, tempHp: newTempHp };
}

export function applyHealing(currentHp: number, maxHp: number, healing: number): number {
  return Math.min(currentHp + healing, maxHp);
}
