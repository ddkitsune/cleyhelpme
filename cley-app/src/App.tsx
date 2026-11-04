import { useState, useEffect } from 'react';
import { WelcomeView } from './views/WelcomeView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import AssistantView from './views/AssistantView';
import { LessonsView } from './views/LessonsView';
import { MedicationsView } from './views/MedicationsView';
import { SOSView } from './views/SOSView';
import { EvaluationView } from './views/EvaluationView';
import { ApiService } from './services/api';
import { StorageService } from './services/storage';

export function App() {
  const [currentView, setCurrentView] = useState<string>('loading');

  useEffect(() => {
    const initApp = async () => {
      try {
        await ApiService.initialize();
        const isDone = await StorageService.get<boolean>('cley_onboarding_completed', false);
        const profile = await ApiService.getStoredProfile();

        // Si ya completó el registro con su nombre, entra directo a la pantalla principal
        if (isDone && profile && profile.nombre && profile.nombre !== 'Amigo') {
          setCurrentView('dashboard');
        } else {
          setCurrentView('welcome');
        }
      } catch {
        setCurrentView('welcome');
      }
    };

    initApp();
  }, []);

  if (currentView === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 16,
          backgroundColor: '#F8FAFC',
        }}
      >
        <div style={{ fontSize: 44 }}>👵🏼📱</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#D9480F' }}>
          Abriendo Cley's HelpMe...
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentView === 'welcome' && (
        <WelcomeView onStart={() => setCurrentView('onboarding')} />
      )}
      {currentView === 'onboarding' && (
        <OnboardingView onComplete={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'dashboard' && (
        <DashboardView onNavigate={(view) => setCurrentView(view)} />
      )}
      {currentView === 'assistant' && (
        <AssistantView onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'lessons' && (
        <LessonsView onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'medications' && (
        <MedicationsView onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'sos' && (
        <SOSView onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'evaluation' && (
        <EvaluationView onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}

export default App;
