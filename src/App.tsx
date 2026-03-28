import { AppShell } from './components/layout/AppShell';
import { Toolbar } from './components/layout/Toolbar';
import { EncounterView } from './components/encounter/EncounterView';

function App() {
  return (
    <AppShell>
      <Toolbar />
      <EncounterView />
    </AppShell>
  );
}

export default App;
