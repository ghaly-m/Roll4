import type { MonsterStatBlock } from '../types';

export function parseStatBlockText(text: string): MonsterStatBlock | null {
  try {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const joined = lines.join('\n');

    const name = findName(lines);
    if (!name) return null;

    // Size, type, alignment — e.g. "Medium Humanoid (Human), Chaotic Evil"
    const sizeTypeMatch = joined.match(/(Tiny|Small|Medium|Large|Huge|Gargantuan)\s+(.+?),\s*(.*?)(?:\n|$)/i);
    const size = sizeTypeMatch?.[1] || 'Medium';
    const type = sizeTypeMatch?.[2] || 'unknown';

    const ac = extractNumber(joined, /AC\s+(\d+)/) ?? 10;
    const hp = extractNumber(joined, /HP\s+(\d+)/) ?? 0;
    const hitDice = joined.match(/HP\s+\d+\s*\(([^)]+)\)/)?.[1] || '';

    const speedMatch = joined.match(/Speed\s+(.+?)(?:\n|$)/);
    const speed = parseSpeed(speedMatch?.[1] || '30 ft.');

    const str = findAbilityScore(joined, 'Str');
    const dex = findAbilityScore(joined, 'Dex');
    const con = findAbilityScore(joined, 'Con');
    const int = findAbilityScore(joined, 'Int');
    const wis = findAbilityScore(joined, 'Wis');
    const cha = findAbilityScore(joined, 'Cha');

    const skills = parseSkills(joined.match(/Skills\s+(.+?)(?:\n|$)/)?.[1] || '');
    const senses = joined.match(/Senses\s+(.+?)(?:\n|$)/)?.[1] || '';
    const languages = joined.match(/Languages\s+(.+?)(?:\n|$)/)?.[1] || '';
    const cr = joined.match(/CR\s+([\d/]+)/)?.[1] || '0';

    const resistMatch = joined.match(/Damage Resistances?\s+(.+?)(?:\n|$)/i);
    let immuneMatch = joined.match(/Damage Immunities?\s+(.+?)(?:\n|$)/i);
    const vulnerableMatch = joined.match(/Damage Vulnerabilit(?:y|ies)\s+(.+?)(?:\n|$)/i);
    let condImmuneMatch = joined.match(/Condition Immunities?\s+(.+?)(?:\n|$)/i);

    // Handle combined "Immunities" line (e.g. "Immunities Acid, Cold; Blinded, Charmed")
    if (!immuneMatch && !condImmuneMatch) {
      const combinedMatch = joined.match(/Immunities\s+(.+?)(?:\n|$)/i);
      if (combinedMatch) {
        const parsed = parseCombinedImmunities(combinedMatch[1]);
        immuneMatch = parsed.damage ? ([combinedMatch[0], parsed.damage] as RegExpMatchArray) : null;
        condImmuneMatch = parsed.condition ? ([combinedMatch[0], parsed.condition] as RegExpMatchArray) : null;
      }
    }

    // Use the raw (untrimmed) text for section parsing to preserve indentation
    const rawText = text;
    const special_abilities = parseSection(rawText, 'Traits');
    const actions = parseSection(rawText, 'Actions');
    const reactions = parseSection(rawText, 'Reactions');
    const legendary_actions = parseSection(rawText, 'Legendary Actions');
    const lair_actions = parseSection(rawText, 'Lair Actions');
    const regional_effects = parseSection(rawText, 'Regional Effects');
    const mythic_actions = parseSection(rawText, 'Mythic Actions');

    return {
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      size,
      type,
      armor_class: ac,
      hit_points: hp,
      hit_dice: hitDice,
      speed,
      strength: str,
      dexterity: dex,
      constitution: con,
      intelligence: int,
      wisdom: wis,
      charisma: cha,
      skills,
      damage_vulnerabilities: vulnerableMatch?.[1] || '',
      damage_resistances: resistMatch?.[1] || '',
      damage_immunities: immuneMatch?.[1] || '',
      condition_immunities: condImmuneMatch?.[1] || '',
      senses,
      languages,
      challenge_rating: cr,
      actions,
      special_abilities,
      legendary_actions,
      reactions,
      lair_actions,
      regional_effects,
      mythic_actions,
    };
  } catch {
    return null;
  }
}

function extractNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  return match ? parseInt(match[1]) : null;
}

function findName(lines: string[]): string | null {
  // Skip common navigation/header lines from 5e.tools
  const skipPatterns = /^(Bestiary[:\s]|Home$|Rules$|Player$|Dungeon Master$|References$|Utilities$|Settings$|Source[:\s]|---)/i;
  // Source codes: "BGDIA", "MM", "MM'25", "PHB2024", etc.
  const sourcePattern = /^[A-Z]{2,10}[''']?\d{0,4}$/;
  // Page reference: "p233", "p10"
  const pagePattern = /^p\d+/;
  const sizePattern = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\b/i;

  // Strategy 1: find the line right before the size/type line
  for (let i = 0; i < lines.length; i++) {
    if (sizePattern.test(lines[i])) {
      // Walk backwards to find the name
      for (let j = i - 1; j >= 0; j--) {
        const line = lines[j];
        if (skipPatterns.test(line) || sourcePattern.test(line) || pagePattern.test(line) || line.length < 2) continue;
        return line;
      }
    }
  }

  // Strategy 2: find a line followed by a source code
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (skipPatterns.test(line) || line.length < 2) continue;
    const nextLine = lines[i + 1];
    if (nextLine && (sourcePattern.test(nextLine) || pagePattern.test(nextLine))) {
      return line;
    }
  }

  // Strategy 3: first line before "AC" that looks like a name
  for (let i = 0; i < lines.length; i++) {
    if (/^AC\s+\d+/.test(lines[i])) {
      for (let j = i - 1; j >= 0; j--) {
        const line = lines[j];
        if (skipPatterns.test(line) || sourcePattern.test(line) || pagePattern.test(line) || sizePattern.test(line) || line.length < 2) continue;
        if (/^(Initiative|HP|Speed|mod|save)/.test(line)) continue;
        return line;
      }
    }
  }

  // Fallback: first non-junk line
  for (const line of lines) {
    if (!skipPatterns.test(line) && line.length >= 3 && line.length <= 80 && !/^\d/.test(line)) {
      return line;
    }
  }

  return null;
}

function findAbilityScore(text: string, ability: string): number {
  const pattern = new RegExp(ability + '\\s+(\\d{1,2})', 'i');
  const match = text.match(pattern);
  return match ? parseInt(match[1]) : 10;
}

function parseSpeed(speedStr: string): Record<string, number> {
  const result: Record<string, number> = {};
  const parts = speedStr.split(',').map(s => s.trim());
  for (const part of parts) {
    const match = part.match(/(?:(fly|swim|climb|burrow)\s+)?(\d+)\s*ft/i);
    if (match) {
      const type = match[1]?.toLowerCase() || 'walk';
      result[type] = parseInt(match[2]);
    }
  }
  if (Object.keys(result).length === 0) result.walk = 30;
  return result;
}

function parseSkills(skillStr: string): Record<string, number> {
  const result: Record<string, number> = {};
  const matches = skillStr.matchAll(/(\w[\w\s]*?)\s+[+](\d+)/g);
  for (const match of matches) {
    result[match[1].trim().toLowerCase()] = parseInt(match[2]);
  }
  return result;
}

// Known 5e conditions for splitting combined "Immunities" lines
const CONDITIONS = new Set([
  'blinded', 'charmed', 'deafened', 'exhaustion', 'frightened',
  'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified',
  'poisoned', 'prone', 'restrained', 'stunned', 'unconscious',
]);

function parseCombinedImmunities(text: string): { damage: string; condition: string } {
  // Split on semicolons first — often "damage types; condition types"
  const parts = text.split(';').map(s => s.trim());
  const damageParts: string[] = [];
  const conditionParts: string[] = [];

  for (const part of parts) {
    // Check if this part contains known conditions
    const words = part.split(',').map(w => w.trim().toLowerCase());
    const hasConditions = words.some(w => CONDITIONS.has(w));
    const hasDamageTypes = words.some(w => !CONDITIONS.has(w));

    if (hasConditions && !hasDamageTypes) {
      conditionParts.push(part);
    } else if (!hasConditions && hasDamageTypes) {
      damageParts.push(part);
    } else {
      // Mixed — split individually
      const dmg: string[] = [];
      const cond: string[] = [];
      for (const w of part.split(',').map(s => s.trim())) {
        if (CONDITIONS.has(w.toLowerCase())) cond.push(w);
        else dmg.push(w);
      }
      if (dmg.length) damageParts.push(dmg.join(', '));
      if (cond.length) conditionParts.push(cond.join(', '));
    }
  }

  return {
    damage: damageParts.join('; '),
    condition: conditionParts.join('; '),
  };
}

// Section end markers — anything that signals a new section or end of stat block
const SECTION_HEADERS = ['Traits', 'Actions', 'Bonus Actions', 'Reactions', 'Legendary Actions', 'Legendary Resistance', 'Lair Actions', 'Regional Effects', 'Mythic Actions'];
const END_MARKERS = ['Source:', 'Habitat:', 'Treasure:', '---'];

function parseSection(rawText: string, sectionName: string): { name: string; desc: string }[] {
  const lines = rawText.split('\n');

  // Find the section header line
  let startLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === sectionName) {
      startLine = i + 1;
      break;
    }
  }
  if (startLine === -1) return [];

  // Find the end of this section
  let endLine = lines.length;
  for (let i = startLine; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Check if this line is another section header or an end marker
    const isOtherSection = SECTION_HEADERS.some(h => h !== sectionName && trimmed === h);
    const isEndMarker = END_MARKERS.some(m => trimmed.startsWith(m));
    if (isOtherSection || isEndMarker) {
      endLine = i;
      break;
    }
  }

  // Collect lines in this section
  const sectionLines = lines.slice(startLine, endLine);

  // Parse entries: an entry starts with "Name. Description" or "Name (X/Day). Description"
  // Indented lines or continuation lines belong to the previous entry
  const entries: { name: string; desc: string }[] = [];
  const entryStartPattern = /^([A-Z][\w'''\s,/()\-–—:]+?)[.]\s+(.+)/;

  for (const line of sectionLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(entryStartPattern);
    if (match) {
      // New entry
      entries.push({
        name: match[1].trim(),
        desc: match[2].trim(),
      });
    } else if (entries.length > 0) {
      // Continuation line — append to previous entry's description
      entries[entries.length - 1].desc += ' ' + trimmed;
    }
  }

  return entries;
}
