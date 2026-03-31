import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Ambient background gradients */}
      <div className="grimoire-bg" />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
