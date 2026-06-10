import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Eye, BarChart2, Settings, Home } from 'lucide-react';

import { useDreamStore, useRCStore, useOnboardingStore, useSettingsStore, useToastStore } from './store/index.js';
import { hasPIN, LockScreen } from './components/ui/PinLock.jsx';

// Pages (lazy)
import Dashboard from './pages/Dashboard.jsx';
import Journal from './pages/Journal.jsx';
import Techniques from './pages/Techniques.jsx';
import Statistics from './pages/Statistics.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import DreamDetail from './pages/DreamDetail.jsx';
import DreamForm from './pages/DreamForm.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import TechniqueDetail from './pages/TechniqueDetail.jsx';
import DreamGoalsPage from './pages/DreamGoalsPage.jsx';
import DreamRecallPage from './pages/DreamRecallPage.jsx';
import DailyChecklist from './pages/DailyChecklist.jsx';

// Toast
function ToastLayer() {
  const { toasts } = useToastStore();
  return (
    <div className="toast-container">
      {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
    </div>
  );
}

// Bottom Navigation
function BottomNav() {
  const location = useLocation();
  const hide = ['/dream/new', '/dream/'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/techniques', icon: Eye, label: 'Techniques' },
    { to: '/stats', icon: BarChart2, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

// App Initializer
function AppInit({ children }) {
  const loadDreams = useDreamStore(s => s.loadDreams);
  const loadToday = useRCStore(s => s.loadToday);
  const loadAll = useRCStore(s => s.loadAll);
  const loadOnboarding = useOnboardingStore(s => s.load);
  const [locked, setLocked] = useState(() => hasPIN());

  useEffect(() => {
    loadDreams();
    loadToday();
    loadAll();
    loadOnboarding();
  }, []);

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <div className="app-shell">
          <ToastLayer />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/dream/:id" element={<DreamDetail />} />
            <Route path="/dream/new" element={<DreamForm />} />
            <Route path="/dream/edit/:id" element={<DreamForm editMode />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/techniques/:id" element={<TechniqueDetail />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/goals" element={<DreamGoalsPage />} />
            <Route path="/recall" element={<DreamRecallPage />} />
            <Route path="/checklist" element={<DailyChecklist />} />
          </Routes>
          <BottomNav />
        </div>
      </AppInit>
    </BrowserRouter>
  );
}
