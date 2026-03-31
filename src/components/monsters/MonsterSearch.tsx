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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm animate-backdrop" />
      <div
        className="relative w-full max-w-lg bg-obsidian border border-slate/30 rounded-lg shadow-2xl shadow-void/90 animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-amber">
              Add Monster
            </h3>
            <button
              onClick={onClose}
              className="text-ash/40 hover:text-bone text-sm w-6 h-6 flex items-center justify-center rounded hover:bg-slate/20 transition-colors"
            >
              &#x2715;
            </button>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 bg-void/40 rounded p-1">
            <button
              onClick={() => setTab('search')}
              className={`flex-1 px-4 py-1.5 text-[11px] font-display tracking-wider uppercase rounded transition-all duration-200 ${
                tab === 'search'
                  ? 'bg-amber text-void font-semibold shadow-sm'
                  : 'text-ash hover:text-bone'
              }`}
            >
              Search Open5e
            </button>
            <button
              onClick={() => setTab('paste')}
              className={`flex-1 px-4 py-1.5 text-[11px] font-display tracking-wider uppercase rounded transition-all duration-200 ${
                tab === 'paste'
                  ? 'bg-amber text-void font-semibold shadow-sm'
                  : 'text-ash hover:text-bone'
              }`}
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
              className="w-full mt-4 px-4 py-2.5 text-sm rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber transition-colors font-body"
            />
          )}
        </div>

        {/* Search results */}
        {tab === 'search' && (
          <>
            <div className="max-h-80 overflow-y-auto p-2">
              {loading && (
                <p className="text-xs text-ash/50 text-center py-8 font-display tracking-wider uppercase">
                  Searching...
                </p>
              )}
              {error && (
                <p className="text-xs text-blood text-center py-8">{error}</p>
              )}
              {!loading && !error && results.length === 0 && query.trim() && (
                <p className="text-xs text-ash/40 text-center py-8">
                  No monsters found. Try "Paste Stats" to import from 5e.tools.
                </p>
              )}
              {results.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => handleSelect(m)}
                  disabled={loadingSlug === m.slug}
                  className="w-full text-left px-4 py-3 rounded hover:bg-amber/5 transition-all duration-200 flex items-center justify-between disabled:opacity-50 group"
                >
                  <div>
                    <span className="text-sm text-bone font-semibold group-hover:text-amber transition-colors">
                      {m.name}
                    </span>
                    <span className="text-[11px] text-ash/50 ml-2 capitalize">
                      {m.size} {m.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-ash/50">
                    <span>CR {m.challenge_rating}</span>
                    <span>HP {m.hit_points}</span>
                    <span>AC {m.armor_class}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-slate/15 text-center">
              <span className="text-[10px] text-ash/30 font-display tracking-wider">
                Initiative will be set to 0 — click the number to edit after adding
              </span>
            </div>
          </>
        )}

        {/* Paste tab */}
        {tab === 'paste' && (
          <div className="p-5">
            <p className="text-xs text-ash/50 mb-3">
              Copy a stat block from 5e.tools or any source and paste it below.
            </p>
            <textarea
              autoFocus
              value={pasteText}
              onChange={(e) => { setPasteText(e.target.value); setParseError(null); }}
              placeholder="Paste stat block text here..."
              rows={12}
              className="w-full px-4 py-3 text-xs font-mono rounded bg-void/60 border border-slate/30 text-bone placeholder:text-ash/30 focus:border-amber resize-none transition-colors"
            />
            {parseError && (
              <p className="text-xs text-blood mt-2">{parseError}</p>
            )}
            <button
              onClick={handlePaste}
              disabled={!pasteText.trim()}
              className="mt-4 w-full px-4 py-2.5 text-sm font-display tracking-wider uppercase rounded bg-amber text-void font-semibold hover:bg-amber-dark disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber/10"
            >
              Parse & Add Monster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
