import React from 'react';
import { X, Building2, User, CheckCircle2, Eye } from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { ROOMS } from '../../constants/officeData';

export const RoomDetailModal: React.FC = () => {
  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const selectRoom = useOfficeStore((state) => state.selectRoom);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const agents = useOfficeStore((state) => state.agents);
  const tasks = useOfficeStore((state) => state.tasks);

  if (!selectedRoomId || selectedRoomId === 'corridor') return null;

  const room = ROOMS.find((r) => r.id === selectedRoomId);
  if (!room) return null;

  const primaryAgent = agents.find((a) => a.id === room.assignedAgentId);
  const roomTasks = tasks.filter((t) => t.assignedAgentId === primaryAgent?.id);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Room Header Banner */}
        <div
          className="p-5 flex items-start justify-between relative"
          style={{
            background: `linear-gradient(135deg, ${room.colorAccent}33, #0f172a)`
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg border border-white/20"
              style={{ backgroundColor: room.colorAccent }}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{room.name}</h3>
              <p className="text-xs text-slate-300">Inspire WebCraft Workspace</p>
            </div>
          </div>

          <button
            onClick={() => selectRoom(null)}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Details */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            {room.description}
          </p>

          {/* Primary Occupant */}
          {primaryAgent && (
            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Room Occupant
              </h4>
              <div
                onClick={() => {
                  selectRoom(null);
                  selectAgent(primaryAgent.id);
                }}
                className="bg-slate-800/80 hover:bg-slate-750 cursor-pointer p-3 rounded-xl border border-slate-700 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow"
                    style={{ backgroundColor: primaryAgent.color }}
                  >
                    {primaryAgent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{primaryAgent.name}</div>
                    <div className="text-[10px] text-slate-400">{primaryAgent.title}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                  {primaryAgent.activityState}
                </span>
              </div>
            </div>
          )}

          {/* Room Features */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hardware & Amenities
            </h4>
            <div className="space-y-1.5">
              {room.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tasks in this room */}
          {roomTasks.length > 0 && (
            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Active Room Workloads ({roomTasks.length})
              </h4>
              <div className="space-y-2">
                {roomTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{task.title}</span>
                      <span className="text-[10px] text-sky-400 font-mono">{task.progress}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{task.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            <button
              onClick={() => selectRoom(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Done Viewing Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
