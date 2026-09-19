import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Trash2, RefreshCw, X, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus }) => {
  const { deleteExistingTask } = useApp();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const priorityColors = {
    High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };

  const isCompleted = task.status && task.status.toLowerCase().trim() === 'completed';

  const handleConfirmDelete = async (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    const targetTaskId = task.id ?? task.Id ?? task.task_id;

    if (!targetTaskId) {
      console.error('TaskCard: no valid task id found on task object', task);
      setDeleteError('Could not identify this task (missing id).');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteExistingTask(targetTaskId);
      setShowDeleteModal(false); // only close on confirmed success
    } catch (err) {
      console.error('TaskCard: failed to delete task', targetTaskId, err);
      setDeleteError(err?.message || 'Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteError(null);
              setShowDeleteModal(true);
            }}
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete Task"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm glass-card p-6 rounded-2xl border border-white/10 text-center relative shadow-2xl bg-[#0b0f19]/95"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="w-12 h-12 mx-auto mb-4 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
              <AlertTriangle size={22} className="animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Delete Task?</h3>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-rose-400 font-semibold font-mono">"{task.title}"</span>? This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-[11px] text-rose-400 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {deleteError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {isDeleting ? <RefreshCw size={12} className="animate-spin" /> : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;