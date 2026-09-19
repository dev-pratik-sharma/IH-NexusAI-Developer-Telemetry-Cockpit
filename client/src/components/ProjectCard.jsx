import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, ArrowUpRight, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onOpenDeleteModal }) => {
  const navigate = useNavigate();

  const handleDeleteTrigger = (e) => {
    e.stopPropagation(); // Blocks the click from opening the project workspace dashboard page views
    if (typeof onOpenDeleteModal === 'function') {
      onOpenDeleteModal(project); // Hooks safely to the global state deletion trigger modal
    }
  };

  // Safely fallback to 0 if progress is undefined or computed as an empty value
  const displayProgress = project && project.progress !== undefined && !isNaN(project.progress) ? project.progress : 0;

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="glass-card p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] flex flex-col justify-between h-40 cursor-pointer transform hover:-translate-y-0.5 relative overflow-hidden bg-slate-900/40 backdrop-blur-md"
    >
      {/* Upper Action Context Row */}
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
          <Folder size={18} />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDeleteTrigger}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all z-20 cursor-pointer"
            title="Purge Project Records"
          >
            <Trash2 size={14} />
          </button>
          <div className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-300">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Middle Core Text Content */}
      <div className="mt-2">
        <span className="text-[10px] font-mono tracking-wider text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
          {project.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors mt-1.5 truncate">
          {project.name}
        </h3>
      </div>

      {/* 🚀 UPGRADED: SECURE STRUCTURAL PROGRESS BAR WRAPPER GRID */}
      {/* Using block and explicit layout values to guarantee visibility in advanced CSS grids */}
      <div className="w-full mt-3 block clear-both">
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1">
          <span className="tracking-widest uppercase text-[10px] text-slate-400">PROGRESS</span>
          <span className="text-slate-200 font-bold">{displayProgress}%</span>
        </div>
        
        {/* Unclippable rail background container bar layout */}
        <div className="w-full bg-slate-950/80 border border-white/5 h-2 rounded-full overflow-hidden relative block">
          {/* Hardware forced inline-width percentage loader fill indicator */}
          <div 
            className="h-full rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out block"
            style={{ 
              width: `${displayProgress}%`, 
              minWidth: displayProgress > 0 ? '4px' : '0px',
              height: '100%'
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default ProjectCard;
