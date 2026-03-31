import type { MonsterStatBlock, MonsterAction, MonsterAbility } from '../../types';

function AbilityScore({ label, value }: { label: string; value: number }) {
  const mod = Math.floor((value - 10) / 2);
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
  return (
    <div className="text-center">
      <div className="text-[9px] font-display tracking-[0.2em] uppercase text-ash/50">{label}</div>
      <div className="text-sm font-bold font-mono text-bone">{value}</div>
      <div className="text-[11px] font-mono text-amber/70">({modStr})</div>
    </div>
  );
}

function ActionBlock({ title, actions }: { title: string; actions: (MonsterAction | MonsterAbility)[] }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="mt-4">
      <h4 className="stat-block-header text-[11px] font-display tracking-[0.15em] uppercase font-bold text-blood rounded-r mb-2">
        {title}
      </h4>
      {actions.map((action, i) => (
        <div key={i} className="mb-2 pl-2">
          <span className="text-sm font-semibold text-bone italic">{action.name}. </span>
          <span className="text-xs text-bone/60 leading-relaxed">{action.desc}</span>
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
    <div className="border-t border-amber/10 p-4 bg-void/40 text-sm animate-fade-up">
      {/* Creature type line */}
      <div className="text-[11px] font-display tracking-wider text-ash/60 mb-3 uppercase">
        {statBlock.size} {statBlock.type} &middot; CR {statBlock.challenge_rating}
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs mb-4">
        <div>
          <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">AC </span>
          <span className="font-mono text-bone">{statBlock.armor_class}</span>
        </div>
        <div>
          <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">HP </span>
          <span className="font-mono text-bone">{statBlock.hit_points}</span>
          <span className="text-ash/30 ml-1">({statBlock.hit_dice})</span>
        </div>
        <div className="col-span-2">
          <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Speed </span>
          <span className="text-bone">{speedStr}</span>
        </div>
      </div>

      {/* Ability scores */}
      <div className="grid grid-cols-6 gap-2 py-3 border-y border-amber/10 mb-4">
        <AbilityScore label="STR" value={statBlock.strength} />
        <AbilityScore label="DEX" value={statBlock.dexterity} />
        <AbilityScore label="CON" value={statBlock.constitution} />
        <AbilityScore label="INT" value={statBlock.intelligence} />
        <AbilityScore label="WIS" value={statBlock.wisdom} />
        <AbilityScore label="CHA" value={statBlock.charisma} />
      </div>

      {/* Details */}
      <div className="text-xs space-y-1.5 mb-4">
        {statBlock.damage_vulnerabilities && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Vulnerabilities </span>
            <span className="text-bone/70">{statBlock.damage_vulnerabilities}</span>
          </div>
        )}
        {statBlock.damage_resistances && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Resistances </span>
            <span className="text-bone/70">{statBlock.damage_resistances}</span>
          </div>
        )}
        {statBlock.damage_immunities && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Immunities </span>
            <span className="text-bone/70">{statBlock.damage_immunities}</span>
          </div>
        )}
        {statBlock.condition_immunities && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Condition Immunities </span>
            <span className="text-bone/70">{statBlock.condition_immunities}</span>
          </div>
        )}
        {statBlock.senses && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Senses </span>
            <span className="text-bone/70">{statBlock.senses}</span>
          </div>
        )}
        {statBlock.languages && (
          <div>
            <span className="text-ash/40 font-display tracking-wider uppercase text-[10px]">Languages </span>
            <span className="text-bone/70">{statBlock.languages}</span>
          </div>
        )}
      </div>

      {/* Action sections */}
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
