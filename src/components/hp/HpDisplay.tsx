export function HpDisplay({ current, max, temp }: { current: number; max: number; temp: number }) {
  const isDowned = current <= 0;
  const ratio = max > 0 ? current / max : 0;

  let hpColor = 'text-bone';
  if (isDowned) hpColor = 'text-blood font-bold';
  else if (ratio <= 0.25) hpColor = 'text-blood';
  else if (ratio <= 0.5) hpColor = 'text-amber';

  return (
    <div className="flex items-baseline gap-1 text-sm font-mono tabular-nums">
      <span className={hpColor}>
        {current}
      </span>
      <span className="text-ash/30">/</span>
      <span className="text-ash/60">{max}</span>
      {temp > 0 && (
        <span className="text-arcane text-xs ml-1 font-semibold">(+{temp})</span>
      )}
    </div>
  );
}
