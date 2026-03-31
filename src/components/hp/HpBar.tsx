export function HpBar({ current, max, temp }: { current: number; max: number; temp: number }) {
  const hpPercent = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const tempPercent = max > 0 ? Math.min((temp / max) * 100, 100 - hpPercent) : 0;

  let barClass = 'hp-bar-healthy';
  if (hpPercent <= 25) barClass = 'hp-bar-critical';
  else if (hpPercent <= 50) barClass = 'hp-bar-wounded';

  return (
    <div className="w-full h-1.5 bg-void-light rounded-full overflow-hidden">
      <div className="h-full flex">
        <div
          className={`${barClass} transition-all duration-500 ease-out rounded-l-full`}
          style={{ width: `${hpPercent}%` }}
        />
        {tempPercent > 0 && (
          <div
            className="hp-bar-temp transition-all duration-500 ease-out"
            style={{ width: `${tempPercent}%` }}
          />
        )}
      </div>
    </div>
  );
}
