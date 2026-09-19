import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import VantaBg from './components/VantaBg';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import MockAI from './views/MockAI';
import LandingPage from './views/LandingPage';
import ProjectDashboard from './views/ProjectDashboard'; 
import { AlertTriangle, LogOut, X, RefreshCw } from 'lucide-react';

const MainContent = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-24 lg:pb-6 lg:pr-4 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 p-4 lg:p-6 text-slate-200">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-sandbox" element={<MockAI />} />
          <Route path="/project/:id" element={<ProjectDashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isLoggedIn, handleLogout, showLogoutModal, setShowLogoutModal, isLoading } = useApp();
  const navigate = useNavigate();

  // Reset routing paths cleanly to home overview hub layout cards on fresh mount entries
  useEffect(() => {
    if (isLoggedIn && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Robust hardware back-key listener linkage tracking context changes
  useEffect(() => {
    if (!isLoggedIn) return;

    window.history.pushState(null, null, window.location.pathname);
    
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
      setShowLogoutModal(true); 
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, setShowLogoutModal]);

  // 🌌 NEW: HIGH-TECH INITIALIZATION GATEWAY PROTECTION LOCK
  // This intercepts reloads to show a fullscreen loader, completely preventing white screen crashes
  if (isLoading && !isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060913] backdrop-blur-md">
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card border border-white/10 bg-[#0b0f19]/80 text-center space-y-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-purple-400 animate-spin" />
            <RefreshCw size={14} className="text-indigo-400 animate-pulse" />
          </div>
          <h4 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">Verifying Security Clearance...</h4>
          <p className="text-[10px] text-slate-400 font-sans tracking-wide max-w-xs leading-relaxed">
            Restoring encrypted token profiles and initializing system workspace panels...
          </p>
        </div>
      </div>
    );
  }

  // FIXED INTERLOCK: Always renders your login page first if there is no session token cached
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans antialiased bg-transparent selection:bg-indigo-500/30 selection:text-white overflow-x-hidden relative">
      <Sidebar />
      <MainContent />

      {/* 🌌 RUNTIME BACKGROUND BACKDROP LOADER: Fires smoothly when refreshing individual data segments */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn select-none pointer-events-none">
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card border border-white/10 bg-[#0b0f19]/80 shadow-2xl space-y-4 max-w-xs text-center scale-95 animate-fadeIn">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-purple-400 animate-spin" />
              <RefreshCw size={14} className="text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">Synchronizing</h4>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide leading-relaxed">
                Querying relational PostgreSQL arrays and matrix streams...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ MODAL OVERLAY: REPAIRED FIXED INDICES FOR PRODUCTION COMPILES */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-white/10 text-center relative shadow-2xl bg-[#0b0f19]/90">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="w-12 h-12 mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
              <AlertTriangle size={22} className="animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Exit Active Session Node?</h3>
            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
              Are you sure you wish to terminate clearance tokens and step back to the login gateway entry point?
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer"
              >
                Stay Here
              </button>
              <button 
                onClick={() => { handleLogout(); }}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut size={12} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppProvider>
        <VantaBg>
          <AppContent />
        </VantaBg>
      </AppProvider>
    </Router>
  );
}

export default App;
