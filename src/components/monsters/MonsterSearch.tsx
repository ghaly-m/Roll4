import { useState, useEffect, useRef } from 'react';
import { searchMonsters, fetchMonsterStatBlock, type Open5eMonsterSummary } from '../../api/open5e';
import { parseStatBlockText } from '../../utils/parseStatBlock';
import { useEncounterStore } from '../../store/encounterStore';
import type { NewCharacter, MonsterStatBlock } from '../../types';

type Tab = 'search' | 'paste';

interface MonsterSearchProps {
  onClose: () => void;
}

export function MonsterSearch({ onClose }: MonsterSearchProps) {
  const [tab, setTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Open5eMonsterSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const addCharacter = useEncounterStore((s) => s.addCharacter);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (tab !== 'search' || !query.trim()) {
      setResults([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMonsters(query, controller.signal);
        setResults(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to search. Check your connection.');
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, tab]);

  const addMonsterFromStatBlock = (statBlock: MonsterStatBlock) => {
    const newChar: NewCharacter = {
      name: statBlock.name,
      initiative: 0,
      initiativeModifier: 0,
      maxHp: statBlock.hit_points,
      currentHp: statBlock.hit_points,
      tempHp: 0,
      type: 'monster',
      armorClass: statBlock.armor_class,
      statBlock,
    };
    addCharacter(newChar);
    onClose();
  };

  const handleSelect = async (monster: Open5eMonsterSummary) => {
    setLoadingSlug(monster.slug);
    try {
      const statBlock = await fetchMonsterStatBlock(monster.slug);
      addMonsterFromStatBlock(statBlock);
    } catch {
      setError('Failed to load monster details.');
    } finally {
      setLoadingSlug(null);
    }
  };

  const handlePaste = () => {
    setParseError(null);
    const statBlock = parseStatBlockText(pasteText);
    if (!statBlock) {
      setParseError('Could not parse stat block. Make sure you copied the full stat block text.');
      return;
    }
    addMonsterFromStatBlock(statBlock);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md bg-ink border border-parchment/20 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-parchment/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gold">Add Monster</h3>
            <button onClick={onClose} className="text-parchment/40 hover:text-parchment text-sm">✕</button>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 mb-3 bg-ink-light/30 rounded p-0.5">
            <button
              onClick={() => setTab('search')}
              className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${tab === 'search' ? 'bg-gold text-ink font-medium' : 'text-parchment/60 hover:text-parchment'}`}
            >
              Search Open5e
            </button>
            <button
              onClick={() => setTab('paste')}
              className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${tab === 'paste' ? 'bg-gold text-ink font-medium' : 'text-parchment/60 hover:text-parchment'}`}
            >
              Paste Stats
            </button>
          </div>

          {tab === 'search' && (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name... (e.g. Goblin, Dragon)"
              className="w-full px-3 py-2 text-sm rounded bg-ink-light/50 border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold"
            />
          )}
        </div>

        {tab === 'search' && (
          <>
            <div className="max-h-80 overflow-y-auto p-2">
              {loading && <p className="text-xs text-parchment/50 text-center py-4">Searching...</p>}
              {error && <p className="text-xs text-crimson text-center py-4">{error}</p>}
              {!loading && !error && results.length === 0 && query.trim() && (
                <p className="text-xs text-parchment/50 text-center py-4">No monsters found. Try "Paste Stats" to import from 5e.tools.</p>
              )}
              {results.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => handleSelect(m)}
                  disabled={loadingSlug === m.slug}
                  className="w-full text-left px-3 py-2 rounded hover:bg-parchment/5 transition-colors flex items-center justify-between disabled:opacity-50"
                >
                  <div>
                    <span className="text-sm text-parchment font-medium">{m.name}</span>
                    <span className="text-xs text-parchment/50 ml-2">{m.size} {m.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-parchment/50">
                    <span>CR {m.challenge_rating}</span>
                    <span>HP {m.hit_points}</span>
                    <span>AC {m.armor_class}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-parchment/10 text-center">
              <span className="text-xs text-parchment/30">Initiative will be set to 0 — click the number to edit after adding</span>
            </div>
          </>
        )}

        {tab === 'paste' && (
          <div className="p-4">
            <p className="text-xs text-parchment/50 mb-2">
              Copy a stat block from 5e.tools or any source and paste it below.
            </p>
            <textarea
              autoFocus
              value={pasteText}
              onChange={(e) => { setPasteText(e.target.value); setParseError(null); }}
              placeholder="Paste stat block text here..."
              rows={12}
              className="w-full px-3 py-2 text-xs font-mono rounded bg-ink-light/50 border border-parchment/20 text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold resize-none"
            />
            {parseError && <p className="text-xs text-crimson mt-2">{parseError}</p>}
            <button
              onClick={handlePaste}
              disabled={!pasteText.trim()}
              className="mt-3 w-full px-4 py-2 text-sm rounded bg-gold text-ink font-medium hover:bg-gold-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Parse & Add Monster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
