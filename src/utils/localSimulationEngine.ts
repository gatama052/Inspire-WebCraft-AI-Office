import { WorkPlan } from '../types/office';

export interface AgentConversationTurn {
  speakerId: string;
  speakerName: string;
  text: string;
  durationMs?: number;
}

export interface LocalSimulationResult {
  intent: string;
  isActionable: boolean;
  managerReply: string;
  proposedPlan?: WorkPlan;
  dialogueWithYoga: string;
  assignedAgentIds: string[];
  primaryTargetAgentId?: string;
  primaryInteractWaypointId?: string;
  agentDialogues?: Record<string, { diana: string; agent: string }>;
  delegationConversations: Record<string, AgentConversationTurn[]>;
  reportConversations: Record<string, AgentConversationTurn[]>;
  ceoConversation: AgentConversationTurn[];
  ownerReportConversation: AgentConversationTurn[];
  deliverables: Record<string, string>;
  ceoReview: string;
}

export function processLocalOwnerCommand(instruction: string): LocalSimulationResult {
  const text = instruction.toLowerCase().trim();

  // 1. Detect Smalltalk / Greeting / Non-actionable queries
  const isGreeting =
    /^(halo|hai|hi|hey|selamat pagi|selamat siang|selamat sore|selamat malam|assalamu|pagi|siang|sore|malam|apa kabar|tes|test|ping)$/i.test(
      text
    ) ||
    text === 'halo diana' ||
    text === 'hai diana' ||
    text.startsWith('siapa ') ||
    text.includes('siapa tim');

  if (isGreeting) {
    return {
      intent: 'greeting',
      isActionable: false,
      managerReply:
        'Halo Pak Yoga! Saya Diana, Operations Manager Inspire WebCraft. Seluruh workstation tim agen AI (Alex, Maya, David, Zara, Victor) telah aktif dan siap menerima instruksi bisnis Anda. Silakan sampaikan arahan seperti pembuatan konten media sosial, landing page jasa sopir, atau strategi pemasaran.',
      dialogueWithYoga:
        'Halo Pak Yoga! Saya siap menerima arahan pekerjaan dari Bapak.',
      assignedAgentIds: [],
      delegationConversations: {},
      reportConversations: {},
      ceoConversation: [],
      ownerReportConversation: [],
      deliverables: {},
      ceoReview: ''
    };
  }

  // 2. Detect Work Orders & Intents
  let intent = 'social_media_content'; // default to social media campaign if matched or general
  if (
    text.includes('kalender') ||
    text.includes('jadwal') ||
    text.includes('7 hari') ||
    text.includes('seminggu') ||
    text.includes('mingguan')
  ) {
    intent = 'content_calendar';
  } else if (
    text.includes('landing page') ||
    text.includes('website') ||
    text.includes('sopir') ||
    text.includes('driver') ||
    text.includes('web') ||
    text.includes('halaman') ||
    text.includes('bikin web')
  ) {
    intent = 'landing_page';
  } else if (
    text.includes('pemasaran') ||
    text.includes('marketing') ||
    text.includes('kampanye') ||
    text.includes('promosi') ||
    text.includes('branding') ||
    text.includes('positioning')
  ) {
    intent = 'marketing_campaign';
  } else if (
    text.includes('prompt') ||
    text.includes('coding') ||
    text.includes('kode') ||
    text.includes('bug') ||
    text.includes('program') ||
    text.includes('arsitektur')
  ) {
    intent = 'coding_prompt';
  }

  const timestamp = new Date().toLocaleTimeString();

  switch (intent) {
    case 'landing_page': {
      const isDriverService = text.includes('sopir') || text.includes('driver');
      const serviceName = isDriverService ? 'Jasa Sopir & Pengemudi Pribadi' : 'Layanan Pembuatan Website & Aplikasi AI';

      const plan: WorkPlan = {
        id: `plan_${Date.now()}`,
        title: `Pembangunan Landing Page: ${serviceName}`,
        goal: `Merancang arsitektur web modern untuk ${serviceName} dengan struktur konversi tinggi dan tombol WhatsApp floating terintegrasi.`,
        ownerInstruction: instruction,
        status: 'proposed',
        createdAt: timestamp,
        steps: [
          {
            stepNumber: 1,
            title: 'Arsitektur Kode & Tombol WhatsApp Floating',
            description: 'Alex menyusun tata letak section (Hero, Layanan, Tarif, Testimoni, CTA WhatsApp floating).',
            assignedRole: 'programmer',
            deliverableType: 'Struktur Kode & Komponen React/Tailwind',
            criteria: 'Hierarki bagian halaman rapi, siap pakai dengan Tailwind CSS.'
          },
          {
            stepNumber: 2,
            title: 'Strategi Visual & Proposisi Nilai (USP)',
            description: 'Maya merumuskan penawaran utama, poin kepercayaan konsumen, dan struktur persuasif.',
            assignedRole: 'creative_strategist',
            deliverableType: 'Dokumen Strategi Brand',
            criteria: 'USP jelas, target persona, dan formula headline pemikat.'
          },
          {
            stepNumber: 3,
            title: 'Penulisan Salinan Teks (Copywriting)',
            description: 'Zara menulis teks headline, subheadline, daftar paket, dan template pesan otomatis WhatsApp.',
            assignedRole: 'content_creator',
            deliverableType: 'Naskah Copywriting Lengkap',
            criteria: 'Gaya bahasa persuasif dan call-to-action langsung ke WhatsApp.'
          }
        ]
      };

      return {
        intent,
        isActionable: true,
        managerReply: `Baik, Pak Yoga. Saya akan membagi pekerjaan pembuatan landing page ${serviceName}. Saya mengusulkan Alex (Programmer) menyusun arsitektur dan tombol WhatsApp, Maya (Strategi Kreatif) menentukan USP, dan Zara (Pembuat Konten) menulis teks konversi. Apakah rencana ini boleh saya jalankan?`,
        dialogueWithYoga: `Selamat sore, Pak Yoga. Saya siap menerima arahan Anda mengenai landing page ${serviceName}.`,
        proposedPlan: plan,
        assignedAgentIds: ['agent_programmer', 'agent_creative', 'agent_creator'],
        delegationConversations: {
          agent_programmer: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: `Alex, Pak Yoga meminta kita membangun landing page ${serviceName}. Pastikan komponen section hero dan tombol pemesanan WhatsApp floating masuk dalam arsitektur utama.`,
              durationMs: 4000
            },
            {
              speakerId: 'agent_programmer',
              speakerName: 'Alex',
              text: 'Siap, Diana! Saya akan siapkan arsitektur halaman responsif dengan React & Tailwind, lengkap dengan widget WhatsApp sticky.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Pastikan performanya optimal dan responsif di perangkat seluler.',
              durationMs: 3200
            },
            {
              speakerId: 'agent_programmer',
              speakerName: 'Alex',
              text: 'Baik, Diana. Saya selesaikan kodenya dan segera melapor ke Ruang Manager.',
              durationMs: 3400
            }
          ],
          agent_creative: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: `Maya, tolong susun strategi proposisi nilai (USP) dan pilar kepercayaan untuk landing page ${serviceName}.`,
              durationMs: 3800
            },
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Baik, Diana! Saya siapkan 3 pilar kepercayaan konsumen: pengemudi terverifikasi, tarif jujur tanpa biaya tersembunyi, dan kenyamanan perjalanan.',
              durationMs: 4000
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Sempurna. Laporkan hasilnya ke Ruang Manager setelah selesai.',
              durationMs: 3000
            },
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Siap, segera saya tuntaskan.',
              durationMs: 2500
            }
          ],
          agent_creator: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Zara, tulis naskah copywriting hero, rincian paket layanan, dan template pesan chat WhatsApp otomatis.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Siap, Diana! Saya buatkan naskah persuasif yang memicu klik ke WhatsApp.',
              durationMs: 3400
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Pastikan pesan otomatis WhatsApp ringkas dan langsung ke inti pemesanan.',
              durationMs: 3200
            },
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Beres, Diana. Saya selesaikan dan langsung melapor ke ruangan Anda.',
              durationMs: 3200
            }
          ]
        },
        reportConversations: {
          agent_programmer: [
            {
              speakerId: 'agent_programmer',
              speakerName: 'Alex',
              text: 'Diana, struktur arsitektur kode landing page dan widget WhatsApp floating sudah selesai dikompilasi.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Bagus, Alex! Struktur section rapi dan siap dipadukan dengan naskah dari Zara.',
              durationMs: 3200
            }
          ],
          agent_creative: [
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Diana, dokumen strategi USP dan formula pemicu kepercayaan konsumen sudah rampung.',
              durationMs: 3600
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Terima kasih, Maya. Proposisi nilainya sangat tajam dan menjawab keraguan calon klien.',
              durationMs: 3400
            }
          ],
          agent_creator: [
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Diana, naskah copywriting hero dan format chat otomatis WhatsApp telah siap ditinjau.',
              durationMs: 3600
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Luar biasa, Zara. Seluruh deliverable tim telah lengkap. Saya akan susun laporan untuk Pak Victor.',
              durationMs: 3500
            }
          ]
        },
        ceoConversation: [
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: `Pak Victor, saya membawa laporan penyelesaian landing page ${serviceName} dari tim teknis dan kreatif.`,
            durationMs: 3800
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Silakan jelaskan hasil dan status pekerjaannya.',
            durationMs: 3000
          },
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Alex telah menyelesaikan arsitektur kode dan CTA WhatsApp, Maya merumuskan USP, dan Zara menuntaskan naskah konversi.',
            durationMs: 4000
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Baik. Saya akan meninjau kelengkapan laporan dan mencatat hasil evaluasi operasional.',
            durationMs: 3500
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Audit eksekutif selesai: Kualitas deliverable sangat memuaskan (Skor: 96/100). Struktur halaman langsung menjawab kebutuhan calon klien.',
            durationMs: 4200
          }
        ],
        ownerReportConversation: [
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: `Pak Yoga, pekerjaan pembangunan landing page ${serviceName} telah selesai. Tim teknis dan kreatif telah menyelesaikan arsitektur, strategi USP, dan naskah WhatsApp.`,
            durationMs: 4200
          },
          {
            speakerId: 'agent_owner',
            speakerName: 'Pak Yoga',
            text: 'Bagus. Tampilkan hasil pekerjaannya.',
            durationMs: 2800
          },
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Baik, Pak Yoga. Hasil masing-masing agen sudah tersimpan. Anda dapat melihat dan meninjau seluruh hasil melalui Papan Tugas.',
            durationMs: 3800
          }
        ],
        deliverables: {
          agent_programmer: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

STRUKTUR TEKNIS LANDING PAGE (${serviceName.toUpperCase()}):
1. Section Header & Navigasi:
   - Logo & Nama Layanan
   - Menu Cepat: Beranda, Keunggulan, Armada, Tarif, Kontak
   - Tombol Cepat: "Pesan via WhatsApp" (Hijau #25D366)
2. Section Hero (Penawaran Utama):
   - Headline Utama dengan penekanan kenyamanan & keamanan
   - Badge: "Tersedia 24/7 | Pengemudi Terverifikasi"
   - CTA Primer: "Hubungi Sopir Sekarang via WhatsApp"
3. Section Keunggulan:
   - Pengemudi Profesional & Berlisensi
   - Tepat Waktu & Rute Efisien
   - Tarif Jujur Tanpa Biaya Tersembunyi
4. Section Pilihan Paket:
   - Paket Harian Dalam Kota (Rp 250.000 / 10 Jam)
   - Paket Antar-Kota / Drop Off Luar Kota
   - Paket Pengemudi Bulanan / Korporat
5. Section Testimoni & FAQ Keamanan
6. Floating Widget: Tombol WhatsApp sticky di sudut kanan bawah dengan animasi pulsasi lembut.`,

          agent_creative: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

STRATEGI PERSUASIF & USP:
- Proposisi Nilai: "Perjalanan Nyaman Tanpa Lelah, Pengemudi Terpercaya Siap Mengantar Anda Kapan Saja."
- Target Persona: Eksekutif sibuk, wisatawan keluarga, dan pemilik mobil yang butuh sopir andal saat dinas.
- Elemen Pemicu Kepercayaan: Menampilkan foto sopir berpenampilan rapi, ulasan bintang 5, dan garansi pergantian pengemudi bila tidak puas.`,

          agent_creator: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

COPYWRITING LENGKAP:
- Headline Hero: "Butuh Sopir Pribadi yang Andal & Berpengalaman Hari Ini?"
- Subheadline: "Duduk tenang dan nikmati perjalanan Anda. Pengemudi terverifikasi siap melayani rute dalam dan luar kota dengan tarif transparan."
- Teks Tombol CTA: "Pesan Sopir Sekarang — Chat WhatsApp Langsung"
- Pesan Template WhatsApp Otomatis:
  "Halo, saya ingin memesan layanan sopir untuk tanggal [....], penjemputan di [....] dengan tujuan [....]. Mohon info ketersediaannya. Terima kasih!"`
        },
        ceoReview: `HASIL EVALUASI EKSEKUTIF CEO (VICTOR):
1. Kelayakan Proyek: Sempurna (Skor: 96/100). Struktur halaman langsung menjawab kebutuhan calon klien dengan alur pesan singkat ke WhatsApp.
2. Rekomendasi: Pastikan nomor WhatsApp bisnis aktif dan respons cepat di bawah 3 menit.`
      };
    }

    // Default & Social Media Campaign
    case 'content_calendar':
    case 'marketing_campaign':
    case 'social_media_content':
    default: {
      const plan: WorkPlan = {
        id: `plan_${Date.now()}`,
        title: 'Pembuatan Konten Media Sosial Inspire WebCraft',
        goal: 'Membuat rangkaian materi konten promosi media sosial untuk mempublikasikan keunggulan jasa website dan ekosistem kantor AI Inspire WebCraft.',
        ownerInstruction: instruction,
        status: 'proposed',
        createdAt: timestamp,
        steps: [
          {
            stepNumber: 1,
            title: 'Konsep Kampanye & Sudut Pandang Promosi',
            description: 'Maya menyusun konsep dan sudut pandang kampanye promosi yang sesuai dengan layanan website kita.',
            assignedRole: 'creative_strategist',
            deliverableType: 'Dokumen Konsep Kampanye',
            criteria: 'Sudut pandang konten menarik bagi pemilik usaha lokal dan UMKM.'
          },
          {
            stepNumber: 2,
            title: 'Penyusunan Kalender Konten & Urutan Publikasi',
            description: 'David menyusun jadwal, tema harian, format konten, dan tujuan setiap rilis.',
            assignedRole: 'content_planner',
            deliverableType: 'Kalender Editorial Terstruktur',
            criteria: 'Jadwal terstruktur 7 hari dengan tema dan CTA jelas.'
          },
          {
            stepNumber: 3,
            title: 'Penulisan Caption, Hook & Naskah Konten',
            description: 'Zara menulis caption, hook pembuka yang menarik, dan naskah video pendek sesuai identitas Inspire WebCraft.',
            assignedRole: 'content_creator',
            deliverableType: 'Naskah Video & Copywriting Siap Posting',
            criteria: 'Naskah lengkap dengan arahan visual dan ajakan bertindak (CTA).'
          }
        ]
      };

      return {
        intent: 'social_media_content',
        isActionable: true,
        managerReply:
          'Baik, Pak Yoga. Saya akan membagi pekerjaan berdasarkan kebutuhan. Saya usulkan tim Strategi Kreatif menentukan konsep, Perencana Konten menyusun jadwal, dan Pembuat Konten menyiapkan caption. Apakah rencana ini boleh saya jalankan?',
        dialogueWithYoga:
          'Selamat sore, Pak Yoga. Saya siap menerima arahan Anda.',
        proposedPlan: plan,
        assignedAgentIds: ['agent_creative', 'agent_planner', 'agent_creator'],
        delegationConversations: {
          agent_creative: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Maya, Pak Yoga meminta kita menyiapkan konten untuk mempromosikan Inspire WebCraft. Tolong susun konsep kampanye yang sesuai dengan layanan website kita.',
              durationMs: 4200
            },
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Baik, Diana. Saya akan menyiapkan konsep yang menonjolkan manfaat website bagi UMKM dan bisnis lokal.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Pastikan konsepnya mudah dipahami dan memiliki ajakan yang jelas kepada calon pelanggan.',
              durationMs: 3400
            },
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Baik. Saya akan menyelesaikan konsepnya dan melaporkan hasilnya kepada Anda.',
              durationMs: 3200
            }
          ],
          agent_planner: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'David, susun kalender konten berdasarkan konsep kampanye yang telah disiapkan Maya.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_planner',
              speakerName: 'David',
              text: 'Baik. Saya akan menyusun jadwal, tema, format, dan tujuan setiap konten.',
              durationMs: 3500
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Pastikan jadwalnya terstruktur dan mudah dijalankan.',
              durationMs: 3000
            },
            {
              speakerId: 'agent_planner',
              speakerName: 'David',
              text: 'Siap. Saya akan menyelesaikan rencana konten tersebut.',
              durationMs: 2800
            }
          ],
          agent_creator: [
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Zara, siapkan caption dan naskah berdasarkan konsep Maya serta rencana konten David.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Baik. Saya akan membuat materi yang menarik, natural, dan sesuai dengan identitas Inspire WebCraft.',
              durationMs: 3800
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Pastikan setiap materi memiliki pembuka yang menarik dan ajakan bertindak yang jelas.',
              durationMs: 3400
            },
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Siap. Saya akan menyiapkan hasilnya untuk ditinjau.',
              durationMs: 2800
            }
          ]
        },
        reportConversations: {
          agent_creative: [
            {
              speakerId: 'agent_creative',
              speakerName: 'Maya',
              text: 'Diana, konsep kampanye sudah selesai. Saya mengusulkan konten yang menjelaskan manfaat website untuk UMKM, menampilkan contoh layanan, dan mengajak calon pelanggan berkonsultasi.',
              durationMs: 4400
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Baik, Maya. Saya akan meninjau hasilnya dan menggabungkannya dengan rencana konten dari David.',
              durationMs: 3600
            }
          ],
          agent_planner: [
            {
              speakerId: 'agent_planner',
              speakerName: 'David',
              text: 'Diana, kalender konten sudah rampung. Jadwal disusun berurutan dengan tema edukasi, portofolio, dan call-to-action langsung ke WhatsApp.',
              durationMs: 4200
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Bagus, David. Matriks jadwalnya sangat rapi. Saya gabungkan ke laporan tim.',
              durationMs: 3400
            }
          ],
          agent_creator: [
            {
              speakerId: 'agent_creator',
              speakerName: 'Zara',
              text: 'Diana, seluruh naskah video pendek 45 detik dan copywriting caption siap posting telah saya buat lengkap dengan hashtag.',
              durationMs: 4200
            },
            {
              speakerId: 'agent_manager',
              speakerName: 'Diana',
              text: 'Terima kasih Zara, materi copywriting-nya sangat memikat dan siap diaudit.',
              durationMs: 3200
            }
          ]
        },
        ceoConversation: [
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Pak Victor, saya membawa laporan penyelesaian tugas konten untuk Inspire WebCraft.',
            durationMs: 3800
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Silakan jelaskan hasil dan status pekerjaannya.',
            durationMs: 3000
          },
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Tim Strategi Kreatif telah menyusun konsep kampanye, Perencana Konten telah membuat kalender konten, dan Pembuat Konten telah menyiapkan materi sesuai arahan Pak Yoga.',
            durationMs: 4400
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Baik. Saya akan meninjau kelengkapan laporan dan mencatat hasil evaluasi operasional.',
            durationMs: 3500
          },
          {
            speakerId: 'agent_ceo',
            speakerName: 'Victor',
            text: 'Audit eksekutif selesai: Kualitas pengerjaan sangat baik (Skor: 96/100). Narasi kampanye tajam dan siap diluncurkan.',
            durationMs: 4000
          }
        ],
        ownerReportConversation: [
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Pak Yoga, pekerjaan yang Anda berikan telah selesai. Tim sudah menyusun konsep kampanye, kalender konten, dan materi caption untuk Inspire WebCraft.',
            durationMs: 4400
          },
          {
            speakerId: 'agent_owner',
            speakerName: 'Pak Yoga',
            text: 'Bagus. Tampilkan hasil pekerjaannya.',
            durationMs: 2600
          },
          {
            speakerId: 'agent_manager',
            speakerName: 'Diana',
            text: 'Baik, Pak Yoga. Hasil masing-masing agen sudah tersimpan. Anda dapat melihat dan meninjau seluruh hasil melalui Papan Tugas.',
            durationMs: 3800
          }
        ],
        deliverables: {
          agent_creative: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

KONSEP KAMPANYE: "BISNIS MAJU DENGAN WEBSITE MODERN"
- Pesan Utama: Bisnis Anda pantas memiliki website berkelas yang bekerja menghasilkan omset siang dan malam.
- Sudut Pandang (Angle): Edukasi pentingnya website resmi bagi UMKM & bisnis lokal agar dipercaya calon pelanggan.
- Nilai Tambah: Kecepatan pembuatan kilat, mobile-friendly, dan tombol WhatsApp instan.`,

          agent_planner: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

KALENDER KONTEN 7 HARI INSPIRE WEBCRAFT:
- Hari 1 (Senin): Pilar Edukasi — "3 Alasan Bisnis Lokal Kehilangan Pelanggan Tanpa Website" | Format: Carousel 5 Slide | CTA: Simpan postingan ini
- Hari 2 (Selasa): Pilar Problem-Solution — "Website Lambat Bikin Rugi: Solusi Next.js Modern" | Format: Infografis Ringkas | CTA: Cek performa web Anda
- Hari 3 (Rabu): Pilar Studi Kasus — "Transformasi Usaha Jasa Meningkat 200% Setelah Punya Landing Page" | Format: Cerita Interaktif | CTA: Konsultasi gratis via WhatsApp
- Hari 4 (Kamis): Pilar Tips Teknis — "Anatomi Halaman Penjualan yang Menghasilkan Transaksi" | Format: Carousel Visual | CTA: Bagikan ke tim Anda
- Hari 5 (Jumat): Pilar Interaksi — "Fitur Website Apa yang Paling Dibutuhkan Bisnis Anda Sekarang?" | Format: Poll / Tanya Jawab | CTA: Komen di bawah
- Hari 6 (Sabtu): Pilar Portofolio — "Showcase Tampilan 3D Diorama Kantor AI Inspire WebCraft" | Format: Video Teaser 30 Detik | CTA: Kunjungi website kami
- Hari 7 (Minggu): Pilar Inspirasi & Penawaran — "Siapkan Bisnis Anda untuk Lonjakan Penjualan Pekan Depan" | Format: Quote & Banner Promo | CTA: Hubungi WhatsApp kami`,

          agent_creator: `HASIL SIMULASI — DEMO MODE (LOCAL SIMULATION)

NASKAH VIDEO & CAPTION SIAP POSTING:

[NASKAH VIDEO 45 DETIK]
(00:00 - 00:05) Visual: Karakter menunjukkan layar laptop kosong.
Voice Over: "Masih jualan cuma modal status chat? Calon pembeli sering ragu karena bisnis Anda belum punya website resmi?"
(00:05 - 00:20) Visual: Animasi kantor virtual 3D Inspire WebCraft bergerak aktif.
Voice Over: "Di Inspire WebCraft, kami bantu buatkan website profesional dan aplikasi interaktif dengan teknologi mutakhir. Desain cepat, responsif di HP, dan langsung siap pakai!"
(00:20 - 00:35) Visual: Demo landing page berkecepatan tinggi dengan tombol WhatsApp.
Voice Over: "Cocok untuk UMKM, toko online, jasa transportasi, hingga startup lokal."
(00:35 - 00:45) Visual: Tampilan logo Inspire WebCraft.
Voice Over: "Yuk upgrade bisnis Anda sekarang. Hubungi kami untuk konsultasi gratis!"

[CAPTION POSTINGAN]
Bisnis Anda sudah punya "rumah digital" resmi belum?
Di era serba cepat, website adalah bukti bahwa usaha Anda serius dan terpercaya.

Apa yang Anda dapatkan di Inspire WebCraft:
- Desain modern & mobile-friendly
- Integrasi tombol WhatsApp langsung
- Loading super cepat & ramah pencarian Google
- Tim ahli siap mendampingi

#InspireWebCraft #JasaWebsite #BikinWebsite #SolusiDigital #BisnisOnline #UMKMIndonesia`
        },
        ceoReview: `HASIL EVALUASI EKSEKUTIF CEO (VICTOR):
1. Evaluasi Konten: Sangat Bagus (Skor: 96/100). Menunjukkan keunggulan kompetitif agensi dengan narasi yang relevan untuk target UMKM.
2. Rekomendasi: Gunakan video sebagai iklan berbayar (Meta Ads) dengan target lokasi kota-kota utama.`
      };
    }
  }
}
