export function HpBar({ current, max, temp }: { current: number; max: number; temp: number }) {
  const hpPercent = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const tempPercent = max > 0 ? Math.min((temp / max) * 100, 100 - hpPercent) : 0;

  let barColor = 'bg-emerald';
  if (hpPercent <= 25) barColor = 'bg-crimson';
  else if (hpPercent <= 50) barColor = 'bg-gold';

  return (
    <div className="w-full h-2 bg-ink-light/50 rounded-full overflow-hidden">
      <div className="h-full flex">
        <div className={`${barColor} transition-all duration-300`} style={{ width: `${hpPercent}%` }} />
        {tempPercent > 0 && (
          <div className="bg-royal transition-all duration-300" style={{ width: `${tempPercent}%` }} />
        )}
      </div>
    </div>
  );
}
