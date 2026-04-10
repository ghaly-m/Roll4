import type { Character } from '../../types';
import { CONDITIONS_5E } from '../../data/conditions5e';
import { HpBar } from '../hp/HpBar';
import { getHpStatus, hpStatusColor } from '../../utils/hpStatus';
import { useHpFlash } from '../../hooks/useHpFlash';

interface PlayerCharacterCardProps {
  character: Character;
  isActive: boolean;
}

export function PlayerCharacterCard({ character, isActive }: PlayerCharacterCardProps) {
  const isDowned = character.currentHp <= 0;
  const isPC = character.type === 'pc';
  const status = getHpStatus(character.currentHp, character.maxHp);
  const hpFlash = useHpFlash(character.currentHp, character.maxHp);

  const flashClass =
    hpFlash === 'damage' ? 'animate-damage-flash' :
    hpFlash === 'heal' ? 'animate-heal-glow' :
    hpFlash === 'death' ? 'animate-death' : '';

  const typeConfig = {
    pc: { label: 'PC', border: 'border-verdant/40', text: 'text-verdant', bg: 'bg-verdant/10', cardBg: 'bg-obsidian/40', activeBorder: 'border-frost/50', activeBg: 'bg-frost/[0.05]', activeGlow: 'glow-active-frost', activeText: 'text-frost' },
    npc: { label: 'NPC', border: 'border-amber/40', text: 'text-amber', bg: 'bg-amber/10', cardBg: 'bg-obsidian/40', activeBorder: 'border-amber/50', activeBg: 'bg-amber/[0.05]', activeGlow: 'glow-active', activeText: 'text-amber' },
    monster: { label: 'MON', border: 'border-blood/40', text: 'text-blood', bg: 'bg-blood/10', cardBg: 'bg-blood/[0.04]', activeBorder: 'border-blood/50', activeBg: 'bg-blood/[0.06]', activeGlow: 'glow-active-blood', activeText: 'text-blood' },
  }[character.type];

  return (
    <div
      className={`
        card-ornate rounded-lg border card-turn-enter
        ${isActive
          ? `${typeConfig.activeBorder} ${typeConfig.activeBg} ${typeConfig.activeGlow} player-card-active`
          : isDowned
            ? 'border-blood/20 bg-blood/[0.02] opacity-50 is-downed'
            : `border-slate/20 ${typeConfig.cardBg}`
        }
        ${flashClass}
      `}
    >
      <div className={`p-5 ${isActive ? 'py-6' : ''}`}>
        {/* Top row: Initiative + Name + Type badge */}
        <div className="flex items-center gap-4">
          {/* Initiative score or active diamond */}
          {isActive ? (
            <div className="w-12 h-12 flex items-center justify-center">
              <span className={`rune-shimmer ${typeConfig.activeText} text-2xl`}>&#9670;</span>
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold font-mono text-amber/70">
              {character.initiative}
            </div>
          )}

          {/* Character info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-display tracking-[0.15em] uppercase px-2 py-0.5 rounded ${typeConfig.border} ${typeConfig.text} ${typeConfig.bg} border`}>
                {typeConfig.label}
              </span>
              <span className={`font-display font-semibold tracking-wide truncate ${isActive ? 'text-lg text-parchment' : 'text-base text-bone'} ${isDowned ? 'text-blood/60 line-through' : ''}`}>
                {character.name}
              </span>
              {isActive && (
                <span className={`text-[10px] font-display tracking-[0.2em] uppercase ${typeConfig.activeText} opacity-60 ml-auto shrink-0`}>
                  Current Turn
                </span>
              )}
            </div>

            {/* HP row */}
            <div className="mt-2 flex items-center gap-3">
              {isPC ? (
                <>
                  {/* PCs: show exact HP */}
                  <div className="flex items-baseline gap-1 text-sm font-mono tabular-nums">
                    <span className={hpStatusColor[status]}>{character.currentHp}</span>
                    <span className="text-ash/30">/</span>
                    <span className="text-ash/60">{character.maxHp}</span>
                    {character.tempHp > 0 && (
                      <span className="text-arcane text-xs ml-1 font-semibold">(+{character.tempHp})</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <HpBar current={character.currentHp} max={character.maxHp} temp={character.tempHp} />
                  </div>
                </>
              ) : (
                /* Monsters/NPCs: show status word only */
                <span className={`text-sm font-display tracking-wider uppercase ${hpStatusColor[status]}`}>
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Conditions */}
        {character.conditions.length > 0 && (
          <div className="mt-3 ml-16 flex flex-wrap gap-1.5">
            {character.conditions.map((cond) => {
              const def = CONDITIONS_5E.find(c => c.id === cond.conditionId);
              if (!def) return null;
              return (
                <span
                  key={cond.instanceId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-display tracking-wider uppercase rounded border border-arcane/30 bg-arcane/10 text-arcane animate-condition-in"
                  title={def.description}
                >
                  {def.name}
                  {cond.roundsRemaining !== null && (
                    <span className="text-arcane/50 font-mono text-[10px] normal-case tracking-normal">
                      {cond.roundsRemaining}r
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
