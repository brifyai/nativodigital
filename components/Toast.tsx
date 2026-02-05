import React, { useEffect } from 'react';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500" />,
    error: <CancelIcon sx={{ fontSize: 20 }} className="text-red-500" />,
    warning: <WarningIcon sx={{ fontSize: 20 }} className="text-orange-500" />,
    info: <InfoIcon sx={{ fontSize: 20 }} className="text-blue-500" />
  };

  const colors = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-orange-500/10 border-orange-500/30',
    info: 'bg-blue-500/10 border-blue-500/30'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 ${colors[type]} border rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-md`}>
      {icons[type]}
      <span className="text-sm font-medium text-primary flex-1">{message}</span>
      <button 
        onClick={onClose}
        className="text-secondary hover:text-primary transition-colors"
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </button>
    </div>
  );
};

export default Toast;
