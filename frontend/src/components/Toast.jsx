import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Trophy } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Trophy className="text-violet-400 w-5 h-5 shadow-lg shadow-violet-500/50" />,
    error: <AlertCircle className="text-red-400 w-5 h-5" />,
  };

  const bgColors = {
    success: 'bg-slate-900/90 border-violet-500/30',
    error: 'bg-slate-900/90 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`fixed bottom-8 right-8 z-[100] flex items-center space-x-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[type]}`}
    >
      <div className="bg-slate-800 p-2 rounded-xl border border-slate-700/50">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-[150px]">
        <p className="text-sm font-bold text-white tracking-wide uppercase text-[10px] opacity-50 mb-0.5">Notification</p>
        <p className="text-sm font-medium text-slate-100">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Decorative neon glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl -z-10 opacity-50" />
    </motion.div>
  );
};

export default Toast;
