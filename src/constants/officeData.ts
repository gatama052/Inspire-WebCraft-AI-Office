import { Agent, Room, WaypointNode, Task } from '../types/office';

export const ROOMS: Room[] = [
  {
    id: 'owner_office',
    name: 'Kantor Owner — Pak Yoga',
    shortName: 'Ruang Owner',
    description: 'Ruang eksekutif pemilik Inspire WebCraft, Pak Yoga. Pusat visi bisnis, arahan strategis, dan persetujuan proyek utama.',
    colorAccent: '#3b82f6', // Sapphire blue
    bounds: { minX: -16, maxX: -7, minZ: -12, maxZ: -4 },
    center: { x: -11.5, y: 0, z: -8 },
    cameraTarget: { x: -11.5, y: 1.2, z: -8 },
    cameraPosition: { x: -6, y: 8, z: -2 },
    assignedAgentId: 'agent_owner',
    features: ['Meja Kayu Kenari Eksekutif', 'Monitor Ganda 4K & Laptop', 'Plakat Visi Inspire WebCraft', 'Rak Buku Strategi', 'Tanaman Hias Tropis']
  },
  {
    id: 'manager_office',
    name: 'Ruang Manager',
    shortName: 'Ruang Manager',
    description: 'Pusat koordinasi operasional. Diana menerima arahan dari Pak Yoga, menyusun rencana kerja, mendelegasikan tugas ke agen, dan melapor ke CEO.',
    colorAccent: '#0ea5e9', // Sky blue
    bounds: { minX: -16, maxX: -7, minZ: -2, maxZ: 6 },
    center: { x: -11.5, y: 0, z: 2 },
    cameraTarget: { x: -11.5, y: 1.2, z: 2 },
    cameraPosition: { x: -6, y: 8, z: 8 },
    assignedAgentId: 'agent_manager',
    features: ['Papan Alur Kerja Kanban', 'Layar Ganda Manajemen', 'Terminal Delegasi Agen', 'Arsip Dokumen Proyek', 'Kursi Diskusi']
  },
  {
    id: 'programmer_room',
    name: 'Ruang Programmer',
    shortName: 'Ruang Programmer',
    description: 'Pusat pengembangan teknis. Alex membuat arsitektur web modern, komponen kode React/Next.js, optimasi prompt AI, dan perbaikan bug.',
    colorAccent: '#10b981', // Emerald green
    bounds: { minX: -5, maxX: 5, minZ: -12, maxZ: -4 },
    center: { x: 0, y: 0, z: -8 },
    cameraTarget: { x: 0, y: 1.2, z: -8 },
    cameraPosition: { x: 0, y: 9, z: -1 },
    assignedAgentId: 'agent_programmer',
    features: ['Workstation Tiga Monitor Menyala', 'Rak Server dengan Indikator LED', 'Terminal Coding Matrix', 'Kursi Ergonomis Mesh', 'Papan Arsitektur']
  },
  {
    id: 'creative_room',
    name: 'Ruang Strategi Kreatif',
    shortName: 'Strategi Kreatif',
    description: 'Pusat ide pemasaran dan strategi brand. Maya menyusun konsep kampanye, keunggulan nilai (USP), formula headline, dan positioning pasar.',
    colorAccent: '#f59e0b', // Amber/Warm gold
    bounds: { minX: -5, maxX: 5, minZ: 4, maxZ: 12 },
    center: { x: 0, y: 0, z: 8 },
    cameraTarget: { x: 0, y: 1.2, z: 8 },
    cameraPosition: { x: 0, y: 9, z: 15 },
    assignedAgentId: 'agent_creative',
    features: ['Papan Inspirasi Moodboard', 'Palet Warna Desain', 'Rak Buku Referensi Brand', 'Dekorasi Seni Kreatif', 'Meja Brainstorming']
  },
  {
    id: 'planning_room',
    name: 'Ruang Perencanaan Konten',
    shortName: 'Perencanaan Konten',
    description: 'Pusat struktur editorial dan penjadwalan. David menyusun kalender konten mingguan/bulanan, pilar topik, target audiens, dan brief produksi.',
    colorAccent: '#8b5cf6', // Violet
    bounds: { minX: 7, maxX: 16, minZ: -12, maxZ: -4 },
    center: { x: 11.5, y: 0, z: -8 },
    cameraTarget: { x: 11.5, y: 1.2, z: -8 },
    cameraPosition: { x: 6, y: 8, z: -2 },
    assignedAgentId: 'agent_planner',
    features: ['Papan Kalender Editorial', 'Terminal Analisis Brief', 'Matriks Distribusi Saluran', 'Rak Arsip Konten', 'Tanaman Hias Minimalis']
  },
  {
    id: 'content_studio',
    name: 'Studio Produksi Konten',
    shortName: 'Produksi Konten',
    description: 'Pusat produksi materi promosi digital. Zara membuat copywriting iklan, naskah video pendek (TikTok/Reels), slide carousel, dan prompt visual.',
    colorAccent: '#ec4899', // Pink
    bounds: { minX: 7, maxX: 16, minZ: -2, maxZ: 5 },
    center: { x: 11.5, y: 0, z: 1.5 },
    cameraTarget: { x: 11.5, y: 1.2, z: 1.5 },
    cameraPosition: { x: 6, y: 8, z: 7 },
    assignedAgentId: 'agent_creator',
    features: ['Monitor Desain Kalibrasi Warna', 'Lampu Studio Softbox Key Light', 'Tablet Grafis & Stylus', 'Server Aset Media', 'Area Tinjau Konten']
  },
  {
    id: 'ceo_office',
    name: 'Ruang CEO',
    shortName: 'Ruang CEO',
    description: 'Pusat tata kelola dan evaluasi eksekutif. Victor mengaudit laporan operasional dari Diana, memeriksa mutu deliverable, dan memberikan rekomendasi strategis.',
    colorAccent: '#6366f1', // Indigo
    bounds: { minX: 7, maxX: 16, minZ: 7, maxZ: 13 },
    center: { x: 11.5, y: 0, z: 10 },
    cameraTarget: { x: 11.5, y: 1.2, z: 10 },
    cameraPosition: { x: 6, y: 8, z: 15 },
    assignedAgentId: 'agent_ceo',
    features: ['Meja Eksekutif Kaca Modern', 'Layar Analitik & Metrik Bisnis', 'Plakat Penghargaan Bisnis', 'Sofa Tamu Eksekutif', 'Jendela Panorama']
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_owner',
    name: 'Pak Yoga',
    role: 'owner',
    title: 'Owner Inspire WebCraft',
    roomId: 'owner_office',
    color: '#2563eb', // Royal Blue
    secondaryColor: '#1e293b',
    hairColor: '#1f2937',
    hairStyle: 'sidepart',
    hasGlasses: false,
    avatarSeed: 'owner_yoga',
    position: { x: -12, y: 0, z: -8 },
    rotationY: Math.PI / 2, // Menghadap ke Timur (ke meja & pintu)
    deskPosition: { x: -12, y: 0, z: -8 },
    deskRotationY: Math.PI / 2,
    activityState: 'sitting',
    activeTaskId: 'task_strategic_planning',
    currentPath: [],
    pathProgress: 0,
    bio: 'Pemilik Inspire WebCraft. Pengambil keputusan tertinggi yang memberikan arahan bisnis, menyetujui rencana kerja, dan memimpin visi perusahaan.',
    skills: ['Visi Bisnis', 'Kepemimpinan Strategis', 'Pengambilan Keputusan', 'Tata Kelola Perusahaan']
  },
  {
    id: 'agent_manager',
    name: 'Diana',
    role: 'manager',
    title: 'Manager Agent',
    roomId: 'manager_office',
    color: '#0284c7', // Sky Blue
    secondaryColor: '#0f172a',
    hairColor: '#451a03',
    hairStyle: 'ponytail',
    hasGlasses: true,
    avatarSeed: 'manager_diana',
    position: { x: -12, y: 0, z: 2 },
    rotationY: Math.PI / 2, // Menghadap ke Timur (ke meja)
    deskPosition: { x: -12, y: 0, z: 2 },
    deskRotationY: Math.PI / 2,
    activityState: 'sitting',
    activeTaskId: 'task_operations_sync',
    currentPath: [],
    pathProgress: 0,
    bio: 'Penghubung utama antara Pak Yoga dan seluruh agen AI. Menerima instruksi, menyusun rencana kerja terstruktur, mendelegasikan tugas, dan melapor ke CEO.',
    skills: ['Koordinasi Alur Kerja', 'Delegasi Tugas', 'Manajemen Tim AI', 'Penyusunan Rencana Kerja']
  },
  {
    id: 'agent_programmer',
    name: 'Alex',
    role: 'programmer',
    title: 'Programmer Agent',
    roomId: 'programmer_room',
    color: '#059669', // Emerald
    secondaryColor: '#111827',
    hairColor: '#18181b',
    hairStyle: 'short',
    hasGlasses: true,
    hasHeadset: true,
    avatarSeed: 'programmer_alex',
    position: { x: 0, y: 0, z: -8.8 },
    rotationY: -Math.PI / 2, // Menghadap ke layar monitor (Utara)
    deskPosition: { x: 0, y: 0, z: -8.8 },
    deskRotationY: -Math.PI / 2,
    activityState: 'typing',
    activeTaskId: 'task_codebase_dev',
    currentPath: [],
    pathProgress: 0,
    bio: 'Pengembang teknis senior. Menguasai arsitektur React, Next.js, Three.js 3D, Tailwind CSS, pembuatan prompt kode, dan analisis bug.',
    skills: ['Fullstack Web', 'Three.js 3D', 'Prompt Engineering', 'Debugging Kode', 'Arsitektur Sistem']
  },
  {
    id: 'agent_creative',
    name: 'Maya',
    role: 'creative_strategist',
    title: 'Creative Strategist Agent',
    roomId: 'creative_room',
    color: '#d97706', // Amber
    secondaryColor: '#374151',
    hairColor: '#78350f',
    hairStyle: 'curly',
    hasGlasses: false,
    avatarSeed: 'creative_maya',
    position: { x: 0, y: 0, z: 8.8 },
    rotationY: Math.PI / 2, // Menghadap ke Selatan
    deskPosition: { x: 0, y: 0, z: 8.8 },
    deskRotationY: Math.PI / 2,
    activityState: 'working',
    activeTaskId: 'task_creative_campaign',
    currentPath: [],
    pathProgress: 0,
    bio: 'Pakar strategi kreatif dan pemasaran. Merumuskan proposisi nilai pembeda (USP), sudut pandang kampanye promosi, dan konsep visual konversi tinggi.',
    skills: ['Strategi Pemasaran', 'Positioning Brand', 'Copywriting Konversi', 'Rancangan Visual']
  },
  {
    id: 'agent_planner',
    name: 'David',
    role: 'content_planner',
    title: 'Content Planner Agent',
    roomId: 'planning_room',
    color: '#7c3aed', // Purple
    secondaryColor: '#1e1e24',
    hairColor: '#374151',
    hairStyle: 'sleek',
    hasGlasses: true,
    avatarSeed: 'planner_david',
    position: { x: 12, y: 0, z: -8 },
    rotationY: -Math.PI / 2, // Menghadap ke Barat (meja kerja)
    deskPosition: { x: 12, y: 0, z: -8 },
    deskRotationY: -Math.PI / 2,
    activityState: 'reviewing',
    activeTaskId: 'task_editorial_plan',
    currentPath: [],
    pathProgress: 0,
    bio: 'Perencana alur kerja konten. Mengorganisir kalender editorial, riset kata kunci, pilar konten, segmentasi audiens, dan jadwal rilis multi-channel.',
    skills: ['Kalender Editorial', 'Pilar Konten', 'Riset Audiens', 'Penyusunan Brief Konten']
  },
  {
    id: 'agent_creator',
    name: 'Zara',
    role: 'content_creator',
    title: 'Content Creator Agent',
    roomId: 'content_studio',
    color: '#db2777', // Rose / Pink
    secondaryColor: '#18181b',
    hairColor: '#09090b',
    hairStyle: 'bun',
    hasGlasses: false,
    avatarSeed: 'creator_zara',
    position: { x: 12, y: 0, z: 1.5 },
    rotationY: -Math.PI / 2, // Menghadap ke Barat (meja kerja)
    deskPosition: { x: 12, y: 0, z: 1.5 },
    deskRotationY: -Math.PI / 2,
    activityState: 'working',
    activeTaskId: 'task_media_assets',
    currentPath: [],
    pathProgress: 0,
    bio: 'Pembuat materi dan salinan media sosial. Memproduksi naskah video vertikal, copywriting carousel edukatif, dan deskripsi visual promosi.',
    skills: ['Naskah Video Pendek', 'Copywriting Media Sosial', 'Struktur Carousel', 'Prompt Visual']
  },
  {
    id: 'agent_ceo',
    name: 'Victor',
    role: 'ceo',
    title: 'CEO Agent',
    roomId: 'ceo_office',
    color: '#4f46e5', // Indigo
    secondaryColor: '#0f172a',
    hairColor: '#475569',
    hairStyle: 'short',
    hasGlasses: false,
    avatarSeed: 'ceo_victor',
    position: { x: 12, y: 0, z: 10 },
    rotationY: -Math.PI / 2, // Menghadap ke Barat
    deskPosition: { x: 12, y: 0, z: 10 },
    deskRotationY: -Math.PI / 2,
    activityState: 'sitting',
    activeTaskId: 'task_ceo_quarterly_review',
    currentPath: [],
    pathProgress: 0,
    bio: 'Pengawas eksekutif operasional AI. Mengaudit mutu deliverable seluruh agen, menilai kepatuhan terhadap kriteria Pak Yoga, dan membuat laporan evaluasi.',
    skills: ['Evaluasi Eksekutif', 'Audit Kualitas Mutu', 'Analisis Kelayakan Bisnis', 'Tata Kelola AI']
  }
];

export const WAYPOINTS: Record<string, WaypointNode> = {
  // --- KANTOR OWNER (PAK YOGA) ---
  'wp_owner_seat': {
    id: 'wp_owner_seat',
    position: { x: -12, y: 0, z: -8 },
    roomId: 'owner_office',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_owner_approach']
  },
  'wp_owner_approach': {
    id: 'wp_owner_approach',
    position: { x: -10, y: 0, z: -8 },
    roomId: 'owner_office',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_owner_seat', 'wp_owner_doorway', 'wp_owner_interact']
  },
  'wp_owner_interact': {
    id: 'wp_owner_interact',
    // Tempat Diana berdiri tepat di depan meja Pak Yoga menghadap ke Pak Yoga (x = -9.2, z = -8)
    position: { x: -9.2, y: 0, z: -8 },
    roomId: 'owner_office',
    type: 'interaction_point',
    connectedNodeIds: ['wp_owner_approach', 'wp_owner_doorway']
  },
  'wp_owner_doorway': {
    id: 'wp_owner_doorway',
    position: { x: -7, y: 0, z: -6 },
    roomId: 'owner_office',
    type: 'doorway',
    connectedNodeIds: ['wp_owner_approach', 'wp_corridor_nw']
  },

  // --- RUANG MANAGER (DIANA) ---
  'wp_manager_seat': {
    id: 'wp_manager_seat',
    position: { x: -12, y: 0, z: 2 },
    roomId: 'manager_office',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_manager_approach']
  },
  'wp_manager_approach': {
    id: 'wp_manager_approach',
    position: { x: -10, y: 0, z: 2 },
    roomId: 'manager_office',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_manager_seat', 'wp_manager_doorway', 'wp_manager_interact']
  },
  'wp_manager_interact': {
    id: 'wp_manager_interact',
    position: { x: -9.2, y: 0, z: 2 },
    roomId: 'manager_office',
    type: 'interaction_point',
    connectedNodeIds: ['wp_manager_approach', 'wp_manager_doorway']
  },
  'wp_manager_doorway': {
    id: 'wp_manager_doorway',
    position: { x: -7, y: 0, z: 2 },
    roomId: 'manager_office',
    type: 'doorway',
    connectedNodeIds: ['wp_manager_approach', 'wp_corridor_w']
  },

  // --- RUANG PROGRAMMER (ALEX) ---
  'wp_programmer_seat': {
    id: 'wp_programmer_seat',
    position: { x: 0, y: 0, z: -8.8 },
    roomId: 'programmer_room',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_programmer_approach']
  },
  'wp_programmer_approach': {
    id: 'wp_programmer_approach',
    position: { x: 0, y: 0, z: -7.2 },
    roomId: 'programmer_room',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_programmer_seat', 'wp_programmer_interact', 'wp_programmer_doorway']
  },
  'wp_programmer_interact': {
    id: 'wp_programmer_interact',
    // Titik interaksi di depan meja Alex (Diana berdiri menghadap Utara, Alex berputar menghadap Selatan)
    position: { x: 0, y: 0, z: -6.5 },
    roomId: 'programmer_room',
    type: 'interaction_point',
    connectedNodeIds: ['wp_programmer_approach', 'wp_programmer_doorway']
  },
  'wp_programmer_doorway': {
    id: 'wp_programmer_doorway',
    position: { x: 0, y: 0, z: -4.0 },
    roomId: 'programmer_room',
    type: 'doorway',
    connectedNodeIds: ['wp_programmer_interact', 'wp_programmer_approach', 'wp_corridor_n']
  },

  // --- RUANG STRATEGI KREATIF (MAYA) ---
  'wp_creative_seat': {
    id: 'wp_creative_seat',
    position: { x: 0, y: 0, z: 8.8 },
    roomId: 'creative_room',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_creative_approach']
  },
  'wp_creative_approach': {
    id: 'wp_creative_approach',
    position: { x: 0, y: 0, z: 7.2 },
    roomId: 'creative_room',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_creative_seat', 'wp_creative_interact', 'wp_creative_doorway']
  },
  'wp_creative_interact': {
    id: 'wp_creative_interact',
    // Titik interaksi di depan meja Maya
    position: { x: 0, y: 0, z: 6.5 },
    roomId: 'creative_room',
    type: 'interaction_point',
    connectedNodeIds: ['wp_creative_approach', 'wp_creative_doorway']
  },
  'wp_creative_doorway': {
    id: 'wp_creative_doorway',
    position: { x: 0, y: 0, z: 4.0 },
    roomId: 'creative_room',
    type: 'doorway',
    connectedNodeIds: ['wp_creative_interact', 'wp_creative_approach', 'wp_corridor_s']
  },

  // --- RUANG PERENCANAAN KONTEN (DAVID) ---
  'wp_planner_seat': {
    id: 'wp_planner_seat',
    position: { x: 12, y: 0, z: -8 },
    roomId: 'planning_room',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_planner_approach']
  },
  'wp_planner_approach': {
    id: 'wp_planner_approach',
    position: { x: 10, y: 0, z: -8 },
    roomId: 'planning_room',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_planner_seat', 'wp_planner_interact', 'wp_planner_doorway']
  },
  'wp_planner_interact': {
    id: 'wp_planner_interact',
    position: { x: 9.2, y: 0, z: -8 },
    roomId: 'planning_room',
    type: 'interaction_point',
    connectedNodeIds: ['wp_planner_approach', 'wp_planner_doorway']
  },
  'wp_planner_doorway': {
    id: 'wp_planner_doorway',
    position: { x: 7, y: 0, z: -6 },
    roomId: 'planning_room',
    type: 'doorway',
    connectedNodeIds: ['wp_planner_approach', 'wp_corridor_ne']
  },

  // --- STUDIO PRODUKSI KONTEN (ZARA) ---
  'wp_creator_seat': {
    id: 'wp_creator_seat',
    position: { x: 12, y: 0, z: 1.5 },
    roomId: 'content_studio',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_creator_approach']
  },
  'wp_creator_approach': {
    id: 'wp_creator_approach',
    position: { x: 10, y: 0, z: 1.5 },
    roomId: 'content_studio',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_creator_seat', 'wp_creator_interact', 'wp_creator_doorway']
  },
  'wp_creator_interact': {
    id: 'wp_creator_interact',
    position: { x: 9.2, y: 0, z: 1.5 },
    roomId: 'content_studio',
    type: 'interaction_point',
    connectedNodeIds: ['wp_creator_approach', 'wp_creator_doorway']
  },
  'wp_creator_doorway': {
    id: 'wp_creator_doorway',
    position: { x: 7, y: 0, z: 1.5 },
    roomId: 'content_studio',
    type: 'doorway',
    connectedNodeIds: ['wp_creator_approach', 'wp_corridor_e']
  },

  // --- RUANG CEO (VICTOR) ---
  'wp_ceo_seat': {
    id: 'wp_ceo_seat',
    position: { x: 12, y: 0, z: 10 },
    roomId: 'ceo_office',
    type: 'workstation_seat',
    connectedNodeIds: ['wp_ceo_approach']
  },
  'wp_ceo_approach': {
    id: 'wp_ceo_approach',
    position: { x: 10, y: 0, z: 10 },
    roomId: 'ceo_office',
    type: 'workstation_approach',
    connectedNodeIds: ['wp_ceo_seat', 'wp_ceo_interact', 'wp_ceo_doorway']
  },
  'wp_ceo_interact': {
    id: 'wp_ceo_interact',
    position: { x: 9.2, y: 0, z: 10 },
    roomId: 'ceo_office',
    type: 'interaction_point',
    connectedNodeIds: ['wp_ceo_approach', 'wp_ceo_doorway']
  },
  'wp_ceo_doorway': {
    id: 'wp_ceo_doorway',
    position: { x: 7, y: 0, z: 10 },
    roomId: 'ceo_office',
    type: 'doorway',
    connectedNodeIds: ['wp_ceo_approach', 'wp_corridor_se']
  },

  // --- KORIDOR PENGHUBUNG ---
  'wp_corridor_nw': {
    id: 'wp_corridor_nw',
    position: { x: -5, y: 0, z: -6 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_owner_doorway', 'wp_corridor_n', 'wp_corridor_w']
  },
  'wp_corridor_n': {
    id: 'wp_corridor_n',
    position: { x: 0, y: 0, z: -2.5 },
    roomId: 'corridor',
    type: 'hallway',
    connectedNodeIds: ['wp_programmer_doorway', 'wp_corridor_nw', 'wp_corridor_ne', 'wp_corridor_center']
  },
  'wp_corridor_ne': {
    id: 'wp_corridor_ne',
    position: { x: 5, y: 0, z: -6 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_planner_doorway', 'wp_corridor_n', 'wp_corridor_e']
  },
  'wp_corridor_w': {
    id: 'wp_corridor_w',
    position: { x: -5, y: 0, z: 2 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_manager_doorway', 'wp_corridor_nw', 'wp_corridor_center', 'wp_corridor_sw']
  },
  'wp_corridor_center': {
    id: 'wp_corridor_center',
    position: { x: 0, y: 0, z: 0 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_corridor_n', 'wp_corridor_s', 'wp_corridor_w', 'wp_corridor_e']
  },
  'wp_corridor_e': {
    id: 'wp_corridor_e',
    position: { x: 5, y: 0, z: 1.5 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_creator_doorway', 'wp_corridor_ne', 'wp_corridor_center', 'wp_corridor_se']
  },
  'wp_corridor_sw': {
    id: 'wp_corridor_sw',
    position: { x: -5, y: 0, z: 6 },
    roomId: 'corridor',
    type: 'hallway',
    connectedNodeIds: ['wp_corridor_w', 'wp_corridor_s']
  },
  'wp_corridor_s': {
    id: 'wp_corridor_s',
    position: { x: 0, y: 0, z: 2.5 },
    roomId: 'corridor',
    type: 'hallway',
    connectedNodeIds: ['wp_creative_doorway', 'wp_corridor_center', 'wp_corridor_sw', 'wp_corridor_se']
  },
  'wp_corridor_se': {
    id: 'wp_corridor_se',
    position: { x: 5, y: 0, z: 10 },
    roomId: 'corridor',
    type: 'corridor_junction',
    connectedNodeIds: ['wp_ceo_doorway', 'wp_corridor_e', 'wp_corridor_s']
  }
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_codebase_dev',
    title: 'Arsitektur Platform Kantor AI 3D Inspire WebCraft',
    description: 'Membangun simulasi visual 3D kantor miniatur, navigasi waypoint A*, dan orkestrasi tugas antaragen AI.',
    objective: 'Menyediakan workspace 3D interaktif yang lancar dengan agen otonom.',
    successCriteria: 'Rendering stabil, tidak ada karakter menembus dinding, dan responsivitas penuh.',
    category: 'Website Development',
    assignedAgentId: 'agent_programmer',
    assignedRole: 'programmer',
    status: 'completed',
    priority: 'high',
    progress: 100,
    deliverable: 'HASIL SIMULASI — MODE DEMO\n\nStruktur Proyek:\n- React Three Fiber + Tailwind CSS\n- Graph Navigasi Waypoint 3D (A* Algorithm)\n- State Machine Kinematika Karakter & Dialog\n- Sistem Orkestrasi Tugas Lokal Bebas Kegagalan API',
    validationStatus: 'passed',
    createdAt: '08:30:00',
    updatedAt: '10:15:00'
  },
  {
    id: 'task_creative_campaign',
    title: 'Strategi Positioning & Narasi Brand Inspire WebCraft',
    description: 'Menyusun proposisi nilai layanan pembuatan website berbasis AI untuk UMKM dan startup modern.',
    objective: 'Membangun pembeda visual dan daya tarik konversi tinggi bagi calon klien.',
    successCriteria: 'Pilar pesan brand, formula USP, dan copywriting headline.',
    category: 'Marketing Strategy',
    assignedAgentId: 'agent_creative',
    assignedRole: 'creative_strategist',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    deliverable: 'HASIL SIMULASI — MODE DEMO\n\nUSP Utama: "Bikin Website Bisnis 5x Lebih Cepat dengan Tim Agen AI Terintegrasi"\nTarget Audiens: Pelaku UMKM, Agensi Digital, Founder Startup\nSudut Pandang Iklan: Solusi hemat biaya tanpa mengorbankan kualitas desain modern.',
    validationStatus: 'passed',
    createdAt: '08:45:00',
    updatedAt: '09:50:00'
  },
  {
    id: 'task_editorial_plan',
    title: 'Perencanaan Kalender Konten Edukasi Website',
    description: 'Menyusun 14 jadwal rilis konten edukasi pentingnya website profesional untuk konversi penjualan.',
    objective: 'Meningkatkan kesadaran calon klien melalui konten edukatif dan studi kasus.',
    successCriteria: 'Jadwal 14 hari dengan tema, format, dan call-to-action jelas.',
    category: 'Content Planning',
    assignedAgentId: 'agent_planner',
    assignedRole: 'content_planner',
    status: 'review',
    priority: 'medium',
    progress: 90,
    deliverable: 'HASIL SIMULASI — MODE DEMO\n\nJadwal Konten:\n- Hari 1: Kenapa Bisnis Tanpa Website Kehilangan 60% Pembeli\n- Hari 3: Anatomi Landing Page Berkonversi Tinggi\n- Hari 5: Studi Kasus Transformasi Toko Tradisional ke Digital\n- Hari 7: Checklist Sebelum Meluncurkan Website Baru',
    validationStatus: 'passed',
    createdAt: '07:15:00',
    updatedAt: '10:00:00'
  },
  {
    id: 'task_media_assets',
    title: 'Produksi Naskah Video & Konten Carousel',
    description: 'Membuat naskah video 60 detik dan slide carousel Instagram untuk promosi peluncuran layanan.',
    objective: 'Materi promosi siap rilis dengan engagement tinggi.',
    successCriteria: 'Naskah video lengkap dengan stage direction dan teks carousel.',
    category: 'Content Production',
    assignedAgentId: 'agent_creator',
    assignedRole: 'content_creator',
    status: 'in_progress',
    priority: 'medium',
    progress: 55,
    deliverable: 'HASIL SIMULASI — MODE DEMO\n\nHook Video: "Jangan buang uang jutaan sebelum tahu 3 kesalahan fatal bikin website ini..."\nSlide Carousel 1-5: Struktur visual dan ajakan konsultasi gratis via WhatsApp.',
    validationStatus: 'passed',
    createdAt: '09:00:00',
    updatedAt: '10:10:00'
  },
  {
    id: 'task_ceo_quarterly_review',
    title: 'Audit Evaluasi Kinerja Operasional Agensi',
    description: 'Memeriksa kecepatan eksekusi tugas, kualitas deliverable antardivisi, dan kepuasan klien.',
    objective: 'Memastikan seluruh pengerjaan selaras dengan standar mutu Pak Yoga.',
    successCriteria: 'Skor mutu komprehensif dan catatan perbaikan berkelanjutan.',
    category: 'Executive Review',
    assignedAgentId: 'agent_ceo',
    assignedRole: 'ceo',
    status: 'pending',
    priority: 'urgent',
    progress: 20,
    deliverable: 'HASIL SIMULASI — MODE DEMO\n\nStatus Evaluasi: Menunggu seluruh tugas aktif diselesaikan untuk audit final.',
    validationStatus: 'unvalidated',
    createdAt: '06:30:00',
    updatedAt: '09:30:00'
  }
];
