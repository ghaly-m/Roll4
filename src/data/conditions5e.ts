import type { ConditionDefinition } from '../types';

export const CONDITIONS_5E: ConditionDefinition[] = [
  { id: 'blinded', name: 'Blinded', description: "Can't see. Auto-fail sight checks. Attacks have disadvantage; attacks against have advantage." },
  { id: 'charmed', name: 'Charmed', description: "Can't attack the charmer. Charmer has advantage on social checks." },
  { id: 'deafened', name: 'Deafened', description: "Can't hear. Auto-fail hearing checks." },
  { id: 'exhaustion', name: 'Exhaustion', description: 'Cumulative levels with increasing penalties. 6 levels = death.' },
  { id: 'frightened', name: 'Frightened', description: 'Disadvantage on ability checks and attacks while source of fear is in sight. Cannot willingly move closer.' },
  { id: 'grappled', name: 'Grappled', description: 'Speed becomes 0. Ends if grappler is incapacitated or moved out of reach.' },
  { id: 'incapacitated', name: 'Incapacitated', description: "Can't take actions or reactions." },
  { id: 'invisible', name: 'Invisible', description: "Can't be seen without magic/special sense. Attacks have advantage; attacks against have disadvantage." },
  { id: 'paralyzed', name: 'Paralyzed', description: 'Incapacitated, auto-fail STR/DEX saves. Attacks have advantage; melee hits are crits.' },
  { id: 'petrified', name: 'Petrified', description: 'Turned to stone. Weight x10. Incapacitated, auto-fail STR/DEX saves. Resistance to all damage.' },
  { id: 'poisoned', name: 'Poisoned', description: 'Disadvantage on attack rolls and ability checks.' },
  { id: 'prone', name: 'Prone', description: 'Disadvantage on attacks. Melee attacks against have advantage; ranged have disadvantage. Must spend half movement to stand.' },
  { id: 'restrained', name: 'Restrained', description: 'Speed 0. Attacks have disadvantage; attacks against have advantage. Disadvantage on DEX saves.' },
  { id: 'stunned', name: 'Stunned', description: 'Incapacitated, auto-fail STR/DEX saves. Attacks against have advantage.' },
  { id: 'unconscious', name: 'Unconscious', description: 'Incapacitated, drops items, falls prone. Auto-fail STR/DEX saves. Attacks have advantage; melee hits are crits.' },
];
