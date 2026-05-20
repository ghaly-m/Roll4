import { useState } from 'react';

interface SessionJoinProps {
  onJoin: (code: string) => void;
}

export function SessionJoin({ onJoin }: SessionJoinProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) onJoin(trimmed);
  };

  return (
    <div className="text-center py-32 animate-fade-up">
      <div className="inline-block mb-8 relative">
        <svg width="80" height="80" viewBox="0 0 80 80" className="text-amber/15">
          <polygon
            points="40,4 72,22 72,58 40,76 8,58 8,22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <polygon
            points="40,12 64,26 64,54 40,68 16,54 16,26"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <text
            x="40"
            y="45"
            textAnchor="middle"
            fill="currentColor"
            style={{ fontSize: '16px' }}
          >
            20
          </text>
        </svg>
      </div>

      <h2 className="font-display text-2xl font-bold tracking-[0.15em] uppercase text-bone/20 mb-3">
        Join Encounter
      </h2>
      <p className="text-ash/40 text-sm tracking-wide mb-8">
        Enter the session code from your DM
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="ABCDEF"
          className="w-40 px-4 py-3 text-center text-xl font-mono tracking-[0.5em] rounded bg-obsidian border border-slate/40 text-bone placeholder:text-ash/20 focus:border-amber focus:outline-none transition-colors uppercase"
        />
        <button
          type="submit"
          disabled={code.trim().length === 0}
          className="px-6 py-2.5 text-sm font-display tracking-wider uppercase rounded bg-amber text-void font-semibold hover:bg-amber-dark transition-all duration-200 shadow-lg shadow-amber/20 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
