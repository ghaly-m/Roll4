import { useState, type ReactNode } from 'react';

const STORAGE_KEY = 'roll4-dm-password';

interface DmAuthGateProps {
  children: ReactNode;
}

export function DmAuthGate({ children }: DmAuthGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const stored = localStorage.getItem(STORAGE_KEY);
  const [mode] = useState<'set' | 'enter'>(stored ? 'enter' : 'set');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  if (unlocked) return <>{children}</>;

  const handleSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password cannot be empty');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    localStorage.setItem(STORAGE_KEY, password);
    setUnlocked(true);
  };

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === stored) {
      setUnlocked(true);
    } else {
      setError('The seal holds. Try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="grimoire-bg" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 animate-fade-up">
        <div className="card-ornate rounded-lg border border-slate/40 bg-obsidian/80 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-xl font-bold tracking-[0.15em] uppercase text-amber text-shadow-glow mb-2">
              Roll4
            </h1>
            <div className="divider-ornament mb-4">
              <span className="font-display text-[10px] tracking-[0.5em] uppercase">
                &#10022;
              </span>
            </div>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-ash/60">
              {mode === 'set' ? 'Seal Your Grimoire' : 'Speak the Word of Power'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'set' ? handleSet : handleEnter} className="space-y-4">
            <div>
              <label className="block font-display text-[10px] tracking-[0.15em] uppercase text-ash/50 mb-1.5">
                {mode === 'set' ? 'Choose Password' : 'Password'}
              </label>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 text-sm rounded bg-void border border-slate/40 text-bone placeholder:text-ash/40 focus:border-amber transition-colors font-body"
                placeholder="Enter password..."
              />
            </div>

            {mode === 'set' && (
              <div>
                <label className="block font-display text-[10px] tracking-[0.15em] uppercase text-ash/50 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                  className="w-full px-4 py-2.5 text-sm rounded bg-void border border-slate/40 text-bone placeholder:text-ash/40 focus:border-amber transition-colors font-body"
                  placeholder="Confirm password..."
                />
              </div>
            )}

            {error && (
              <p className="text-blood text-xs font-display tracking-wider text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-5 py-2.5 text-sm font-display tracking-wider uppercase rounded bg-amber text-void font-semibold hover:bg-amber-dark transition-all duration-200 shadow-lg shadow-amber/20"
            >
              {mode === 'set' ? 'Set Password' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
