import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import { Layers, FolderKanban, ClipboardList, Inbox, PlusCircle, RefreshCw, BarChart4, FolderPlus, Filter, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // FIXED: Pulling the full suite of modal controls exactly like ProjectDashboard.jsx does
  const { 
    projects, tasks, searchQuery, statusFilter, setStatusFilter, 
    projectFilter, setProjectFilter, addNewTask, toggleTaskStatus, 
    addNewProject, projectToDelete, setProjectToDelete, isDeletingProject, handleConfirmDeleteProject
  } = useApp();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [targetProject, setTargetProject] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState('Backend');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle || !targetProject) return;
    setIsSubmittingTask(true);
    const success = await addNewTask(taskTitle, taskPriority, targetProject);
    if (success) setTaskTitle('');
    setIsSubmittingTask(false);
  };

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectName || !projectCategory) return;
    setIsSubmittingProject(true);
    const success = await addNewProject(projectName, projectCategory);
    if (success) setProjectName(''); 
    setIsSubmittingProject(false);
  };

  const filteredTasks = tasks.filter(task => {
    const titleText = task.title ? task.title.toLowerCase() : '';
    const projectText = task.project ? task.project.toLowerCase() : 'unassigned';
    const normalizedSearch = searchQuery ? searchQuery.toLowerCase() : '';
    const matchesSearch = titleText.includes(normalizedSearch) || projectText.includes(normalizedSearch);
    const currentStatus = task.status ? task.status.toLowerCase().trim() : '';
    const targetFilter = statusFilter ? statusFilter.toLowerCase().trim() : 'all';

    let matchesStatus = false;
    if (targetFilter === 'all') matchesStatus = true;
    else if (targetFilter === 'inprogress') matchesStatus = currentStatus === 'in-progress' || currentStatus === 'todo';
    else if (targetFilter === 'completed') matchesStatus = currentStatus === 'completed';

    const taskProjId = task.ProjectId || task.project_id;
    const matchesProject = projectFilter === 'all' || parseInt(taskProjId) === parseInt(projectFilter);
    return matchesSearch && matchesStatus && matchesProject;
  });

  const todoCount = tasks.filter(t => t.status && t.status.toLowerCase().trim() === 'todo').length;
  const progressCount = tasks.filter(t => t.status && t.status.toLowerCase().trim() === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status && t.status.toLowerCase().trim() === 'completed').length;

  const pieData = [
    { name: 'In Progress', value: (todoCount + progressCount) || 0, color: '#fb8500' },
    { name: 'Completed', value: completedCount || 0, color: '#06d6a0' }
  ];

  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
  const medPriorityCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'Low').length;

  const barData = [
    { name: 'High', Count: highPriorityCount, fill: '#ff4d6d', border: '#ff758f' },
    { name: 'Medium', Count: medPriorityCount, fill: '#fb8500', border: '#ffb703' },
    { name: 'Low', Count: lowPriorityCount, fill: '#06d6a0', border: '#2ec4b6' }
  ];

  const totalTasks = tasks.length;
  const operationalProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400"><FolderKanban size={20} /></div>
          <div><p className="text-[10px] text-slate-400 font-mono tracking-wider">ACTIVE SUITES</p><p className="text-lg font-bold text-white mt-0.5">{projects.length}</p></div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400"><ClipboardList size={20} /></div>
          <div><p className="text-[10px] text-slate-400 font-mono tracking-wider">TASKS LOGGED</p><p className="text-lg font-bold text-white mt-0.5">{completedCount} / {totalTasks}</p></div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><Layers size={20} /></div>
          <div className="flex-1"><p className="text-[10px] text-slate-400 font-mono tracking-wider">OVERALL VELOCITY</p><p className="text-lg font-bold text-white mt-0.5">{operationalProgress}%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div><h3 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-1">Status Division Analytics</h3></div>
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center"><span className="text-xs text-slate-400 font-mono">TOTAL</span><span className="text-lg font-extrabold text-white">{totalTasks}</span></div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div><h3 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase mb-1">Priority Load Vectors</h3></div>
          <div className="h-44 w-full">
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
        </div>
      </div>

      <div>
        <h2 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">Active Architecture Layouts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const projectTasks = tasks.filter(t => parseInt(t.ProjectId || t.project_id) === parseInt(project.id));
            const totalProjectTasks = projectTasks.length;
            const completedProjectTasks = projectTasks.filter(t => t.status && t.status.toLowerCase().trim() === 'completed').length;
            const dynamicProgress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;
            return (
              <ProjectCard key={project.id} project={{ ...project, progress: dynamicProgress }} onOpenDeleteModal={(target) => setProjectToDelete(target)} />
            );
          })}
        </div>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 glass-card p-4 rounded-xl border border-white/5 text-left flex flex-col justify-between">
          <h3 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-2"><FolderPlus size={14} /> Deploy Project Suite</h3>
          <form onSubmit={handleAddProjectSubmit} className="space-y-2.5 w-full">
            <input type="text" placeholder="e.g., Orion Data Sync..." value={projectName} onChange={(e) => setProjectName(e.target.value)} required className="w-full px-3 py-1.5 text-xs rounded-xl glass-input" />
            
            {/* 🌌 MODIFIED: Enforced deep background context color matching with clear white text properties for options lists */}
            <select 
              value={projectCategory} 
              onChange={(e) => setProjectCategory(e.target.value)} 
              className="w-full px-3 py-1.5 text-xs rounded-xl glass-input bg-[#121826] text-white focus:outline-none cursor-pointer"
            >
              <option value="Backend" className="bg-[#121826] text-white">Backend</option>
              <option value="Frontend" className="bg-[#121826] text-white">Frontend</option>
              <option value="Security" className="bg-[#121826] text-white">Security</option>
              <option value="DevOps" className="bg-[#121826] text-white">DevOps</option>
            </select>
            
            <button type="submit" disabled={isSubmittingProject || !projectName} className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold py-1.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer">
              {isSubmittingProject ? <RefreshCw size={12} className="animate-spin" /> : 'Create Project'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 glass-card p-4 rounded-xl border border-white/5 text-left flex flex-col justify-between">
          <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-3 flex items-center gap-2"><PlusCircle size={14} /> Inject Operational Objective</h3>
          <form onSubmit={handleAddTaskSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end h-full w-full">
            <div className="flex flex-col sm:col-span-2"><input type="text" placeholder="e.g., Audit endpoint rate-limiters..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required className="px-3 py-1.5 text-xs rounded-xl glass-input" /></div>
            
            {/* 🌌 MODIFIED: High contrast select dropdown lane targeting valid linked database arrays */}
            <select 
              value={targetProject} 
              onChange={(e) => setTargetProject(e.target.value)} 
              required 
              className="w-full px-3 py-1.5 text-xs rounded-xl glass-input bg-[#121826] text-white focus:outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#121826] text-slate-500">Select Target Array...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#121826] text-white">{p.name}</option>
              ))}
            </select>
            
            {/* 🌌 MODIFIED: High contrast task priority vector dropdown tracker selection input */}
            <select 
              value={taskPriority} 
              onChange={(e) => setTaskPriority(e.target.value)} 
              className="w-full px-3 py-1.5 text-xs rounded-xl glass-input bg-[#121826] text-white focus:outline-none cursor-pointer"
            >
              <option value="High" className="bg-[#121826] text-white">High</option>
              <option value="Medium" className="bg-[#121826] text-white">Medium</option>
              <option value="Low" className="bg-[#121826] text-white">Low</option>
            </select>
            
            <button type="submit" disabled={isSubmittingTask || !taskTitle || !targetProject} className="w-full sm:col-span-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold py-1.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer h-8.5">Inject Task</button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-2">
          <h2 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase px-1">Operational Work Plan</h2>
          <div className="flex flex-wrap items-center gap-3">
            
            {/* 🌌 MODIFIED: Workspace header main selector dropdown panel configuration */}
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="bg-transparent border-none text-slate-200 focus:outline-none text-[10px] cursor-pointer"
            >
              <option value="all" className="bg-[#121826] text-white">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#121826] text-white">{p.name}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
              {['all', 'inprogress', 'completed'].map((btn) => (
                <button key={btn} onClick={() => setStatusFilter(btn)} className="px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer text-slate-400 hover:text-slate-200" style={{ backgroundColor: statusFilter === btn ? '#4f46e5' : 'transparent', color: statusFilter === btn ? '#fff' : '' }}>{btn === 'all' ? 'All' : btn === 'inprogress' ? 'In Progress' : 'Completed'}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => <TaskCard key={task.id} task={task} onToggleStatus={() => toggleTaskStatus(task.id, task.status)} />)
          ) : (
            <div className="glass-card p-12 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center"><div className="p-4 bg-white/5 text-slate-500 rounded-full mb-3"><Inbox size={24} /></div><h3 className="text-sm font-semibold text-slate-300">No active operational records found</h3><p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">No active records match parameters.</p></div>
          )}
        </div>
      </div>

      {/* ⚠️ GLASSMORPHIC PROJECT PURGE CONFIRMATION MODAL OVERLAY */}
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

export default Dashboard;
