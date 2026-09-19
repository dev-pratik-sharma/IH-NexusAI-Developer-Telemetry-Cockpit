import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Trash2, RefreshCw } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus }) => {
  // Pull only your data reload trigger out of the global application context
  const { fetchDatabaseData } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };

  const isCompleted = task.status && task.status.toLowerCase().trim() === 'completed';

  // 🚀 HIGH-SPEED ISOLATED DELETION PURGER
  const handleImmediateDelete = async (e) => {
    // 1. Instantly kill event propagation to prevent checkbox toggle conflicts
    e.preventDefault();
    e.stopPropagation();

    const targetTaskId = task.id || task.Id || task.task_id;
    if (!targetTaskId) return;

    // 2. Launch high-speed native system window confirmation guard rail
    if (!window.confirm(`⚠️ Permanently purge task objective: "${task.title}"?`)) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('nexus_token');
      
      // 3. Dispatch direct payload straight to your live Render endpoint node
      const response = await fetch(`https://onrender.com{targetTaskId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // 4. Hot-reload your graphs, charts, and progress bars smoothly across the UI
        if (typeof fetchDatabaseData === 'function') {
          await fetchDatabaseData();
        }
      } else {
        console.error("Task clearance failed at firewall gate:", response.status);
      }
    } catch (err) {
      console.error("Network link exception trace:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
      isCompleted 
        ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60' 
        : 'bg-white/5 border-white/5 hover:border-white/10'
    }`}>
      
      <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <button 
          type="button"
          onClick={onToggleStatus}
          className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
        >
          {isCompleted ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium text-slate-200 truncate ${isCompleted ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </p>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-0.5">
            {task.project || 'Active Node'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded-md font-bold uppercase ${priorityColors[task.priority] || priorityColors.Medium}`}>
          {task.priority}
        </span>

        {/* HIGH-SPEED TRIGGER BUTTON */}
        <button
          type="button"
          onClick={handleImmediateDelete}
          disabled={isDeleting}
          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          title="Destroy Task Record"
        >
          {isDeleting ? <RefreshCw size={11} className="animate-spin text-rose-400" /> : <Trash2 size={11} />}
        </button>
      </div>

    </div>
  );
};

export default TaskCard;
