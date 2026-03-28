import type { MonsterStatBlock } from '../types';

const BASE_URL = 'https://api.open5e.com/v1';

interface Open5eSearchResult {
  count: number;
  results: Open5eMonsterSummary[];
}

export interface Open5eMonsterSummary {
  slug: string;
  name: string;
  size: string;
  type: string;
  challenge_rating: string;
  hit_points: number;
  armor_class: number;
}

const statBlockCache = new Map<string, MonsterStatBlock>();

export async function searchMonsters(query: string, signal?: AbortSignal): Promise<Open5eMonsterSummary[]> {
  if (!query.trim()) return [];

  const fields = 'fields=slug,name,size,type,challenge_rating,hit_points,armor_class';

  // Search by exact name first, then by fuzzy search, and merge (exact matches on top)
  const [exactRes, searchRes] = await Promise.all([
    fetch(`${BASE_URL}/monsters/?name=${encodeURIComponent(query)}&limit=5&${fields}`, { signal }),
    fetch(`${BASE_URL}/monsters/?search=${encodeURIComponent(query)}&limit=15&${fields}`, { signal }),
  ]);

  if (!exactRes.ok || !searchRes.ok) throw new Error(`Open5e API error`);

  const [exactData, searchData]: [Open5eSearchResult, Open5eSearchResult] = await Promise.all([
    exactRes.json(),
    searchRes.json(),
  ]);

  // Merge: exact matches first, then search results (deduplicated)
  const seen = new Set<string>();
  const merged: Open5eMonsterSummary[] = [];
  for (const m of [...exactData.results, ...searchData.results]) {
    if (!seen.has(m.slug)) {
      seen.add(m.slug);
      merged.push(m);
    }
  }
  return merged.slice(0, 20);
}

export async function fetchMonsterStatBlock(slug: string): Promise<MonsterStatBlock> {
  const cached = statBlockCache.get(slug);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/monsters/${slug}/`);
  if (!res.ok) throw new Error(`Open5e API error: ${res.status}`);

  const data = await res.json();
  const statBlock: MonsterStatBlock = {
    slug: data.slug,
    name: data.name,
    size: data.size,
    type: data.type,
    armor_class: data.armor_class,
    hit_points: data.hit_points,
    hit_dice: data.hit_dice,
    speed: data.speed,
    strength: data.strength,
    dexterity: data.dexterity,
    constitution: data.constitution,
    intelligence: data.intelligence,
    wisdom: data.wisdom,
    charisma: data.charisma,
    skills: data.skills || {},
    damage_vulnerabilities: data.damage_vulnerabilities,
    damage_resistances: data.damage_resistances,
    damage_immunities: data.damage_immunities,
    condition_immunities: data.condition_immunities,
    senses: data.senses,
    languages: data.languages,
    challenge_rating: data.challenge_rating,
    actions: data.actions || [],
    special_abilities: data.special_abilities || [],
    legendary_actions: data.legendary_actions || [],
    reactions: data.reactions || [],
    lair_actions: data.lair_actions || [],
    regional_effects: data.regional_effects || [],
    mythic_actions: data.mythic_actions || [],
  };

  statBlockCache.set(slug, statBlock);
  return statBlock;
}
