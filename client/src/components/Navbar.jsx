import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { searchQuery, setSearchQuery, userProfile, setShowLogoutModal, tasks } = useApp();
  const navigate = useNavigate();

  // Local state controller for our custom notification menu panel
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract the absolute first character of the logged user for the profile initial
  const userInitial = userProfile.name ? userProfile.name.charAt(0) : 'D';

  // REAL-TIME BACKLOG METRIC ENGINE: Filter unfinished tasks marked with High priority
  const incompleteHighPriorityTasks = tasks.filter(
    task => task.priority === 'High' && task.status !== 'completed'
  );
  const backlogAlertCount = incompleteHighPriorityTasks.length;

  // Intercept clicks outside the menu container block to close it safely
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-auto glass-card border-none rounded-none lg:rounded-2xl lg:mt-4 lg:mx-4 px-6 py-4 flex items-center justify-between gap-4 z-30 shadow-lg relative">
      
      {/* Personalized Welcome Username Greeting Header */}
      <div className="flex flex-col text-left">
        <h2 className="text-xs font-semibold text-slate-100">
          Welcome back, <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">{userProfile.name}</span>
        </h2>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider">WORKSPACE ACTIVE</span>
      </div>

      {/* Global Interactive Search Input */}
      <div className="relative flex-1 max-w-sm group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-400" size={14} />
        <input
          type="text"
          placeholder="Query operational task arrays..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl glass-input transition-all duration-300"
        />
      </div>

      {/* Control Tools and Status Indicators */}
      <div className="flex items-center gap-4 relative">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-wide">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          LIVE SYNC
        </div>

        {/* Evaluation Clearances and Gmail-style Dynamic Avatar */}
        <div className="flex items-center gap-3 text-slate-300 border-l border-white/10 pl-4 relative" ref={dropdownRef}>
          
          {/* Mobile Workspace Exit Button Overlay */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)} 
            className="flex lg:hidden p-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-xl text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
            title="Exit Workspace Platform Router"
          >
            <LogOut size={14} />
          </button>

          {/* NOTIFICATION HUB CONTROLLER LINK */}
          <button 
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`p-2 border rounded-xl transition-all relative cursor-pointer ${
              dropdownOpen 
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-white/5'
            }`}
          >
            <Bell size={14} />
            
            {/* Dynamic Numeric Pulsing Badge Indicator */}
            {backlogAlertCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-extrabold bg-linear-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse border border-slate-900">
                {backlogAlertCount}
              </span>
            )}
          </button>

          {/* 🌌 UPDATED: HIGH-CONTRAST DEEP CYBER-INK ALERTS DROPDOWN PANEL */}
          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-72 bg-[#0d1324] border border-white/10 p-2 rounded-2xl shadow-2xl z-50 animate-fadeIn text-left mt-1">
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">System Alerts</span>
                <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400">
                  {backlogAlertCount} Pending
                </span>
              </div>

              {/* Scrollable Backlog Rows Container */}
              <div className="max-h-48 overflow-y-auto mt-1.5 space-y-1 pr-0.5">
                {backlogAlertCount > 0 ? (
                  incompleteHighPriorityTasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        setDropdownOpen(false);
                        if (task.ProjectId || task.project_id) {
                          navigate(`/project/${task.ProjectId || task.project_id}`);
                        }
                      }}
                      className="p-2 rounded-xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all flex items-start gap-2.5 cursor-pointer group"
                    >
                      <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <AlertTriangle size={11} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* High-visibility pure white text logs on hover matrix states */}
                        <p className="text-[11px] font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {task.title}
                        </p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                          {task.project || 'Active Suite'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mb-2">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-[11px] text-slate-200 font-semibold">Workspace Pipeline Clean</p>
                    <p className="text-[9px] text-slate-400 max-w-45 mt-0.5 leading-relaxed">
                      No unresolved high-priority bottlenecks discovered.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Avatar Profile Initial Circle Bubble */}
          <div 
            title={`Active Session Node: ${userProfile.name} (${userProfile.email})`}
            className={`w-8 h-8 rounded-full bg-linear-to-tr ${userProfile.avatarColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center font-extrabold text-xs text-white shadow-md select-none border border-white/20 uppercase transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer`}
          >
            {userInitial}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
