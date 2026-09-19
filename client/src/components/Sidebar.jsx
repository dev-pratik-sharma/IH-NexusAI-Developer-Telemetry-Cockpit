import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Terminal, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { userProfile, setShowLogoutModal } = useApp(); // FIXED: Explicitly extracted
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { id: 'ai-sandbox', label: 'AI Core Sandbox', icon: Sparkles, badge: 'New', route: '/ai-sandbox' },
  ];

  const userInitial = userProfile.name ? userProfile.name.charAt(0) : 'D';

  return (
    <aside className="fixed bottom-0 left-0 z-40 h-17.5 w-full glass-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-64 flex lg:flex-col justify-between p-4 border-t lg:border-t-0 border-slate-800 transition-all duration-300">
      
      <div className="hidden lg:flex items-center gap-3 px-2 py-3 border-b border-white/5 mb-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
          <Terminal size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-md font-bold tracking-wider bg-linear-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            NEXUS AI
          </h1>
          <span className="text-[10px] text-indigo-400/70 font-mono tracking-widest block -mt-0.5">INTERNAL SUITE</span>
        </div>
      </div>

      <nav className="flex lg:flex-col items-center lg:items-stretch justify-around lg:justify-start gap-1 w-full lg:flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.route;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative w-full justify-center lg:justify-start cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-indigo-600/30 to-indigo-500/10 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile summary footer tray */}
      <div className="hidden lg:flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-xl">
          <div className={`w-9 h-9 rounded-lg bg-linear-to-tr ${userProfile.avatarColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center font-bold text-sm text-white shadow-md uppercase`}>
            {userInitial}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{userProfile.name}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">v1.0.0-stable</p>
          </div>
        </div>
        
        {/* FIXED: Directly triggers the global state modal overlay parameter cleanly */}
        <button 
          type="button"
          onClick={() => { setShowLogoutModal(true); }} 
          className="w-full flex items-center gap-3 px-4 py-2.5 mt-1 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all duration-300 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Exit Workspace</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
