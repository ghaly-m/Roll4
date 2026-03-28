import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-parchment">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
