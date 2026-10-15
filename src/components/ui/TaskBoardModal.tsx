import React, { useState } from 'react';
import {
  X,
  Plus,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  ShieldCheck,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { Task, TaskPriority, TaskStatus } from '../../types/office';

export const TaskBoardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const tasks = useOfficeStore((state) => state.tasks);
  const agents = useOfficeStore((state) => state.agents);
  const createTask = useOfficeStore((state) => state.createTask);
  const executeTask = useOfficeStore((state) => state.executeTask);
  const evaluateCEO = useOfficeStore((state) => state.evaluateCEO);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDeliverableTask, setSelectedDeliverableTask] = useState<Task | null>(null);
  const [isExecutingTaskId, setIsExecutingTaskId] = useState<string | null>(null);
  const [isEvaluatingCEO, setIsEvaluatingCEO] = useState(false);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('Website Development');
  const [newAgentId, setNewAgentId] = useState('agent_programmer');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');

  if (!isOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTask(
      newTitle.trim(),
      newDesc.trim() || 'Instruksi tugas bisnis untuk agen AI.',
      newCategory,
      newAgentId,
      newPriority
    );
    setNewTitle('');
    setNewDesc('');
    setNewObjective('');
    setNewCriteria('');
    setShowNewTaskForm(false);
  };

  const handleExecute = async (taskId: string) => {
    setIsExecutingTaskId(taskId);
    await executeTask(taskId);
    setIsExecutingTaskId(null);
  };

  const handleCEOReview = async () => {
    setIsEvaluatingCEO(true);
    await evaluateCEO();
    setIsEvaluatingCEO(false);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-slate-300">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">In Progress</span>;
      case 'assigned':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">Assigned</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Review</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">Failed</span>;
      case 'blocked':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Blocked</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-700 text-slate-300">Pending</span>;
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return t.status === 'assigned' || t.status === 'in_progress';
    if (filterStatus === 'completed') return t.status === 'completed';
    if (filterStatus === 'review') return t.status === 'review' || t.status === 'failed' || t.status === 'blocked';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Inspire WebCraft Task Board</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  {tasks.length} Total Tugas
                </span>
              </div>
              <p className="text-xs text-slate-400">Distribusi Tugas & Hasil Deliverable AI Agents</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* CEO Review Trigger Button */}
            <button
              onClick={handleCEOReview}
              disabled={isEvaluatingCEO}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
              title="Minta CEO Victor mengaudit seluruh deliverable agen"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{isEvaluatingCEO ? 'CEO Mengevaluasi...' : 'Evaluasi CEO (Victor)'}</span>
            </button>

            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewTaskForm ? 'Tutup Form' : 'Tugas Baru'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2 bg-slate-850 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Filter:</span>
            {[
              { id: 'all', label: 'Semua Tugas' },
              { id: 'active', label: 'Tugas Aktif' },
              { id: 'completed', label: 'Selesai' },
              { id: 'review', label: 'Review / Kendala' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterStatus === f.id
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Selesai: {tasks.filter((t) => t.status === 'completed').length}</span>
            <span>•</span>
            <span>Aktif: {tasks.filter((t) => t.status === 'in_progress' || t.status === 'assigned').length}</span>
          </div>
        </div>

        {/* Create Task Form */}
        {showNewTaskForm && (
          <form
            onSubmit={handleCreateTask}
            className="p-4 bg-slate-850 border-b border-slate-800 space-y-3 shrink-0 animate-in fade-in slide-in-from-top-2"
          >
            <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Owner & Manager: Buat Tugas Baru</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Judul Tugas</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Buat Komponen 3D Card Interactive"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Kategori Layanan</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Website Development">Website Development</option>
                  <option value="Prompt Engineering">Prompt Engineering</option>
                  <option value="Marketing Strategy">Marketing Strategy</option>
                  <option value="Content Planning">Content Planning</option>
                  <option value="Content Production">Content Production</option>
                  <option value="Executive Review">Executive Review</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Tugaskan ke Agen</label>
                <select
                  value={newAgentId}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} — {agent.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Prioritas</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Deskripsi & Kriteria Deliverable</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Spesifikasi lingkup kerja, konteks bisnis, dan kriteria sukses..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-750"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-md"
              >
                Simpan & Distribusikan Tugas
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Tidak ada tugas yang cocok dengan filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const assignee = agents.find((a) => a.id === task.assignedAgentId);
              const isExecutingThis = isExecutingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="bg-slate-850 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white">{task.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {task.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

                  {/* Objective & Criteria Details if present */}
                  {(task.objective || task.successCriteria) && (
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                      {task.objective && (
                        <div>
                          <span className="font-medium text-slate-300">Tujuan:</span> {task.objective}
                        </div>
                      )}
                      {task.successCriteria && (
                        <div>
                          <span className="font-medium text-slate-300">Kriteria Sukses:</span> {task.successCriteria}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Failure reason if failed */}
                  {task.errorReason && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>Kendala: {task.errorReason}</span>
                    </div>
                  )}

                  {/* Bottom Action Bar: Assignee, Progress, AI Execution & Deliverable Inspector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shadow-sm"
                        style={{ backgroundColor: assignee?.color || '#3b82f6' }}
                      >
                        {assignee?.name.charAt(0) || 'A'}
                      </div>
                      <div className="text-xs">
                        <span className="text-white font-semibold">{assignee?.name || 'Agent'}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5 capitalize font-mono">
                          ({task.assignedRole.replace('_', ' ')})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Real AI Execution Button */}
                      {task.status !== 'completed' && (
                        <button
                          disabled={isExecutingThis}
                          onClick={() => handleExecute(task.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isExecutingThis ? 'Mengeksekusi AI...' : 'Jalankan dengan AI'}</span>
                        </button>
                      )}

                      {/* View Deliverable Button if completed */}
                      {task.deliverable && (
                        <button
                          onClick={() => setSelectedDeliverableTask(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-semibold text-xs transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Lihat Deliverable</span>
                        </button>
                      )}

                      <div className="text-right pl-2 font-mono text-[11px] text-slate-400">
                        {task.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Deliverable Inspector Modal */}
      {selectedDeliverableTask && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
                  Hasil Deliverable Resmi
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedDeliverableTask.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeliverableTask(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
                <span>Dihasilkan oleh: <strong className="text-white">{selectedDeliverableTask.assignedRole}</strong></span>
                <span className="text-emerald-400 font-semibold">Validasi: {selectedDeliverableTask.validationStatus}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
                {selectedDeliverableTask.deliverable}
              </div>
            </div>

            <div className="p-3 bg-slate-850 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDeliverableTask(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
