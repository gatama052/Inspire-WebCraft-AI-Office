import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';

export const DialogueOverlay: React.FC = () => {
  const activeDialogues = useOfficeStore((state) => state.activeDialogues);
  const clearDialogue = useOfficeStore((state) => state.clearDialogue);

  if (activeDialogues.length === 0) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-lg w-[92vw] pointer-events-none">
      {activeDialogues.map((dialogue) => {
        return (
          <div
            key={dialogue.id}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-sky-500/40 shadow-2xl rounded-2xl p-3.5 sm:p-4 text-slate-100 flex items-start gap-3 w-full transition-all animate-in fade-in slide-in-from-top-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-xs sm:text-sm text-sky-300">
                  {dialogue.speakerName}{' '}
                  <span className="text-[10px] font-normal text-slate-400 capitalize">
                    ({dialogue.speakerRole.replace('_', ' ')})
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Live Interaction
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{dialogue.text}"
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
