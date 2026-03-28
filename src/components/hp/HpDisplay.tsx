export function HpDisplay({ current, max, temp }: { current: number; max: number; temp: number }) {
  const isDowned = current <= 0;

  return (
    <div className="flex items-baseline gap-1 text-sm font-mono">
      <span className={isDowned ? 'text-crimson font-bold' : 'text-parchment'}>
        {current}
      </span>
      <span className="text-parchment/40">/</span>
      <span className="text-parchment/60">{max}</span>
      {temp > 0 && (
        <span className="text-royal text-xs ml-1">(+{temp})</span>
      )}
    </div>
  );
}
