import type { MonsterStatBlock, MonsterAction, MonsterAbility } from '../../types';

function AbilityScore({ label, value }: { label: string; value: number }) {
  const mod = Math.floor((value - 10) / 2);
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
  return (
    <div className="text-center">
      <div className="text-xs text-parchment/50 uppercase">{label}</div>
      <div className="text-sm font-bold">{value}</div>
      <div className="text-xs text-gold">({modStr})</div>
    </div>
  );
}

function ActionBlock({ title, actions }: { title: string; actions: (MonsterAction | MonsterAbility)[] }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="mt-3">
      <h4 className="text-sm font-bold text-crimson border-b border-crimson/30 pb-1 mb-2">{title}</h4>
      {actions.map((action, i) => (
        <div key={i} className="mb-2">
          <span className="text-sm font-semibold text-parchment">{action.name}. </span>
          <span className="text-xs text-parchment/70">{action.desc}</span>
        </div>
      ))}
    </div>
  );
}

export function MonsterStatBlockDisplay({ statBlock }: { statBlock: MonsterStatBlock }) {
  const speedStr = typeof statBlock.speed === 'object'
    ? Object.entries(statBlock.speed).map(([k, v]) => k === 'walk' ? `${v} ft.` : `${k} ${v} ft.`).join(', ')
    : String(statBlock.speed);

  return (
    <div className="border-t border-parchment/10 p-3 bg-ink/50 text-sm">
      <div className="text-xs text-parchment/50 mb-2">
        {statBlock.size} {statBlock.type} | CR {statBlock.challenge_rating}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
        <div><span className="text-parchment/50">AC:</span> {statBlock.armor_class}</div>
        <div><span className="text-parchment/50">HP:</span> {statBlock.hit_points} ({statBlock.hit_dice})</div>
        <div className="col-span-2"><span className="text-parchment/50">Speed:</span> {speedStr}</div>
      </div>

      <div className="grid grid-cols-6 gap-2 py-2 border-y border-parchment/10 mb-3">
        <AbilityScore label="STR" value={statBlock.strength} />
        <AbilityScore label="DEX" value={statBlock.dexterity} />
        <AbilityScore label="CON" value={statBlock.constitution} />
        <AbilityScore label="INT" value={statBlock.intelligence} />
        <AbilityScore label="WIS" value={statBlock.wisdom} />
        <AbilityScore label="CHA" value={statBlock.charisma} />
      </div>

      <div className="text-xs space-y-1 mb-3">
        {statBlock.damage_vulnerabilities && <div><span className="text-parchment/50">Vulnerabilities:</span> {statBlock.damage_vulnerabilities}</div>}
        {statBlock.damage_resistances && <div><span className="text-parchment/50">Resistances:</span> {statBlock.damage_resistances}</div>}
        {statBlock.damage_immunities && <div><span className="text-parchment/50">Immunities:</span> {statBlock.damage_immunities}</div>}
        {statBlock.condition_immunities && <div><span className="text-parchment/50">Condition Immunities:</span> {statBlock.condition_immunities}</div>}
        {statBlock.senses && <div><span className="text-parchment/50">Senses:</span> {statBlock.senses}</div>}
        {statBlock.languages && <div><span className="text-parchment/50">Languages:</span> {statBlock.languages}</div>}
      </div>

      <ActionBlock title="Special Abilities" actions={statBlock.special_abilities} />
      <ActionBlock title="Actions" actions={statBlock.actions} />
      <ActionBlock title="Reactions" actions={statBlock.reactions} />
      <ActionBlock title="Legendary Actions" actions={statBlock.legendary_actions} />
      <ActionBlock title="Mythic Actions" actions={statBlock.mythic_actions} />
      <ActionBlock title="Lair Actions" actions={statBlock.lair_actions} />
      <ActionBlock title="Regional Effects" actions={statBlock.regional_effects} />
    </div>
  );
}
