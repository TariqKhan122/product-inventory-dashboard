import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import { CheckCircleIcon, AlertCircleIcon, CloseIcon } from './Icons';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const typeConfig: Record<
    ToastType,
    { border: string; bg: string; text: string; icon: React.ReactNode }
  > = {
    success: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      icon: <CheckCircleIcon size={20} className="text-emerald-600 shrink-0" />,
    },
    error: {
      border: 'border-rose-500',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      icon: <AlertCircleIcon size={20} className="text-rose-600 shrink-0" />,
    },
    warning: {
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      icon: <AlertCircleIcon size={20} className="text-amber-600 shrink-0" />,
    },
    info: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      icon: <CheckCircleIcon size={20} className="text-indigo-600 shrink-0" />,
    },
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const config = typeConfig[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 ${config.border} bg-white transition-all transform animate-in slide-in-from-bottom-3 duration-200 border border-slate-200/80`}
          >
            {config.icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-600 leading-relaxed break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
