import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Toolbar } from './components/layout/Toolbar';
import { EncounterView } from './components/encounter/EncounterView';
import { PlayerView } from './components/player/PlayerView';
import { DmAuthGate } from './components/dm/DmAuthGate';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

function App() {
  const hash = useHashRoute();

  if (hash === '#/dm') {
    return (
      <DmAuthGate>
        <AppShell>
          <Toolbar />
          <EncounterView />
        </AppShell>
      </DmAuthGate>
    );
  }

  return <PlayerView />;
}

export default App;
