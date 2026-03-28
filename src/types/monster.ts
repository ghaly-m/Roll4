export interface MonsterAction {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage_dice?: string;
}

export interface MonsterAbility {
  name: string;
  desc: string;
}

export interface MonsterStatBlock {
  slug: string;
  name: string;
  size: string;
  type: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  speed: Record<string, number>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skills: Record<string, number>;
  damage_vulnerabilities: string;
  damage_resistances: string;
  damage_immunities: string;
  condition_immunities: string;
  senses: string;
  languages: string;
  challenge_rating: string;
  actions: MonsterAction[];
  special_abilities: MonsterAbility[];
  legendary_actions: MonsterAction[];
  reactions: MonsterAction[];
  lair_actions: MonsterAction[];
  regional_effects: MonsterAction[];
  mythic_actions: MonsterAction[];
}
