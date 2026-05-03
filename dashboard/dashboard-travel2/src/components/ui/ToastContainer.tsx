import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToasts, type Toast } from '../../utils/toast';

function ToastItem({ toast }: { toast: Toast }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };
  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <div className={`flex items-start gap-3 bg-white border border-slate-200 border-l-4 ${borders[toast.type]} rounded-lg shadow-lg px-4 py-3 min-w-[280px] max-w-[380px] animate-slide-in`}>
      {icons[toast.type]}
      <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
