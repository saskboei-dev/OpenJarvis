import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar/Sidebar';
import { JarvisArcReactor } from './JarvisArcReactor';
import { useAppStore } from '../lib/store';
import { checkHealth } from '../lib/api';

export function Layout() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => checkHealth().then(setApiReachable);
    check();
    const interval = setInterval(check, 30000);
    const onFocus = () => check();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      {/* JARVIS Background Effects */}
      <div className="jarvis-bg-grid" aria-hidden="true" />
      <div className="jarvis-scanlines" aria-hidden="true" />
      
      <JarvisArcReactor apiReachable={apiReachable} />

      {/* Health check banner */}
      {apiReachable === false && (
        <div
          className="alert-banner"
        >
          <span
            className="status-dot alert"
          />
          <span>CANNOT REACH OPENJARVIS BACKEND</span>
          <button
            onClick={() => navigate('/settings')}
            className="jarvis-button text-xs ml-auto"
          >
            CHANGE URL
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 relative z-10">
        <Sidebar />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => useAppStore.getState().setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden" style={{ background: 'transparent' }}>
          <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-[2]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
