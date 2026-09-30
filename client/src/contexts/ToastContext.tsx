import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              t.type === 'success'
                ? 'bg-white/95 dark:bg-[#1d2226]/95 border-emerald-300 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-100 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'bg-white/95 dark:bg-[#1d2226]/95 border-rose-300 dark:border-rose-700/60 text-rose-950 dark:text-rose-100 shadow-rose-500/10'
                : 'bg-white/95 dark:bg-[#1d2226]/95 border-blue-300 dark:border-[#0a66c2]/50 text-slate-900 dark:text-slate-100 shadow-blue-500/10'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#0a66c2] dark:text-[#70b5f9] flex-shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs font-semibold leading-relaxed">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
