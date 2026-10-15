import React from 'react';
import { X, Eye, CheckCircle2, Briefcase, Sparkles, MapPin, Activity } from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { ROOMS } from '../../constants/officeData';

export const AgentDetailModal: React.FC = () => {
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const agents = useOfficeStore((state) => state.agents);
  const tasks = useOfficeStore((state) => state.tasks);
  const setCameraMode = useOfficeStore((state) => state.setCameraMode);

  if (!selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const room = ROOMS.find((r) => r.id === agent.roomId);
  const activeTask = tasks.find((t) => t.id === agent.activeTaskId);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with agent role color banner */}
        <div
          className="p-5 flex items-start justify-between relative"
          style={{
            background: `linear-gradient(135deg, ${agent.color}33, #0f172a)`
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg border border-white/20"
              style={{ backgroundColor: agent.color }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800/80 text-sky-300 border border-slate-700">
                  {agent.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300">{agent.title}</p>
            </div>
          </div>

          <button
            onClick={() => selectAgent(null)}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status & Location Pill */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-750 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Activity Status</span>
                <span className="font-semibold text-emerald-300 capitalize">{agent.activityState}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-750 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Assigned Station</span>
                <span className="font-semibold text-slate-200">{room?.name || 'Corridor'}</span>
              </div>
            </div>
          </div>

          {/* Bio Description */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Role Profile
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {agent.bio}
            </p>
          </div>

          {/* Skills Badges */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Autonomous Capabilities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Active Work Task */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Current Task</span>
              {activeTask && (
                <span className="text-sky-400 font-mono text-[10px]">
                  {activeTask.progress}%
                </span>
              )}
            </h4>

            {activeTask ? (
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white">{activeTask.title}</span>
                  <span className="text-[10px] uppercase font-bold text-sky-400">
                    {activeTask.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-2">{activeTask.description}</p>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${activeTask.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 text-center">
                No active task. Agent on standby.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setCameraMode('follow_agent');
                selectAgent(agent.id);
              }}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition"
            >
              <Eye className="w-4 h-4" />
              <span>Follow with Camera</span>
            </button>
            <button
              onClick={() => selectAgent(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
