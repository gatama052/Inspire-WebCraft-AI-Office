export type ActivityState =
  | 'idle'
  | 'sitting'
  | 'standing'
  | 'walking'
  | 'typing'
  | 'thinking'
  | 'talking'
  | 'listening'
  | 'working'
  | 'reviewing'
  | 'resting';

export type AgentRole =
  | 'owner'
  | 'manager'
  | 'programmer'
  | 'creative_strategist'
  | 'content_planner'
  | 'content_creator'
  | 'ceo';

export type RoomId =
  | 'owner_office'
  | 'manager_office'
  | 'programmer_room'
  | 'creative_room'
  | 'planning_room'
  | 'content_studio'
  | 'ceo_office'
  | 'corridor';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  roomId: RoomId;
  color: string;
  secondaryColor: string;
  hairColor: string;
  hairStyle: 'short' | 'ponytail' | 'curly' | 'sleek' | 'sidepart' | 'bun';
  hasGlasses?: boolean;
  hasHeadset?: boolean;
  avatarSeed: string;
  position: Vector3D;
  targetPosition?: Vector3D;
  rotationY: number; // in radians
  targetRotationY?: number;
  activityState: ActivityState;
  activeTaskId?: string;
  deskPosition: Vector3D;
  deskRotationY: number;
  currentPath: string[]; // Node IDs
  pathProgress: number; // 0 to 1
  bio: string;
  skills: string[];
}

export interface Room {
  id: RoomId;
  name: string;
  shortName: string;
  description: string;
  colorAccent: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: Vector3D;
  cameraTarget: Vector3D;
  cameraPosition: Vector3D;
  assignedAgentId: string;
  features: string[];
}

export interface WaypointNode {
  id: string;
  position: Vector3D;
  roomId: RoomId;
  type: 'workstation_seat' | 'workstation_approach' | 'interaction_point' | 'doorway' | 'hallway' | 'corridor_junction';
  connectedNodeIds: string[];
}

export type TaskStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  planId?: string;
  title: string;
  description: string;
  objective?: string;
  successCriteria?: string;
  category: 'Website Development' | 'Prompt Engineering' | 'Marketing Strategy' | 'Content Planning' | 'Content Production' | 'Executive Review';
  assignedAgentId: string;
  assignedRole: AgentRole;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; // 0 - 100
  deliverable?: string;
  validationStatus?: 'unvalidated' | 'passed' | 'failed' | 'requires_revision';
  errorReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  assignedRole: AgentRole;
  deliverableType: string;
  criteria: string;
}

export interface WorkPlan {
  id: string;
  title: string;
  goal: string;
  ownerInstruction: string;
  status: 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  steps: WorkPlanStep[];
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'manager' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  planId?: string;
  actionRequired?: 'approval' | 'clarification' | 'none';
  isPending?: boolean;
}

export interface TaskEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: AgentRole;
  eventType:
    | 'instruction_received'
    | 'plan_proposed'
    | 'plan_approved'
    | 'plan_rejected'
    | 'task_assigned'
    | 'task_started'
    | 'task_completed'
    | 'task_failed'
    | 'ceo_evaluated'
    | 'report_submitted'
    | 'navigation_started'
    | 'reached_destination'
    | 'dialogue_started'
    | 'task_progress'
    | 'status_changed';
  message: string;
  roomId?: RoomId;
  taskId?: string;
  planId?: string;
}

export interface DialogueBubble {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: AgentRole;
  text: string;
  timestamp: number;
  durationMs: number;
}

export type CameraViewMode = 'overview' | 'follow_agent' | 'room_focus';

export type WorkflowStep =
  | 'idle'
  | 'waiting_for_manager'
  | 'standing_up'
  | 'manager_traveling_to_owner'
  | 'manager_greeting_owner'
  | 'owner_instruction_discussion'
  | 'plan_waiting_for_approval'
  | 'manager_returning_to_office'
  | 'manager_assigning_tasks'
  | 'manager_coordinating_agents'
  | 'navigating_to_programmer'
  | 'interacting_with_programmer'
  | 'agent_working'
  | 'agent_reporting_to_manager'
  | 'manager_reviewing_results'
  | 'navigating_to_ceo'
  | 'reporting_to_ceo'
  | 'manager_traveling_to_ceo'
  | 'manager_reporting_to_ceo'
  | 'ceo_reviewing_report'
  | 'manager_traveling_to_owner'
  | 'manager_reporting_to_owner'
  | 'awaiting_owner_review'
  | 'returning'
  | 'completed'
  | 'paused'
  | 'cancelled'
  | 'blocked';

export type JourneyStep = WorkflowStep;

export interface DialogueLine {
  speakerId: string;
  speakerName: string;
  speakerRole: AgentRole;
  text: string;
  durationMs: number;
}

export interface CharacterInteraction {
  id: string;
  initiatorId: string;
  targetId: string;
  waypointId: string;
  purpose: string;
  dialogues: DialogueLine[];
  currentDialogueIndex: number;
  status: 'walking' | 'in_dialogue' | 'completed';
}

export interface SimulationState {
  isActive: boolean;
  isPaused: boolean;
  currentStep: WorkflowStep;
  progress: number;
  stepDescription: string;
  targetAgentId?: string;
  currentAgentIndex?: number;
  activeInteraction?: CharacterInteraction | null;
}
