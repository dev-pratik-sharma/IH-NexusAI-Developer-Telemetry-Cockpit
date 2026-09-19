import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import { Layers, Folder, ClipboardList, Inbox, ArrowLeft, BarChart4, LayoutDashboard, Sparkles, RefreshCw, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // STRICT LOGIC ONLY: Pulled "tasks" out to guarantee dynamic list rerenders upon individual task deletions
  const { projects, tasks, toggleTaskStatus, fetchDatabaseData } = useApp();

  // Sub-Dashboard Filter, AI, and Double-Modal Deletion States
  const [subStatusFilter, setSubStatusFilter] = useState('all');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setSummary] = useState('');
  
  // Track project targets selected for destruction
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const activeProject = projects.find(p => parseInt(p.id) === parseInt(id));
  const alternativeProjects = projects.filter(p => parseInt(p.id) !== parseInt(id));
  const baselineProjectTasks = tasks.filter(t => parseInt(t.ProjectId || t.project_id) === parseInt(id));

  const filteredProjectTasks = baselineProjectTasks.filter(task => {
    const currentStatus = task.status ? task.status.toLowerCase().trim() : '';
    const targetFilter = subStatusFilter.toLowerCase().trim();
    if (targetFilter === 'all') return true;
    if (targetFilter === 'inprogress') return currentStatus === 'in-progress' || currentStatus === 'todo';
    if (targetFilter === 'completed') return currentStatus === 'completed';
    return true;
  });

  // REST API Pipeline to delete selected project
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`https://ih-nexusai-developer-telemetry-cockpit.onrender.com/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok && typeof fetchDatabaseData === 'function') {
        await fetchDatabaseData();
        // If the active sub-dashboard project was deleted, route back to safety
        if (parseInt(projectToDelete.id) === parseInt(id)) {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error("Deletion sequence blocked:", err);
    } finally {
      setIsDeletingProject(false);
      setProjectToDelete(null);
    }
  };

  if (!activeProject) {
    return (
      <div className="glass-card p-12 rounded-xl text-center border border-dashed border-white/10 animate-fadeIn">
        <div className="w-12 h-12 mx-auto bg-white/5 text-slate-500 rounded-full flex items-center justify-center mb-3">
          <Inbox size={24} />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">Target project architecture not discovered</h3>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto transition-all cursor-pointer">
          <ArrowLeft size={12} /> Re-route to Hub Dashboard
        </button>
      </div>
    );
  }

    const handleProjectAISummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
      const token = localStorage.getItem('nexus_token');
      const response = await fetch('https://ih-nexusai-developer-telemetry-cockpit.onrender.com/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setSummary(data.summary);
      else setSummary(`⚠️ AI Processing Error: ${data.message}`);
    } catch (err) {
      setSummary("❌ Network Link Defect.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const todoCount = baselineProjectTasks.filter(t => t.status && t.status.toLowerCase().trim() === 'todo').length;
  const progressCount = baselineProjectTasks.filter(t => t.status && t.status.toLowerCase().trim() === 'in-progress').length;
  const completedCount = baselineProjectTasks.filter(t => t.status && t.status.toLowerCase().trim() === 'completed').length;

  const pieData = [
    { name: 'In Progress', value: (todoCount + progressCount) || 0, color: '#fb8500' },
    { name: 'Completed', value: completedCount || 0, color: '#06d6a0' }
  ];

  const highPriorityCount = baselineProjectTasks.filter(t => t.priority === 'High').length;
  const medPriorityCount = baselineProjectTasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityCount = baselineProjectTasks.filter(t => t.priority === 'Low').length;

  const barData = [
    { name: 'High', Count: highPriorityCount, fill: '#ff4d6d', border: '#ff758f' },
    { name: 'Medium', Count: medPriorityCount, fill: '#fb8500', border: '#ffb703' },
    { name: 'Low', Count: lowPriorityCount, fill: '#06d6a0', border: '#2ec4b6' }
  ];

  const totalTasks = baselineProjectTasks.length;
  const operationalProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      {/* Upper Navigation Action Context Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-md font-bold text-white flex items-center gap-2">
              <Folder className="text-indigo-400" size={18} />
              {activeProject.name} Dedicated Board
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">SCELERATED WORKSPACE ROUTE</span>
          </div>
        </div>
        
        {/* FEATURE B: Direct Top Header Self-Deletion Purge Action Row */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProjectToDelete(activeProject)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-mono text-[10px] tracking-wide cursor-pointer transition-all uppercase font-bold"
            title="Purge Active Project Permanent Records Node"
          >
            <Trash2 size={12} /> Purge This Suite
          </button>
          <div className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg uppercase tracking-wider font-bold">
            {activeProject.category} LAYER
          </div>
        </div>
      </div>

      {/* Scoped KPI Mini Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">PROJECT VOLUME</p>
            <p className="text-lg font-bold text-white mt-0.5">{totalTasks} Objectives</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">FINISHED NODES</p>
            <p className="text-lg font-bold text-white mt-0.5">{completedCount} Completed</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Layers size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">BOARD EFFICIENCY</p>
            <p className="text-lg font-bold text-white mt-0.5">{operationalProgress}%</p>
          </div>
        </div>
      </div>

      {/* Filtered Data Visual Graphics Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-1">Module Status Breakdown</h3>
            <p className="text-[11px] text-slate-400 mb-4">Current stage proportion parameters for this active suite.</p>
          </div>
          <div className="h-40 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-mono">TOTAL</span>
              <span className="text-md font-extrabold text-white">{totalTasks}</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-mono mt-2 pt-2 border-t border-t-white/5">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> ACTIVE ({progressCount + todoCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> COMPLETED ({completedCount})</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase mb-1">Module Priority Load Vectors</h3>
            <p className="text-[11px] text-slate-400 mb-4">Critical operational weights distributed inside this architecture loop.</p>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="Count" radius={4}>
                  {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.border} strokeWidth={1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-white/5 flex items-center justify-center gap-1">
            <BarChart4 size={11} /> Isolated critical backlog matrix
          </div>
        </div>
      </div>

            {/* Scoped Project Intelligence Engine Prompt Drawer */}
      <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-35 text-left">
        <div>
          <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Scoped Project Intelligence Engine
          </h3>
          {isSummarizing ? (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 py-3 animate-pulse">
              <RefreshCw size={12} className="animate-spin" /> SCANNING SUITE METRICS VIA GEMINI...
            </div>
          ) : aiSummary ? (
            <div className="text-[11px] font-mono bg-black/20 border border-white/5 p-3 rounded-xl text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto mb-3">
              {aiSummary}
            </div>
          ) : (
            <p className="text-xs text-slate-400 mb-3">Ready to feed this project's isolated tasks straight into Google Gemini for localized executive summaries.</p>
          )}
        </div>
        <button onClick={handleProjectAISummarize} disabled={isSummarizing} className="w-auto self-start bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-[10px] py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40">
          Analyze This Suite
        </button>
      </div>

      {/* Main Bottom Section: Scoped Filter Buttons + Tasks Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-1">
            <h2 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase px-1">Project Active Queue Tracks</h2>
            
            {/* Sub-Filters Tabs Row */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
              {[
                { id: 'all', label: 'All' },
                { id: 'inprogress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' }
              ].map((btn) => (
                <button key={btn.id} onClick={() => setSubStatusFilter(btn.id)} className="px-2.5 py-0.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer text-slate-400 hover:text-slate-200" style={{ backgroundColor: subStatusFilter === btn.id ? '#4f46e5' : 'transparent', color: subStatusFilter === btn.id ? '#fff' : '' }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* FIXED CHECKLIST LOOP: Synchronizes checklist toggles cleanly with zero DOM lag anomalies */}
          <div className="grid grid-cols-1 gap-2.5">
            {filteredProjectTasks.length > 0 ? (
              filteredProjectTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleStatus={async () => { 
                    if (typeof toggleTaskStatus === 'function') {
                      await toggleTaskStatus(task.id, task.status); 
                    }
                  }} 
                />
              ))
            ) : (
              <div className="glass-card p-12 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white/5 text-slate-500 rounded-full mb-3"><Inbox size={20} /></div>
                <h4 className="text-xs font-semibold text-slate-300">No active operational records found</h4>
              </div>
            )}
          </div>
        </div>

        {/* Alternative Project Carousel Sidebar Panel */}
        <div className="lg:col-span-4 space-y-3">
          <div className="border-b border-white/5 pb-1">
            <h2 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase px-1">Your Alternative Projects</h2>
          </div>

          <div className="flex flex-col gap-3 max-h-95 overflow-y-auto pr-1">
            {alternativeProjects.length > 0 ? (
              alternativeProjects.map(proj => {
                const altProjTasks = tasks.filter(t => parseInt(t.ProjectId || t.project_id) === parseInt(proj.id));
                const compAltTasks = altProjTasks.filter(t => t.status && t.status.toLowerCase().trim() === 'completed').length;
                const altProgress = altProjTasks.length > 0 ? Math.round((compAltTasks / altProjTasks.length) * 100) : 0;
                
                return (
                  <ProjectCard 
                    key={proj.id} 
                    project={{ ...proj, progress: altProgress }} 
                    onOpenDeleteModal={(target) => setProjectToDelete(target)}
                  />
                );
              })
            ) : (
              <div className="text-[10px] font-mono text-slate-500 py-6 text-center border border-dashed border-white/5 rounded-xl">No alternative projects active in profile data.</div>
            )}
          </div>
        </div>
      </div>

      {/* Central Glass Purge Modal Overlay */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-white/10 text-center relative shadow-2xl bg-[#0b0f19]/90">
            <button onClick={() => setProjectToDelete(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"><X size={16} /></button>
            <div className="w-12 h-12 mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400"><Trash2 size={22} className="animate-bounce" /></div>
            <h3 className="text-sm font-bold text-white mb-1">Destroy Project Suite Architecture?</h3>
            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
              Are you sure you wish to permanently erase <span className="text-rose-400 font-semibold font-mono">"{projectToDelete.name}"</span>? This will cascade and instantly purge all nested task records from your PostgreSQL cluster.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setProjectToDelete(null)} className="flex-1 px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer">Cancel</button>
              <button onClick={handleConfirmDeleteProject} disabled={isDeletingProject} className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40">
                {isDeletingProject ? <RefreshCw size={12} className="animate-spin" /> : 'Purge Records'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDashboard;
