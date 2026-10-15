import React from 'react';
import { X, Layers, Compass, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { TaskEvent } from '../../types/office';

export const ActivityLogModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const activityLogs = useOfficeStore((state) => state.activityLogs);

  if (!isOpen) return null;

  const getEventIcon = (eventType: TaskEvent['eventType']) => {
    switch (eventType) {
      case 'navigation_started':
      case 'reached_destination':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'dialogue_started':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-400" />;
      case 'task_completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Office Activity Stream</h2>
              <p className="text-xs text-slate-400">Autonomous Agent Navigation & Action Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Feed */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1 font-mono text-xs">
          {activityLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No events logged yet.</div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-850 p-3 rounded-xl border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition"
              >
                <div className="mt-0.5 p-1 rounded-lg bg-slate-800 shrink-0">
                  {getEventIcon(log.eventType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-sky-300 font-sans">
                      {log.actorName} ({log.actorRole.replace('_', ' ')})
                    </span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
