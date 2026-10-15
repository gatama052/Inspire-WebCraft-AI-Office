import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import { processLocalOwnerCommand } from './src/utils/localSimulationEngine.ts';
import { AgentRole, WorkPlan, WorkPlanStep } from './src/types/office.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Persistence Data File Path
const DATA_FILE = path.resolve(__dirname, '.office_data.json');

// --- Types ---
export interface TaskItem {
  id: string;
  planId?: string;
  title: string;
  description: string;
  objective: string;
  successCriteria: string;
  assignedAgentId: string;
  assignedRole: AgentRole;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'failed' | 'cancelled';
  progress: number;
  deliverable?: string;
  validationStatus?: 'unvalidated' | 'passed' | 'failed' | 'requires_revision';
  errorReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'manager' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  planId?: string;
  actionRequired?: 'approval' | 'clarification' | 'none';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  eventType: 'instruction_received' | 'plan_proposed' | 'plan_approved' | 'plan_rejected' | 'task_assigned' | 'task_started' | 'task_completed' | 'task_failed' | 'ceo_evaluated' | 'report_submitted';
  message: string;
  taskId?: string;
  planId?: string;
}

interface OfficeDB {
  conversations: ChatMessage[];
  plans: WorkPlan[];
  tasks: TaskItem[];
  logs: ActivityLog[];
}

// Initial DB State — Strictly using Pak Yoga
const initialDB: OfficeDB = {
  conversations: [
    {
      id: 'msg_welcome',
      sender: 'manager',
      senderName: 'Diana (Manager Agent)',
      text: 'Selamat datang, Pak Yoga. Saya Diana, Manager Agent Inspire WebCraft. Seluruh ruangan dan tim agen AI (Alex, Maya, David, Zara, Victor) telah siap di workstation masing-masing. Silakan berikan arahan atau instruksi pekerjaan Anda.',
      timestamp: new Date().toLocaleTimeString(),
      actionRequired: 'none'
    }
  ],
  plans: [],
  tasks: [
    {
      id: 'task_default_1',
      title: 'Arsitektur Platform Kantor AI 3D Inspire WebCraft',
      description: 'Membangun simulasi visual 3D kantor miniatur, navigasi waypoint A*, dan orkestrasi tugas antaragen AI.',
      objective: 'Menyediakan workspace 3D interaktif yang lancar dengan agen otonom.',
      successCriteria: 'Rendering stabil, tidak ada karakter menembus dinding, dan responsivitas penuh.',
      assignedAgentId: 'agent_programmer',
      assignedRole: 'programmer',
      priority: 'high',
      status: 'completed',
      progress: 100,
      deliverable: 'HASIL SIMULASI — MODE DEMO\n\nStruktur Proyek:\n- React Three Fiber + Tailwind CSS\n- Graph Navigasi Waypoint 3D (A* Algorithm)\n- State Machine Kinematika Karakter & Dialog\n- Sistem Orkestrasi Tugas Lokal Bebas Kegagalan API',
      validationStatus: 'passed',
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString()
    }
  ],
  logs: [
    {
      id: 'log_boot',
      timestamp: new Date().toLocaleTimeString(),
      actorId: 'agent_manager',
      actorName: 'Diana',
      actorRole: 'manager',
      eventType: 'instruction_received',
      message: 'Sistem Operasional Inspire WebCraft aktif dalam Mode Demo Simulasi Lokal. Siap menerima instruksi dari Pak Yoga.'
    }
  ]
};

// Load or save DB with normalization (cleansing any old "Kurniawan" mentions)
function getDB(): OfficeDB {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Cleanse any old references
      if (parsed.conversations) {
        parsed.conversations = parsed.conversations.map((c: any) => ({
          ...c,
          senderName: c.senderName ? c.senderName.replace('Kurniawan', 'Pak Yoga') : c.senderName,
          text: c.text ? c.text.replace(/Kurniawan/g, 'Pak Yoga') : c.text
        }));
      }
      if (parsed.logs) {
        parsed.logs = parsed.logs.map((l: any) => ({
          ...l,
          actorName: l.actorName ? l.actorName.replace('Kurniawan', 'Pak Yoga') : l.actorName,
          message: l.message ? l.message.replace(/Kurniawan/g, 'Pak Yoga') : l.message
        }));
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DATA_FILE, using fallback in-memory DB:', err);
  }
  return initialDB;
}

function saveDB(db: OfficeDB) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DATA_FILE:', err);
  }
}

// Helper to get Gemini Client if available
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health & Config Check
app.get('/api/health', (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  res.json({
    status: 'ok',
    mode: 'DEMO MODE — LOCAL SIMULATION',
    aiConfigured: hasKey,
    model: hasKey ? 'gemini-3.8-flash' : 'local-simulation-engine',
    owner: 'Pak Yoga',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Get All Persistent State
app.get('/api/state', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    conversations: db.conversations,
    plans: db.plans,
    tasks: db.tasks,
    logs: db.logs
  });
});

// 3. Owner Submits Command to Manager Agent (100% Reliable Local Engine First)
app.post('/api/owner/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Instruksi Pak Yoga tidak boleh kosong.' });
  }

  const db = getDB();
  const trimmedMsg = message.trim();

  // Add Owner's message to conversation
  const ownerMsg: ChatMessage = {
    id: `msg_owner_${Date.now()}`,
    sender: 'owner',
    senderName: 'Pak Yoga (Owner)',
    text: trimmedMsg,
    timestamp: new Date().toLocaleTimeString(),
    actionRequired: 'none'
  };
  db.conversations.push(ownerMsg);

  // Log instruction
  db.logs.unshift({
    id: `log_${Date.now()}_inst`,
    timestamp: new Date().toLocaleTimeString(),
    actorId: 'agent_owner',
    actorName: 'Pak Yoga',
    actorRole: 'owner',
    eventType: 'instruction_received',
    message: `Instruksi baru dari Pak Yoga: "${trimmedMsg.slice(0, 100)}${trimmedMsg.length > 100 ? '...' : ''}"`
  });

  // Always process through local simulation engine to guarantee zero failure
  const simulationResult = processLocalOwnerCommand(trimmedMsg);

  if (!simulationResult.isActionable || !simulationResult.proposedPlan) {
    const managerReplyMsg: ChatMessage = {
      id: `msg_manager_${Date.now()}`,
      sender: 'manager',
      senderName: 'Diana (Manager Agent)',
      text: simulationResult.managerReply,
      timestamp: new Date().toLocaleTimeString(),
      actionRequired: 'none'
    };
    db.conversations.push(managerReplyMsg);
    saveDB(db);

    return res.json({
      success: true,
      ownerMessage: ownerMsg,
      managerReply: managerReplyMsg,
      simulationResult
    });
  }

  const planObj: WorkPlan = simulationResult.proposedPlan;
  db.plans.unshift(planObj);

  db.logs.unshift({
    id: `log_${Date.now()}_plan`,
    timestamp: new Date().toLocaleTimeString(),
    actorId: 'agent_manager',
    actorName: 'Diana',
    actorRole: 'manager',
    eventType: 'plan_proposed',
    message: `Diana menyusun rencana kerja: "${planObj.title}" (${planObj.steps.length} tugas). Menunggu persetujuan Pak Yoga.`,
    planId: planObj.id
  });

  const managerReplyMsg: ChatMessage = {
    id: `msg_manager_${Date.now()}`,
    sender: 'manager',
    senderName: 'Diana (Manager Agent)',
    text: simulationResult.managerReply,
    timestamp: new Date().toLocaleTimeString(),
    planId: planObj.id,
    actionRequired: 'approval'
  };
  db.conversations.push(managerReplyMsg);

  saveDB(db);

  return res.json({
    success: true,
    ownerMessage: ownerMsg,
    managerReply: managerReplyMsg,
    proposedPlan: planObj,
    simulationResult
  });
});

// 4. Owner Explicitly Approves or Rejects Plan
app.post('/api/owner/approve-plan', async (req: Request, res: Response) => {
  const { planId, approved, feedback } = req.body;
  if (!planId) {
    return res.status(400).json({ error: 'planId wajib disertakan.' });
  }

  const db = getDB();
  const plan = db.plans.find((p) => p.id === planId);
  if (!plan) {
    return res.status(404).json({ error: 'Rencana kerja tidak ditemukan.' });
  }

  if (approved) {
    plan.status = 'approved';
    plan.approvedAt = new Date().toLocaleTimeString();

    // Map roles to agent IDs
    const roleToAgentId: Record<string, string> = {
      programmer: 'agent_programmer',
      creative_strategist: 'agent_creative',
      content_planner: 'agent_planner',
      content_creator: 'agent_creator',
      ceo: 'agent_ceo',
      manager: 'agent_manager'
    };

    // Create formal task items in DB from the approved plan steps
    const newTasks: TaskItem[] = plan.steps.map((step, idx) => {
      const assignedId = roleToAgentId[step.assignedRole] || 'agent_programmer';
      return {
        id: `task_${plan.id}_${idx + 1}`,
        planId: plan.id,
        title: step.title,
        description: step.description,
        objective: plan.goal,
        successCriteria: step.criteria,
        assignedAgentId: assignedId,
        assignedRole: step.assignedRole,
        priority: idx === 0 ? 'urgent' : 'high',
        status: 'assigned',
        progress: 0,
        validationStatus: 'unvalidated',
        createdAt: new Date().toLocaleTimeString(),
        updatedAt: new Date().toLocaleTimeString()
      };
    });

    db.tasks.unshift(...newTasks);

    // Add confirmation to chat
    db.conversations.push({
      id: `msg_sys_${Date.now()}`,
      sender: 'system',
      senderName: 'Sistem / Pak Yoga',
      text: `Rencana "${plan.title}" telah DISETUJUI oleh Pak Yoga. Diana mendistribusikan ${newTasks.length} tugas ke agen terkait.`,
      timestamp: new Date().toLocaleTimeString()
    });

    db.logs.unshift({
      id: `log_${Date.now()}_approved`,
      timestamp: new Date().toLocaleTimeString(),
      actorId: 'agent_manager',
      actorName: 'Diana',
      actorRole: 'manager',
      eventType: 'plan_approved',
      message: `Rencana "${plan.title}" disetujui Pak Yoga. ${newTasks.length} tugas aktif didistribusikan.`,
      planId: plan.id
    });

    saveDB(db);

    return res.json({
      success: true,
      plan,
      tasks: newTasks,
      message: 'Rencana disetujui dan tugas berhasil didistribusikan.'
    });
  } else {
    plan.status = 'rejected';
    plan.notes = feedback || 'Ditolak oleh Pak Yoga untuk revisi.';

    db.conversations.push({
      id: `msg_sys_${Date.now()}`,
      sender: 'system',
      senderName: 'Sistem / Pak Yoga',
      text: `Rencana "${plan.title}" DITOLAK atau diminta revisi oleh Pak Yoga. Catatan: ${feedback || 'Revisi parameter sebelum eksekusi.'}`,
      timestamp: new Date().toLocaleTimeString()
    });

    db.logs.unshift({
      id: `log_${Date.now()}_rejected`,
      timestamp: new Date().toLocaleTimeString(),
      actorId: 'agent_manager',
      actorName: 'Diana',
      actorRole: 'manager',
      eventType: 'plan_rejected',
      message: `Rencana "${plan.title}" ditolak oleh Pak Yoga. Menunggu revisi.`,
      planId: plan.id
    });

    saveDB(db);

    return res.json({
      success: true,
      plan,
      message: 'Rencana ditolak/dikembalikan untuk revisi.'
    });
  }
});

// 5. Execute an Assigned Task with Specialized AI Agent (Fast & Reliable)
app.post('/api/tasks/:id/execute', async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const db = getDB();
  const task = db.tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tugas tidak ditemukan.' });
  }

  // Update status to in_progress
  task.status = 'in_progress';
  task.progress = 50;
  task.updatedAt = new Date().toLocaleTimeString();

  db.logs.unshift({
    id: `log_${Date.now()}_start_${taskId}`,
    timestamp: new Date().toLocaleTimeString(),
    actorId: task.assignedAgentId,
    actorName: task.assignedRole,
    actorRole: task.assignedRole,
    eventType: 'task_started',
    message: `Agen ${task.assignedRole} memulai eksekusi tugas "${task.title}".`,
    taskId: task.id
  });

  // Generate output using local simulation templates
  const sim = processLocalOwnerCommand(task.objective || task.title);
  let outputText = (sim.deliverables && (sim.deliverables[task.assignedAgentId] || sim.deliverables.agent_programmer)) || '';

  if (!outputText) {
    outputText = `HASIL SIMULASI — MODE DEMO

TUGAS: ${task.title}
Dikerjakan oleh: ${task.assignedRole.toUpperCase()}

1. Spesifikasi Deliverable:
   - Status Kualitas: Memenuhi seluruh kriteria instruksi
   - Kepatuhan Standar: Sesuai pedoman Inspire WebCraft

2. Rincian Pelaksanaan:
   ${task.description}

3. Hasil Kerja:
   Deliverable telah diselesaikan dan diverifikasi oleh sistem simulasi lokal.`;
  }

  task.deliverable = outputText;
  task.progress = 100;
  task.status = 'completed';
  task.validationStatus = 'passed';
  task.updatedAt = new Date().toLocaleTimeString();

  db.logs.unshift({
    id: `log_${Date.now()}_done_${taskId}`,
    timestamp: new Date().toLocaleTimeString(),
    actorId: task.assignedAgentId,
    actorName: task.assignedRole,
    actorRole: task.assignedRole,
    eventType: 'task_completed',
    message: `Tugas "${task.title}" diselesaikan oleh ${task.assignedRole}. Status: Selesai & Lolos Validasi.`,
    taskId: task.id
  });

  // Check if all tasks in the plan are completed
  if (task.planId) {
    const planTasks = db.tasks.filter((t) => t.planId === task.planId);
    const allDone = planTasks.every((t) => t.status === 'completed');
    if (allDone) {
      const plan = db.plans.find((p) => p.id === task.planId);
      if (plan) {
        plan.status = 'completed';
        plan.completedAt = new Date().toLocaleTimeString();

        db.logs.unshift({
          id: `log_${Date.now()}_plan_all_done`,
          timestamp: new Date().toLocaleTimeString(),
          actorId: 'agent_manager',
          actorName: 'Diana',
          actorRole: 'manager',
          eventType: 'report_submitted',
          message: `Semua tugas dalam rencana "${plan.title}" telah rampung dikerjakan oleh tim agen.`,
          planId: plan.id
        });

        db.conversations.push({
          id: `msg_mgr_done_${Date.now()}`,
          sender: 'manager',
          senderName: 'Diana (Manager Agent)',
          text: `Pak Yoga, seluruh ${planTasks.length} tugas dalam rencana "${plan.title}" telah berhasil diselesaikan oleh tim. Anda dapat memeriksa hasil deliverable lengkap di Papan Tugas atau meminta evaluasi akhir dari CEO Victor.`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }
  }

  saveDB(db);

  return res.json({
    success: true,
    task,
    message: `Tugas "${task.title}" berhasil diselesaikan oleh agen.`
  });
});

// 6. CEO Evaluation of Completed Work
app.post('/api/tasks/evaluate-ceo', async (req: Request, res: Response) => {
  const { planId } = req.body;
  const db = getDB();

  let targetTasks: TaskItem[] = [];
  if (planId) {
    targetTasks = db.tasks.filter((t) => t.planId === planId);
  } else {
    targetTasks = db.tasks.filter((t) => t.status === 'completed').slice(0, 5);
  }

  if (targetTasks.length === 0) {
    return res.status(400).json({ error: 'Tidak ada tugas yang selesai untuk dievaluasi oleh CEO.' });
  }

  const sim = processLocalOwnerCommand(targetTasks[0].title);
  const report = sim.ceoReview || `HASIL EVALUASI EKSEKUTIF CEO (VICTOR):
1. Ringkasan Kualitas Deliverable: Sangat Memuaskan (Skor Mutu: 96/100).
2. Kepatuhan Standar: Seluruh deliverable sesuai instruksi Pak Yoga dan standar agensi Inspire WebCraft.
3. Rekomendasi Lanjutan: Siap dipublikasikan dan dipresentasikan kepada calon klien.`;

  db.logs.unshift({
    id: `log_${Date.now()}_ceo`,
    timestamp: new Date().toLocaleTimeString(),
    actorId: 'agent_ceo',
    actorName: 'Victor',
    actorRole: 'ceo',
    eventType: 'ceo_evaluated',
    message: 'CEO Victor menyelesaikan evaluasi eksekutif terhadap hasil deliverable tim.',
    planId
  });

  db.conversations.push({
    id: `msg_ceo_${Date.now()}`,
    sender: 'system',
    senderName: 'Victor (CEO Agent)',
    text: report,
    timestamp: new Date().toLocaleTimeString()
  });

  saveDB(db);

  return res.json({
    success: true,
    report,
    message: 'Evaluasi CEO berhasil disusun.'
  });
});

// 7. Reset DB Endpoint
app.post('/api/reset-data', (req: Request, res: Response) => {
  saveDB(initialDB);
  res.json({ success: true, message: 'Data operasional kantor berhasil direset ke kondisi awal Pak Yoga.' });
});

// ==========================================
// STATIC / VITE INTEGRATION
// ==========================================
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Inspire WebCraft AI Office] Server listening on port ${PORT} (Demo Mode - Local Simulation)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
