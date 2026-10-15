import React, { useState, useEffect } from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Users,
  Briefcase,
  Bot
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';

export const TopBar: React.FC<{
  onOpenTaskBoard: () => void;
  onOpenActivityLogs: () => void;
}> = ({ onOpenTaskBoard, onOpenActivityLogs }) => {
  const simulation = useOfficeStore((state) => state.simulation);
  const resetCamera = useOfficeStore((state) => state.resetCamera);
  const isNightMode = useOfficeStore((state) => state.isNightMode);
  const toggleNightMode = useOfficeStore((state) => state.toggleNightMode);
  const isCinemaMode = useOfficeStore((state) => state.isCinemaMode);
  const toggleCinemaMode = useOfficeStore((state) => state.toggleCinemaMode);
  const soundEnabled = useOfficeStore((state) => state.soundEnabled);
  const toggleSound = useOfficeStore((state) => state.toggleSound);
  const agents = useOfficeStore((state) => state.agents);
  const tasks = useOfficeStore((state) => state.tasks);
  const isOwnerConsoleOpen = useOfficeStore((state) => state.isOwnerConsoleOpen);
  const toggleOwnerConsole = useOfficeStore((state) => state.toggleOwnerConsole);
  const activePlan = useOfficeStore((state) => state.activePlan);

  const [simTime, setSimTime] = useState<string>('10:42 AM');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSimTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
      {/* Brand & Simulation Time */}
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
          IW
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
              Inspire WebCraft
            </h1>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              3D AI Office
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span>Sim Time: {simTime}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Virtual Operations Live</span>
          </p>
        </div>
      </div>

      {/* Center Scenario / Simulation Progress Banner */}
      {simulation.isActive && (
        <div className="pointer-events-auto max-w-md w-full bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-sky-500/50 shadow-xl shadow-sky-950/30">
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Scenario: {simulation.currentStep.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="font-mono text-[11px] text-slate-300">{simulation.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
            <div
              className="bg-gradient-to-r from-sky-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${simulation.progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-300 truncate">{simulation.stepDescription}</p>
        </div>
      )}

      {/* Top Right Quick Controls */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
        {/* Owner Command Console Toggle */}
        <button
          onClick={toggleOwnerConsole}
          title="Buka / Tutup Konsol Perintah Owner & AI Chat"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
            isOwnerConsoleOpen
              ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-sky-300" />
          <span>Konsol Owner</span>
          {activePlan && activePlan.status === 'proposed' && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        {/* Quick Task count */}
        <button
          onClick={onOpenTaskBoard}
          title="Buka Task Board"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Briefcase className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Tugas</span>
          <span className="bg-sky-500/20 text-sky-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
            {tasks.filter((t) => t.status === 'in_progress' || t.status === 'assigned').length}
          </span>
        </button>

        {/* Quick Log trigger */}
        <button
          onClick={onOpenActivityLogs}
          title="Activity Log"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Agents</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
            {agents.length}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Reset Camera button */}
        <button
          onClick={resetCamera}
          title="Reset Camera to Overview"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Night / Day toggle */}
        <button
          onClick={toggleNightMode}
          title={isNightMode ? 'Switch to Day Light' : 'Switch to Night Ambient'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Cinema Mode toggle */}
        <button
          onClick={toggleCinemaMode}
          title={isCinemaMode ? 'Exit Zen Mode (Show Controls)' : 'Enter Zen Mode (Hide Controls)'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          {isCinemaMode ? <Minimize2 className="w-4 h-4 text-sky-400" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
