import React, { useState, useEffect } from 'react';
import { OfficeScene } from './components/3d/OfficeScene';
import { TopBar } from './components/ui/TopBar';
import { DialogueOverlay } from './components/ui/DialogueOverlay';
import { BottomControlDock } from './components/ui/BottomControlDock';
import { OwnerCommandConsole } from './components/ui/OwnerCommandConsole';
import { AgentDetailModal } from './components/ui/AgentDetailModal';
import { RoomDetailModal } from './components/ui/RoomDetailModal';
import { TaskBoardModal } from './components/ui/TaskBoardModal';
import { ActivityLogModal } from './components/ui/ActivityLogModal';
import { useOfficeStore } from './store/officeStore';

export default function App() {
  const [isTaskBoardOpen, setIsTaskBoardOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  const isCinemaMode = useOfficeStore((state) => state.isCinemaMode);
  const checkHealth = useOfficeStore((state) => state.checkHealth);
  const fetchBackendState = useOfficeStore((state) => state.fetchBackendState);

  // Sync state with backend on mount and poll periodically
  useEffect(() => {
    checkHealth();
    fetchBackendState();

    const interval = setInterval(() => {
      fetchBackendState();
    }, 6000);

    return () => clearInterval(interval);
  }, [checkHealth, fetchBackendState]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0f1d] text-slate-100">
      {/* 3D Diorama Canvas */}
      <div className="absolute inset-0 z-0">
        <OfficeScene />
      </div>

      {/* Top Header & Simulation Controls */}
      <TopBar
        onOpenTaskBoard={() => setIsTaskBoardOpen(true)}
        onOpenActivityLogs={() => setIsActivityLogOpen(true)}
      />

      {/* Live Agent Conversation Dialogue Bubbles */}
      <DialogueOverlay />

      {/* Owner Command Console & AI Workflow Link */}
      {!isCinemaMode && <OwnerCommandConsole />}

      {/* Unified Bottom Control Dock (collapsible, 100% viewport clearance) */}
      {!isCinemaMode && (
        <BottomControlDock
          onOpenTaskBoard={() => setIsTaskBoardOpen(true)}
          onOpenActivityLogs={() => setIsActivityLogOpen(true)}
        />
      )}

      {/* Interactive Modals & Drawers */}
      <AgentDetailModal />
      <RoomDetailModal />
      <TaskBoardModal
        isOpen={isTaskBoardOpen}
        onClose={() => setIsTaskBoardOpen(false)}
      />
      <ActivityLogModal
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
      />
    </main>
  );
}
