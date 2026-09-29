import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-950/90 text-rose-100',
    info: 'border-cyan-500/40 bg-cyan-950/90 text-cyan-100',
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm animate-slide-up pointer-events-none">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl pointer-events-auto ${
          borderColors[toastMessage.type]
        }`}
      >
        {icons[toastMessage.type]}
        <span className="text-xs font-semibold leading-tight">{toastMessage.text}</span>
      </div>
    </div>
  );
};
