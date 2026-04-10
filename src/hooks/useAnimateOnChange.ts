import { useEffect, useRef, useState } from 'react';

/**
 * Returns true briefly when the watched value changes.
 * Used for triggering one-shot CSS animations (e.g. round counter pulse).
 */
export function useAnimateOnChange(value: number | string, durationMs = 800): boolean {
  const prevValue = useRef(value);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (prevValue.current !== value && prevValue.current !== undefined) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setAnimating(true);
      timerRef.current = setTimeout(() => setAnimating(false), durationMs);
    }
    prevValue.current = value;

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, durationMs]);

  return animating;
}
