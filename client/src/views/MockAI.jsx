import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BrainCircuit, RefreshCw, Layers } from 'lucide-react';

const MockAI = () => {
  const { tasks } = useApp();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);

  const priorityStyles = {
    High: 'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.05)]',
    Medium: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    Low: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.02)]'
  };

  // REAL LIVE CONNECTION: Connects directly to the Google Gemini AI backend module
  const handleLiveSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
      const token = localStorage.getItem('nexus_token');
      const response = await fetch('https://ih-nexusai-developer-telemetry-cockpit.onrender.com/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setSummary(`⚠️ AI Processing Error: ${data.message || 'Verification mismatch.'}`);
      }
    } catch (err) {
      setSummary("❌ Network Link Defect: Ensure your local Express server node is running.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Algorithmic Matrix Priority sorting loop
  const handlePrioritize = () => {
    setIsPrioritizing(true);
    setPrioritizedTasks([]);
    setTimeout(() => {
      setIsPrioritizing(false);
      const sorted = [...tasks].sort((a, b) => {
        const order = { High: 3, Medium: 2, Low: 1 };
        return order[b.priority] - order[a.priority];
      });
      setPrioritizedTasks(sorted);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-indigo-400 animate-pulse" size={20} />
            Nexus Cognitive System
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-1">
            Live cognitive analytics workstation powered directly by the **Google Gemini Pro Architecture**. Trigger queries below to compile live data insights.
          </p>
        </div>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1: Live Gemini Executive Summarizer */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-75">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-400" />
              Live Gemini Summary Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Scans your specific PostgreSQL database rows using semantic prompt models to structure real-time milestones.
            </p>

            {isSummarizing ? (
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 py-4 animate-pulse">
                <RefreshCw size={14} className="animate-spin" /> RUNNING COGNITIVE COMPRESSION VIA GEMINI V2...
              </div>
            ) : summary ? (
              <div className="text-[11px] font-mono bg-black/30 border border-white/5 p-4 rounded-xl text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto selection:bg-indigo-500/20">
                {summary}
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-500 py-8 text-center border border-dashed border-white/5 rounded-xl">
                Ready to stream intelligence threads.
              </div>
            )}
          </div>

          <button
            onClick={handleLiveSummarize}
            disabled={isSummarizing}
            className="w-full mt-4 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            Run Gemini AI Summary
          </button>
        </div>

        {/* Module 2: Algorithmic Matrix Priority Restructuring */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-75">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Layers size={16} className="text-purple-400" />
              Algorithmic Matrix Sorter
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Re-aligns active workspace queues to bubble critical high-priority items directly to the surface loop.
            </p>

            {isPrioritizing ? (
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 py-4 animate-pulse">
                <RefreshCw size={14} className="animate-spin" /> RUNNING ALGORITHMIC SCAN VECTOR...
              </div>
            ) : prioritizedTasks.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {prioritizedTasks.map(t => (
                  <div key={t.id} className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg flex items-center justify-between gap-2 text-[11px] hover:bg-white/10 transition-colors">
                    <span className="text-slate-200 truncate font-medium">{t.title}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                      priorityStyles[t.priority] || 'text-slate-400 border-white/5'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-500 py-8 text-center border border-dashed border-white/5 rounded-xl">
                Ready to optimize task vectors.
              </div>
            )}
          </div>

          <button
            onClick={handlePrioritize}
            disabled={isPrioritizing}
            className="w-full mt-4 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            Calculate AI Priority Matrix
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default MockAI;
