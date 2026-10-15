import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Bot,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';

export const OwnerCommandConsole: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useOfficeStore((state) => state.conversations);
  const activePlan = useOfficeStore((state) => state.activePlan);
  const isSendingCommand = useOfficeStore((state) => state.isSendingCommand);
  const commandError = useOfficeStore((state) => state.commandError);

  const sendOwnerCommand = useOfficeStore((state) => state.sendOwnerCommand);
  const approvePlan = useOfficeStore((state) => state.approvePlan);
  const isOwnerConsoleOpen = useOfficeStore((state) => state.isOwnerConsoleOpen);
  const setOwnerConsoleOpen = useOfficeStore((state) => state.setOwnerConsoleOpen);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activePlan, isSendingCommand]);

  if (!isOwnerConsoleOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSendingCommand) return;

    const textToSend = inputText.trim();
    // Do NOT wipe immediately before send succeeds; only clear after success
    const success = await sendOwnerCommand(textToSend);
    if (success) {
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickPrompts = [
    'Buat landing page jasa sopir dengan tombol WhatsApp',
    'Susun kalender konten 7 hari dan naskah Reels/TikTok',
    'Rancang strategi pemasaran & positioning Inspire WebCraft',
    'Buat prompt AI & arsitektur sistem website 3D interaktif'
  ];

  return (
    <div
      className={`fixed top-16 right-4 z-30 w-[92vw] sm:w-[420px] md:w-[450px] transition-all duration-300 ease-out flex flex-col ${
        isMinimized ? 'h-14' : 'h-[520px] max-h-[75vh]'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">Owner & Manager Console</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Diana
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DEMO MODE — LOCAL SIMULATION
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title={isMinimized ? 'Perluas Konsol' : 'Kecilkan Konsol'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOwnerConsoleOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-xs font-mono"
              title="Tutup Konsol"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Minimized view indicator */}
        {!isMinimized && (
          <>
            {/* Status Info Banner */}
            <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-3 py-1.5 text-[10px] text-emerald-300 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Simulasi Lokal Cepat Aktif • Respon Instan Bebas Gangguan API</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Owner: Pak Yoga
              </span>
            </div>

            {/* Conversation Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs">
              {conversations.map((msg) => {
                const isOwner = msg.sender === 'owner';
                const isSystem = msg.sender === 'system';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                        isOwner
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                          : isSystem
                          ? 'bg-indigo-950/70 border border-indigo-700/50 text-indigo-100 rounded-tl-none'
                          : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60 shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Proposed Work Plan Card if waiting for Owner Approval */}
              {activePlan && activePlan.status === 'proposed' && (
                <div className="bg-slate-850 border border-sky-500/50 rounded-2xl p-3.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-750 pb-2">
                    <span className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Rencana Kerja Diajukan: {activePlan.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      Menunggu Persetujuan
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    <span className="text-slate-400 font-medium">Tujuan:</span> {activePlan.goal}
                  </p>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Distribusi Tugas ({activePlan.steps.length} Agen):
                    </div>
                    {activePlan.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-white">
                            {st.stepNumber}. {st.title}
                          </span>
                          <span className="text-[10px] text-sky-400 font-mono capitalize">
                            {st.assignedRole.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px]">{st.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Explicit Approval Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => approvePlan(activePlan.id, true)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui & Jalankan Rencana</span>
                    </button>
                    <button
                      onClick={() => approvePlan(activePlan.id, false, 'Perlu penyesuaian strategi')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    >
                      Tolak / Revisi
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isSendingCommand && (
                <div className="flex items-center gap-2 text-xs text-sky-400 py-2">
                  <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <span>Diana sedang memproses instruksi kerja...</span>
                </div>
              )}

              {/* Error Banner */}
              {commandError && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-2.5 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Perhatian:</div>
                    <div>{commandError}</div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pills */}
            <div className="px-3.5 py-1.5 bg-slate-850/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0">
              <span className="text-[10px] text-slate-400 font-medium shrink-0">Contoh:</span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  disabled={isSendingCommand}
                  onClick={() => setInputText(prompt)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60 transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-slate-850 border-t border-slate-800 flex items-end gap-2 shrink-0"
            >
              <textarea
                rows={2}
                value={inputText}
                disabled={isSendingCommand}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Berikan instruksi pekerjaan kepada Diana (Contoh: Buat landing page jasa sopir) — Tekan Enter..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSendingCommand}
                className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-600/30 flex items-center justify-center"
                title="Kirim Instruksi (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
