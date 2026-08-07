import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error' | 'xp';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto p-3.5 rounded-2xl border-3 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex items-start justify-between gap-3 animate-slideInRight ${
            t.type === 'xp'
              ? 'bg-[#FFCC33] text-[#1A1A1A]'
              : t.type === 'error'
              ? 'bg-rose-500 text-white'
              : t.type === 'info'
              ? 'bg-sky-500 text-white'
              : 'bg-emerald-500 text-slate-950 font-black'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              {t.type === 'xp' ? (
                <Sparkles className="w-5 h-5 text-[#6D071A] animate-spin" />
              ) : t.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-white" />
              ) : t.type === 'info' ? (
                <Info className="w-5 h-5 text-white" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
              )}
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm leading-snug">{t.title}</div>
              {t.description && (
                <div className="text-[11px] opacity-90 mt-0.5 font-medium">{t.description}</div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="p-1 hover:bg-black/10 rounded-lg cursor-pointer shrink-0 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
