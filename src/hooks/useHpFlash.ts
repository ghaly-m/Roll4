import { useEffect, useRef, useState } from 'react';

type FlashType = 'damage' | 'heal' | 'death' | null;

/**
 * Detects HP changes and returns a flash type for animation.
 * Also tracks the "just died" moment separately from ongoing downed state.
 */
export function useHpFlash(currentHp: number, maxHp: number): FlashType {
  const prevHp = useRef(currentHp);
  const [flash, setFlash] = useState<FlashType>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = prevHp.current;
    prevHp.current = currentHp;

    // Skip initial render
    if (prev === currentHp) return;

    // Clear any pending timer
    if (timerRef.current) clearTimeout(timerRef.current);

    if (currentHp <= 0 && prev > 0) {
      setFlash('death');
      timerRef.current = setTimeout(() => setFlash(null), 1200);
    } else if (currentHp < prev) {
      setFlash('damage');
      timerRef.current = setTimeout(() => setFlash(null), 900);
    } else if (currentHp > prev) {
      setFlash('heal');
      timerRef.current = setTimeout(() => setFlash(null), 1200);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentHp, maxHp]);

  return flash;
}
