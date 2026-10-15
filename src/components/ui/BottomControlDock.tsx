import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Building2,
  Users,
  Compass,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Layers,
  Bot
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { ROOMS } from '../../constants/officeData';
import { RoomId } from '../../types/office';

type TabKey = 'journey' | 'rooms' | 'agents' | 'settings';

export const BottomControlDock: React.FC<{
  onOpenTaskBoard: () => void;
  onOpenActivityLogs: () => void;
}> = ({ onOpenTaskBoard, onOpenActivityLogs }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('journey');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const simulation = useOfficeStore((state) => state.simulation);
  const startManagerJourney = useOfficeStore((state) => state.startManagerJourney);
  const resetScenario = useOfficeStore((state) => state.resetScenario);

  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const selectRoom = useOfficeStore((state) => state.selectRoom);

  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const agents = useOfficeStore((state) => state.agents);

  const cameraMode = useOfficeStore((state) => state.cameraMode);
  const setCameraMode = useOfficeStore((state) => state.setCameraMode);
  const resetCamera = useOfficeStore((state) => state.resetCamera);

  const graphicsQuality = useOfficeStore((state) => state.graphicsQuality);
  const setGraphicsQuality = useOfficeStore((state) => state.setGraphicsQuality);
  const isNightMode = useOfficeStore((state) => state.isNightMode);
  const toggleNightMode = useOfficeStore((state) => state.toggleNightMode);

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[940px] transition-all duration-300 ease-out ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Tab attached to top edge */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700/80 shadow-md backdrop-blur-md transition"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Controls Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls Dock</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-2.5 sm:p-3.5 text-slate-100">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5 overflow-x-auto gap-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'journey'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-sky-400" />
              <span>Task Simulation</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'rooms'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Rooms (7)</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'agents'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agents (7)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'settings'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diorama Settings</span>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => useOfficeStore.getState().toggleOwnerConsole()}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600/90 hover:bg-blue-500 text-white transition flex items-center gap-1 shadow-sm"
              title="Buka / Tutup Konsol Perintah Owner & AI Chat"
            >
              <Bot className="w-3 h-3" />
              <span>Konsol Owner</span>
            </button>
            <button
              onClick={onOpenTaskBoard}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 border border-slate-700/60"
            >
              <Briefcase className="w-3 h-3 text-sky-400" />
              <span>Task Board</span>
            </button>
            <button
              onClick={onOpenActivityLogs}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 border border-slate-700/60"
            >
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>Activity Log</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Journey & Simulation (Core requirement!) */}
        {activeTab === 'journey' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Test Manager Journey Button */}
              <button
                disabled={simulation.isActive}
                onClick={startManagerJourney}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition ${
                  simulation.isActive
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-600/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Test Manager Journey</span>
              </button>

              {/* Reset Scenario Button */}
              <button
                onClick={resetScenario}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Scenario</span>
              </button>
            </div>

            {/* Current Journey Status & Step Timeline */}
            <div className="flex-1 bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-800/80">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wide">
                  State: {simulation.currentStep.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {simulation.isActive ? `${simulation.progress}% Complete` : 'Ready to Launch'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug line-clamp-1">
                {simulation.stepDescription}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Rooms View Selector */}
        {activeTab === 'rooms' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={resetCamera}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                cameraMode === 'overview'
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full Overview</span>
            </button>

            {ROOMS.map((room) => {
              const isSelected = selectedRoomId === room.id && cameraMode === 'room_focus';
              return (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold border-blue-400 shadow-md'
                      : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: room.colorAccent }}
                  />
                  <span>{room.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 3: Agents Selector & Statuses */}
        {activeTab === 'agents' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {agents.map((agent) => {
              const isSelected = selectedAgentId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(agent.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition border whitespace-nowrap ${
                    isSelected
                      ? 'bg-sky-950/80 border-sky-400 text-sky-200 ring-1 ring-sky-400/50'
                      : 'bg-slate-800/80 hover:bg-slate-750 border-slate-750 text-slate-300'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shadow-sm"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold leading-tight text-white">{agent.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{agent.title.split(' ')[0]}</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-400">{agent.activityState}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 4: Diorama Settings */}
        {activeTab === 'settings' && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Graphics Quality */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Render Quality:</span>
              {(['high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setGraphicsQuality(q)}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold tracking-wider transition ${
                    graphicsQuality === q
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Lighting Mode */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Lighting:</span>
              <button
                onClick={toggleNightMode}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
              >
                {isNightMode ? 'Night Cyber Ambiance' : 'Studio Daylight'}
              </button>
            </div>

            {/* Camera View Mode */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Active Cam:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-sky-400 uppercase">
                {cameraMode.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
