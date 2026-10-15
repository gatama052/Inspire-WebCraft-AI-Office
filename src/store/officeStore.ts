import { create } from 'zustand';
import {
  Agent,
  CameraViewMode,
  ChatMessage,
  DialogueBubble,
  JourneyStep,
  RoomId,
  SimulationState,
  Task,
  TaskEvent,
  WorkPlan
} from '../types/office';
import { INITIAL_AGENTS, INITIAL_TASKS, ROOMS, WAYPOINTS } from '../constants/officeData';
import { findNearestWaypointId, findPathAStar } from '../utils/pathfinding';
import { processLocalOwnerCommand, LocalSimulationResult } from '../utils/localSimulationEngine';

interface OfficeState {
  // World State
  agents: Agent[];
  tasks: Task[];
  plans: WorkPlan[];
  conversations: ChatMessage[];
  activityLogs: TaskEvent[];
  activeDialogues: DialogueBubble[];
  selectedAgentId: string | null;
  selectedRoomId: RoomId | null;
  cameraMode: CameraViewMode;
  cameraResetTrigger: number;
  fitOfficeTrigger: number;
  fitOffice: () => void;

  // AI & Simulation Mode
  aiConfigured: boolean;
  isBackendConnected: boolean;
  isSendingCommand: boolean;
  commandError: string | null;
  activePlan: WorkPlan | null;
  isOwnerConsoleOpen: boolean;

  // Simulation Engine State
  simulation: SimulationState;

  // Graphics & Environment
  graphicsQuality: 'high' | 'medium' | 'low';
  isNightMode: boolean;
  isCinemaMode: boolean;
  soundEnabled: boolean;

  // Actions
  fetchBackendState: () => Promise<void>;
  checkHealth: () => Promise<void>;

  selectAgent: (agentId: string | null) => void;
  selectRoom: (roomId: RoomId | null) => void;
  setCameraMode: (mode: CameraViewMode) => void;
  resetCamera: () => void;
  setGraphicsQuality: (quality: 'high' | 'medium' | 'low') => void;
  toggleNightMode: () => void;
  toggleCinemaMode: () => void;
  toggleSound: () => void;
  toggleOwnerConsole: () => void;
  setOwnerConsoleOpen: (open: boolean) => void;

  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  moveAgentToWaypoint: (agentId: string, targetWaypointId: string) => boolean;

  // AI & Local Simulation Workflow Actions
  sendOwnerCommand: (instruction: string) => Promise<boolean>;
  approvePlan: (planId: string, approved: boolean, feedback?: string) => Promise<boolean>;
  executeTask: (taskId: string) => Promise<boolean>;
  evaluateCEO: (planId?: string) => Promise<boolean>;

  // Manual / Quick Task Management
  createTask: (
    title: string,
    description: string,
    category: Task['category'],
    assignedAgentId: string,
    priority: Task['priority']
  ) => void;
  updateTaskProgress: (taskId: string, progress: number, status?: Task['status']) => void;

  // Logging & Dialogues
  addLog: (
    actorId: string,
    actorName: string,
    eventType: TaskEvent['eventType'],
    message: string,
    roomId?: RoomId,
    taskId?: string,
    planId?: string
  ) => void;
  addDialogue: (speakerId: string, text: string, durationMs?: number) => void;
  clearDialogue: (id: string) => void;

  // Simulation Engine Actions
  startManagerJourney: () => void;
  resetScenario: () => void;
  setJourneyStep: (step: JourneyStep, description: string, progress: number) => void;
}

const roleToCategory: Record<string, Task['category']> = {
  programmer: 'Website Development',
  creative_strategist: 'Marketing Strategy',
  content_planner: 'Content Planning',
  content_creator: 'Content Production',
  ceo: 'Executive Review',
  manager: 'Marketing Strategy'
};

const roleToAgentId: Record<string, string> = {
  programmer: 'agent_programmer',
  creative_strategist: 'agent_creative',
  content_planner: 'agent_planner',
  content_creator: 'agent_creator',
  ceo: 'agent_ceo',
  manager: 'agent_manager'
};

export const useOfficeStore = create<OfficeState>((set, get) => ({
  agents: INITIAL_AGENTS,
  tasks: INITIAL_TASKS,
  plans: [],
  conversations: [
    {
      id: 'msg_init',
      sender: 'manager',
      senderName: 'Diana (Manager Agent)',
      text: 'Selamat datang, Pak Yoga. Saya Diana, Operations Manager Inspire WebCraft. Seluruh workstation tim agen AI (Alex, Maya, David, Zara, Victor) telah aktif. Silakan berikan instruksi bisnis Anda melalui Command Console ini.',
      timestamp: new Date().toLocaleTimeString(),
      actionRequired: 'none'
    }
  ],
  activityLogs: [
    {
      id: 'log_init_1',
      timestamp: '10:00:15',
      actorId: 'agent_owner',
      actorName: 'Pak Yoga',
      actorRole: 'owner',
      eventType: 'status_changed',
      message: 'Inspire WebCraft AI Office online. Workstation dan agen AI aktif.',
      roomId: 'owner_office'
    }
  ],
  activeDialogues: [],
  selectedAgentId: null,
  selectedRoomId: null,
  cameraMode: 'overview',
  cameraResetTrigger: 0,
  fitOfficeTrigger: 0,
  fitOffice: () => set((state) => ({ fitOfficeTrigger: state.fitOfficeTrigger + 1 })),

  aiConfigured: true,
  isBackendConnected: true,
  isSendingCommand: false,
  commandError: null,
  activePlan: null,
  isOwnerConsoleOpen: true,

  simulation: {
    isActive: false,
    isPaused: false,
    currentStep: 'idle',
    progress: 0,
    stepDescription: 'Kantor beroperasi normal. Menunggu instruksi dari Pak Yoga.',
    targetAgentId: undefined
  },

  graphicsQuality: 'high',
  isNightMode: false,
  isCinemaMode: false,
  soundEnabled: true,

  // --- Backend Sync (Optional Background Check) ---
  checkHealth: async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        set({ isBackendConnected: true, aiConfigured: true });
      }
    } catch {
      // In local simulation mode, app is always fully functional locally!
      set({ isBackendConnected: true, aiConfigured: true });
    }
  },

  fetchBackendState: async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          isBackendConnected: true,
          conversations: data.conversations?.length ? data.conversations : state.conversations,
          plans: data.plans?.length ? data.plans : state.plans,
          activePlan: data.plans?.find((p: WorkPlan) => p.status === 'proposed') || state.activePlan,
          tasks: data.tasks?.length ? data.tasks : state.tasks,
          activityLogs: data.logs?.length ? data.logs : state.activityLogs
        }));
      }
    } catch {
      // Silently continue in local simulation mode
    }
  },

  selectAgent: (agentId) => {
    set((state) => {
      if (agentId) {
        const agent = state.agents.find((a) => a.id === agentId);
        return {
          selectedAgentId: agentId,
          cameraMode: 'follow_agent',
          selectedRoomId: agent ? agent.roomId : null
        };
      }
      return { selectedAgentId: null };
    });
  },

  selectRoom: (roomId) => {
    set({
      selectedRoomId: roomId,
      cameraMode: roomId ? 'room_focus' : 'overview'
    });
  },

  setCameraMode: (mode) => set({ cameraMode: mode }),

  resetCamera: () => {
    set((state) => ({
      cameraMode: 'overview',
      selectedAgentId: null,
      selectedRoomId: null,
      cameraResetTrigger: state.cameraResetTrigger + 1
    }));
  },

  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
  toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),
  toggleCinemaMode: () => set((state) => ({ isCinemaMode: !state.isCinemaMode })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleOwnerConsole: () => set((state) => ({ isOwnerConsoleOpen: !state.isOwnerConsoleOpen })),
  setOwnerConsoleOpen: (open) => set({ isOwnerConsoleOpen: open }),

  updateAgent: (agentId, updates) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      )
    }));
  },

  moveAgentToWaypoint: (agentId, targetWaypointId) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === agentId);
    if (!agent) return false;

    const startWaypointId = findNearestWaypointId(agent.position);
    if (!startWaypointId) return false;

    if (startWaypointId === targetWaypointId) {
      const targetWp = WAYPOINTS[targetWaypointId];
      if (targetWp) {
        get().updateAgent(agentId, {
          position: { ...targetWp.position },
          currentPath: [],
          pathProgress: 0,
          activityState: targetWp.type.includes('seat') ? 'sitting' : 'standing'
        });
      }
      return true;
    }

    const path = findPathAStar(startWaypointId, targetWaypointId);
    if (!path || path.length === 0) return false;

    get().updateAgent(agentId, {
      currentPath: path,
      pathProgress: 0,
      activityState: 'walking'
    });

    get().addLog(
      agentId,
      agent.name,
      'navigation_started',
      `Bergerak dari ${startWaypointId} menuju ${targetWaypointId}`,
      agent.roomId
    );

    return true;
  },

  // ========================================================
  // FAST LOCAL SIMULATION WORKFLOW (100% RELIABLE & OFFLINE)
  // ========================================================

  sendOwnerCommand: async (instruction: string) => {
    if (!instruction || !instruction.trim()) return false;
    set({ isSendingCommand: true, commandError: null });

    const trimmed = instruction.trim();

    // 1. Post Owner's message to chat feed immediately
    const ownerMsg: ChatMessage = {
      id: `msg_owner_${Date.now()}`,
      sender: 'owner',
      senderName: 'Pak Yoga (Owner)',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
      isPending: false
    };

    set((state) => ({
      conversations: [...state.conversations, ownerMsg]
    }));

    // Log Owner instruction
    get().addLog(
      'agent_owner',
      'Pak Yoga',
      'instruction_received',
      `Instruksi baru dari Pak Yoga: "${trimmed.slice(0, 90)}${trimmed.length > 90 ? '...' : ''}"`,
      'owner_office'
    );

    // Manager Agent Diana enters thinking state
    get().updateAgent('agent_manager', { activityState: 'thinking' });

    // 2. Process locally with the simulation engine
    const simResult: LocalSimulationResult = processLocalOwnerCommand(trimmed);

    // If it's conversational / smalltalk (not a work order)
    if (!simResult.isActionable || !simResult.proposedPlan) {
      const managerMsg: ChatMessage = {
        id: `msg_mgr_${Date.now()}`,
        sender: 'manager',
        senderName: 'Diana (Manager Agent)',
        text: simResult.managerReply,
        timestamp: new Date().toLocaleTimeString(),
        actionRequired: 'none'
      };

      set((state) => ({
        conversations: [...state.conversations, managerMsg],
        isSendingCommand: false,
        commandError: null
      }));

      get().updateAgent('agent_manager', { activityState: 'talking' });
      get().addDialogue('agent_manager', simResult.managerReply, 4500);

      setTimeout(() => {
        get().updateAgent('agent_manager', { activityState: 'sitting' });
      }, 4500);

      return true;
    }

    // It's an actionable work order: create proposed plan!
    const plan = simResult.proposedPlan;

    const managerReplyMsg: ChatMessage = {
      id: `msg_mgr_${Date.now()}`,
      sender: 'manager',
      senderName: 'Diana (Manager Agent)',
      text: simResult.managerReply,
      timestamp: new Date().toLocaleTimeString(),
      planId: plan.id,
      actionRequired: 'approval'
    };

    set((state) => ({
      conversations: [...state.conversations, managerReplyMsg],
      activePlan: plan,
      plans: [plan, ...state.plans],
      isSendingCommand: false,
      commandError: null
    }));

    get().addLog(
      'agent_manager',
      'Diana',
      'plan_proposed',
      `Diana menyusun rencana kerja: "${plan.title}" (${plan.steps.length} tugas). Menunggu persetujuan Pak Yoga.`,
      'manager_office',
      undefined,
      plan.id
    );

    get().updateAgent('agent_manager', { activityState: 'talking' });
    get().addDialogue('agent_manager', simResult.dialogueWithYoga, 4500);

    setTimeout(() => {
      get().updateAgent('agent_manager', { activityState: 'sitting' });
    }, 4500);

    // Optional background sync with server if available
    try {
      fetch('/api/owner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      }).catch(() => {});
    } catch {
      // Ignore background sync errors in dummy mode
    }

    return true;
  },

  approvePlan: async (planId: string, approved: boolean, feedback?: string) => {
    const state = get();
    const plan = state.plans.find((p) => p.id === planId) || state.activePlan;
    if (!plan) return false;

    if (!approved) {
      set((s) => ({
        activePlan: null,
        plans: s.plans.map((p) => (p.id === planId ? { ...p, status: 'rejected' } : p)),
        conversations: [
          ...s.conversations,
          {
            id: `msg_owner_reject_${Date.now()}`,
            sender: 'owner',
            senderName: 'Pak Yoga (Owner)',
            text: `Rencana kerja ditolak/perlu revisi: ${feedback || 'Perlu penyesuaian strategi.'}`,
            timestamp: new Date().toLocaleTimeString()
          },
          {
            id: `msg_mgr_reject_ack_${Date.now()}`,
            sender: 'manager',
            senderName: 'Diana (Manager Agent)',
            text: 'Baik Pak Yoga, saya akan merevisi rencana kerja sesuai masukan Bapak.',
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      }));

      get().addLog(
        'agent_owner',
        'Pak Yoga',
        'plan_rejected',
        `Pak Yoga menolak rencana kerja "${plan.title}" untuk revisi.`,
        'owner_office',
        undefined,
        plan.id
      );

      return true;
    }

    // 1. Approved! Generate Tasks with high-fidelity Deliverables
    const simResult = processLocalOwnerCommand(plan.ownerInstruction);

    const newTasks: Task[] = plan.steps.map((st) => {
      const assignedAgentId = roleToAgentId[st.assignedRole] || 'agent_programmer';
      const deliverableText =
        (simResult.deliverables && simResult.deliverables[assignedAgentId]) ||
        `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)\n\nDeliverable: ${st.title}\nSpesifikasi: ${st.criteria}\nStatus: Terverifikasi oleh sistem.`;

      return {
        id: `task_${Date.now()}_${st.stepNumber}`,
        planId: plan.id,
        title: st.title,
        description: st.description,
        objective: st.title,
        successCriteria: st.criteria,
        category: roleToCategory[st.assignedRole] || 'Website Development',
        assignedAgentId,
        assignedRole: st.assignedRole,
        status: 'in_progress',
        priority: 'high',
        progress: 15,
        deliverable: deliverableText,
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString()
      };
    });

    // Update state with approved plan, tasks, and chat confirmation
    set((s) => ({
      activePlan: { ...plan, status: 'approved' },
      plans: s.plans.map((p) => (p.id === planId ? { ...p, status: 'approved' } : p)),
      tasks: [...newTasks, ...s.tasks],
      conversations: [
        ...s.conversations,
        {
          id: `msg_owner_approve_${Date.now()}`,
          sender: 'owner',
          senderName: 'Pak Yoga (Owner)',
          text: 'Rencana kerja disetujui. Silakan tim mulai mengeksekusi tugas.',
          timestamp: new Date().toLocaleTimeString()
        },
        {
          id: `msg_mgr_ack_${Date.now()}`,
          sender: 'manager',
          senderName: 'Diana (Manager Agent)',
          text: 'Terima kasih atas persetujuannya, Pak Yoga! Saya segera menuju ke workstation tim untuk mendelegasikan tugas.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    }));

    get().addLog(
      'agent_owner',
      'Pak Yoga',
      'plan_approved',
      `Pak Yoga menyetujui rencana kerja: "${plan.title}"`,
      'owner_office',
      undefined,
      plan.id
    );

    get().addLog(
      'agent_manager',
      'Diana',
      'task_assigned',
      `Diana mendelegasikan ${newTasks.length} tugas ke tim agen AI.`,
      'manager_office',
      undefined,
      plan.id
    );

    // 2. Multi-Step Animated 3D Journey Simulation
    const primaryTargetId = simResult.primaryTargetAgentId || newTasks[0]?.assignedAgentId || 'agent_programmer';
    const primaryTargetAgent = get().agents.find((a) => a.id === primaryTargetId);
    const targetWaypointId = simResult.primaryInteractWaypointId || 'wp_programmer_interact';

    // Step A: Diana stands up and announces delegation
    get().updateAgent('agent_manager', { activityState: 'standing' });
    get().addDialogue(
      'agent_manager',
      `Rencana disetujui Pak Yoga! Saya delegasikan tugas ke ${primaryTargetAgent?.name || 'tim'}.`,
      3500
    );

    get().setJourneyStep(
      'navigating_to_programmer',
      `Diana bergerak menuju ${primaryTargetAgent?.name || 'workstation tim'} untuk mendelegasikan tugas.`,
      20
    );

    setTimeout(() => {
      get().moveAgentToWaypoint('agent_manager', targetWaypointId);
    }, 600);

    // Step B: Diana arrives, speaks with agent, and agent starts working
    setTimeout(() => {
      const targetAgent = get().agents.find((a) => a.id === primaryTargetId);
      const dianaText =
        simResult.agentDialogues?.[primaryTargetId]?.diana ||
        `${targetAgent?.name || 'Tim'}, ini tugas baru dari Pak Yoga: "${newTasks[0]?.title}".`;
      const agentText =
        simResult.agentDialogues?.[primaryTargetId]?.agent ||
        'Siap Diana! Segera saya eksekusi sekarang sesuai arahan Pak Yoga.';

      get().updateAgent('agent_manager', { activityState: 'talking' });
      get().addDialogue('agent_manager', dianaText, 3800);

      setTimeout(() => {
        if (targetAgent) {
          get().updateAgent(targetAgent.id, { activityState: 'talking' });
          get().addDialogue(targetAgent.id, agentText, 3500);

          setTimeout(() => {
            // Set all assigned agents to active working state
            newTasks.forEach((t) => {
              const a = get().agents.find((ag) => ag.id === t.assignedAgentId);
              if (a) {
                get().updateAgent(a.id, {
                  activityState: a.role === 'programmer' ? 'typing' : 'working'
                });
              }
            });
          }, 3500);
        }
      }, 4000);
    }, 3200);

    // Step C: Tasks progress simulation
    setTimeout(() => {
      get().setJourneyStep(
        'interacting_with_programmer',
        `Tim agen AI sedang mengeksekusi tugas "${plan.title}"...`,
        55
      );
      newTasks.forEach((t) => get().updateTaskProgress(t.id, 65));
    }, 8500);

    // Step D: Tasks complete, Diana heads to CEO Victor
    setTimeout(() => {
      newTasks.forEach((t) => {
        get().updateTaskProgress(t.id, 100, 'completed');
        get().addLog(
          t.assignedAgentId,
          get().agents.find((a) => a.id === t.assignedAgentId)?.name || 'Agent',
          'task_completed',
          `Tugas "${t.title}" berhasil diselesaikan. Deliverable tersimpan di Task Board.`,
          undefined,
          t.id,
          plan.id
        );
      });

      get().setJourneyStep(
        'navigating_to_ceo',
        'Seluruh tugas selesai! Diana bergerak menuju Ruang CEO untuk meminta audit eksekutif dari Victor.',
        80
      );

      get().moveAgentToWaypoint('agent_manager', 'wp_ceo_interact');
    }, 12000);

    // Step E: Diana at CEO office, Victor evaluates
    setTimeout(() => {
      get().setJourneyStep('reporting_to_ceo', 'Diana mempresentasikan hasil deliverable kepada CEO Victor.', 90);
      get().updateAgent('agent_manager', { activityState: 'talking', rotationY: Math.PI / 2 });
      get().updateAgent('agent_ceo', { activityState: 'listening', rotationY: -Math.PI / 2 });

      get().addDialogue('agent_manager', 'Pak Victor, seluruh tugas dari Pak Yoga telah tuntas. Mohon diaudit mutunya.', 3500);

      setTimeout(() => {
        get().updateAgent('agent_ceo', { activityState: 'reviewing' });
        get().addDialogue('agent_ceo', 'Audit eksekutif selesai: Kualitas deliverable memenuhi standar Inspire WebCraft!', 3500);

        get().addLog(
          'agent_ceo',
          'Victor',
          'ceo_evaluated',
          `CEO Victor menyelesaikan evaluasi eksekutif untuk rencana "${plan.title}". Skor: 96/100.`,
          'ceo_office',
          undefined,
          plan.id
        );
      }, 3600);
    }, 15500);

    // Step F: Diana returns to desk, sits down, and submits final report to Pak Yoga
    setTimeout(() => {
      get().moveAgentToWaypoint('agent_manager', 'wp_manager_seat');
      get().setJourneyStep('completed', 'Alur kerja tuntas! Deliverable siap ditinjau Pak Yoga.', 100);

      setTimeout(() => {
        get().updateAgent('agent_manager', { activityState: 'sitting' });
        get().updateAgent('agent_ceo', { activityState: 'sitting' });
        newTasks.forEach((t) => {
          const a = get().agents.find((ag) => ag.id === t.assignedAgentId);
          if (a) get().updateAgent(a.id, { activityState: 'sitting' });
        });

        const finalReportText = `Laporan Selesai untuk Pak Yoga:\n\nSeluruh tugas dalam rencana "${plan.title}" telah tuntas diselesaikan oleh tim agen AI!\n\nRingkasan Hasil Deliverable:\n${newTasks.map((t) => `• ${t.title} [Status: Completed]`).join('\n')}\n\n${simResult.ceoReview || 'Evaluasi CEO Victor: Standar kualitas terpenuhi dengan predikat sangat baik.'}\n\nSeluruh dokumen deliverable telah tersimpan dan siap Bapak periksa pada Task Board.`;

        set((s) => ({
          conversations: [
            ...s.conversations,
            {
              id: `msg_report_${Date.now()}`,
              sender: 'manager',
              senderName: 'Diana (Manager Agent)',
              text: finalReportText,
              timestamp: new Date().toLocaleTimeString(),
              actionRequired: 'none'
            }
          ]
        }));

        get().addDialogue('agent_manager', 'Pak Yoga, laporan akhir proyek telah saya serahkan di Command Console!', 4500);
        get().addLog(
          'agent_manager',
          'Diana',
          'report_submitted',
          `Diana menyerahkan laporan penyelesaian akhir rencana "${plan.title}" kepada Pak Yoga.`,
          'manager_office',
          undefined,
          plan.id
        );
      }, 3500);
    }, 20000);

    // Optional background sync with server
    try {
      fetch('/api/owner/approve-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, approved, feedback })
      }).catch(() => {});
    } catch {
      // Ignore background sync errors in dummy mode
    }

    return true;
  },

  executeTask: async (taskId: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return false;

    const assignedAgent = get().agents.find((a) => a.id === task.assignedAgentId);

    // Set 3D agent to active working/typing animation
    if (assignedAgent) {
      get().updateAgent(assignedAgent.id, {
        activityState: assignedAgent.role === 'programmer' ? 'typing' : 'working'
      });
      get().addDialogue(
        assignedAgent.id,
        `Mengeksekusi tugas: "${task.title}"...`,
        3500
      );
    }

    // Simulate task progress smoothly
    get().updateTaskProgress(taskId, 45, 'in_progress');

    setTimeout(() => {
      get().updateTaskProgress(taskId, 85, 'in_progress');

      setTimeout(() => {
        get().updateTaskProgress(taskId, 100, 'completed');

        if (assignedAgent) {
          get().addDialogue(
            assignedAgent.id,
            `Tugas "${task.title}" selesai dikerjakan! Deliverable tersimpan.`,
            4000
          );
          setTimeout(() => {
            get().updateAgent(assignedAgent.id, { activityState: 'sitting' });
          }, 4000);
        }

        get().addLog(
          task.assignedAgentId,
          assignedAgent?.name || 'Agent',
          'task_completed',
          `Tugas "${task.title}" berhasil diselesaikan.`,
          undefined,
          task.id,
          task.planId
        );
      }, 1500);
    }, 1500);

    // Optional background sync
    try {
      fetch(`/api/tasks/${taskId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    } catch {
      // Ignore background sync errors
    }

    return true;
  },

  evaluateCEO: async (planId?: string) => {
    get().updateAgent('agent_ceo', { activityState: 'reviewing' });
    get().addDialogue('agent_ceo', 'Saya sedang mengaudit mutu deliverable seluruh tim agen...', 4000);

    setTimeout(() => {
      get().addDialogue('agent_ceo', 'Evaluasi eksekutif selesai. Kualitas deliverable memenuhi standar Inspire WebCraft!', 4000);
      get().updateAgent('agent_ceo', { activityState: 'sitting' });

      get().addLog(
        'agent_ceo',
        'Victor',
        'ceo_evaluated',
        'CEO Victor menyelesaikan evaluasi eksekutif. Kualitas kerja memenuhi standar perusahaan.',
        'ceo_office',
        undefined,
        planId
      );
    }, 3500);

    // Optional background sync
    try {
      fetch('/api/tasks/evaluate-ceo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      }).catch(() => {});
    } catch {
      // Ignore
    }

    return true;
  },

  createTask: (title, description, category, assignedAgentId, priority) => {
    const agent = get().agents.find((a) => a.id === assignedAgentId);
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      description,
      objective: title,
      successCriteria: 'Hasil deliverable siap dipakai sesuai spesifikasi',
      category,
      assignedAgentId,
      assignedRole: agent?.role || 'programmer',
      status: 'assigned',
      priority,
      progress: 0,
      deliverable: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)\n\nTugas: ${title}\nDeskripsi: ${description}\nStatus: Siap diimplementasikan.`,
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString()
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks]
    }));

    get().addLog(
      assignedAgentId,
      agent?.name || 'Agent',
      'task_assigned',
      `Tugas baru dibuat: "${title}"`
    );
  },

  updateTaskProgress: (taskId, progress, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress: Math.min(100, Math.max(0, progress)),
              status: status ?? (progress >= 100 ? 'completed' : task.status),
              updatedAt: new Date().toLocaleTimeString()
            }
          : task
      )
    }));
  },

  addLog: (actorId, actorName, eventType, message, roomId, taskId, planId) => {
    const actor = get().agents.find((a) => a.id === actorId);
    const newLog: TaskEvent = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      actorId,
      actorName,
      actorRole: actor?.role || 'manager',
      eventType,
      message,
      roomId,
      taskId,
      planId
    };

    set((state) => ({
      activityLogs: [newLog, ...state.activityLogs.slice(0, 59)]
    }));
  },

  addDialogue: (speakerId, text, durationMs = 4500) => {
    const speaker = get().agents.find((a) => a.id === speakerId);
    const newBubble: DialogueBubble = {
      id: `bubble_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      speakerId,
      speakerName: speaker?.name || 'Agent',
      speakerRole: speaker?.role || 'manager',
      text,
      timestamp: Date.now(),
      durationMs
    };

    set((state) => ({
      activeDialogues: [...state.activeDialogues.filter((d) => d.speakerId !== speakerId), newBubble]
    }));

    setTimeout(() => {
      get().clearDialogue(newBubble.id);
    }, durationMs);
  },

  clearDialogue: (id) => {
    set((state) => ({
      activeDialogues: state.activeDialogues.filter((d) => d.id !== id)
    }));
  },

  setJourneyStep: (step, description, progress) => {
    set({
      simulation: {
        isActive: step !== 'idle' && step !== 'completed' && step !== 'blocked',
        isPaused: false,
        currentStep: step,
        progress,
        stepDescription: description
      }
    });
  },

  resetScenario: () => {
    const resetAgents = INITIAL_AGENTS.map((initial) => ({
      ...initial,
      position: { ...initial.deskPosition },
      rotationY: initial.deskRotationY,
      activityState: initial.activityState,
      currentPath: [],
      pathProgress: 0
    }));

    set({
      agents: resetAgents,
      simulation: {
        isActive: false,
        isPaused: false,
        currentStep: 'idle',
        progress: 0,
        stepDescription: 'Skenario direset. Seluruh agen kembali ke workstation masing-masing.'
      },
      activeDialogues: []
    });

    get().addLog('agent_manager', 'Diana', 'status_changed', 'Reset skenario: Seluruh agen kembali ke workstation.');
  },

  startManagerJourney: () => {
    const state = get();
    if (state.simulation.isActive) return;

    set({
      selectedAgentId: 'agent_manager',
      cameraMode: 'follow_agent',
      simulation: {
        isActive: true,
        isPaused: false,
        currentStep: 'standing_up',
        progress: 5,
        stepDescription: 'Diana berdiri dari meja Manager dan menyiapkan brief tugas atas arahan Pak Yoga.'
      }
    });

    get().addLog(
      'agent_manager',
      'Diana',
      'status_changed',
      'Simulasi alur Manager dimulai: Membriefer Alex (Programmer) dan melapor ke Victor (CEO).'
    );

    get().updateAgent('agent_manager', {
      activityState: 'standing'
    });

    setTimeout(() => {
      const currentState = get();
      if (!currentState.simulation.isActive) return;

      set({
        simulation: {
          isActive: true,
          isPaused: false,
          currentStep: 'navigating_to_programmer',
          progress: 25,
          stepDescription: 'Diana berjalan melewati koridor menuju Programmer Room.'
        }
      });

      const moved = get().moveAgentToWaypoint('agent_manager', 'wp_programmer_interact');
      if (!moved) {
        set({
          simulation: {
            isActive: false,
            isPaused: false,
            currentStep: 'blocked',
            progress: 25,
            stepDescription: 'Jalur ke Programmer Room terhalang.'
          }
        });
      }
    }, 1200);
  }
}));
