import type { Character } from '../types';

export function buildNamedCopies(baseName: string, count: number, existingChars: Character[]): string[] {
  if (count === 1) return [baseName];
  const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^${escaped}(?: \\([A-Z]\\))?$`);
  const startIndex = existingChars.filter(c => pattern.test(c.name)).length;
  return Array.from({ length: count }, (_, i) =>
    `${baseName} (${String.fromCharCode(65 + startIndex + i)})`
  );
}
