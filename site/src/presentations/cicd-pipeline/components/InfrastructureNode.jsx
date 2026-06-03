import { motion } from 'framer-motion';
import { Handle, Position } from '@xyflow/react';

function NetworkIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
      <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="14" y="22" width="10" height="6" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="27" y="22" width="10" height="6" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="40" y="22" width="10" height="6" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="12" y="36" width="8" height="6" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="22" y="36" width="8" height="6" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="32" y="36" width="8" height="6" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="42" y="36" width="8" height="6" rx="1" fill="currentColor" opacity="0.6" />
      <line x1="19" y1="28" x2="16" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="19" y1="28" x2="26" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="28" x2="26" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="28" x2="36" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="45" y1="28" x2="36" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="45" y1="28" x2="46" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

const InfrastructureNode = ({ data }) => {
  const { label, isActive, isCompleted, description, planActivity } = data;

  const getColor = () => {
    if (isActive) return 'border-sky-400 bg-sky-500/15 shadow-[0_0_18px_rgba(56,189,248,0.25)]';
    if (isCompleted) return 'border-emerald-500/80 bg-emerald-500/20';
    return 'border-slate-600 bg-[#0f172a]/60';
  };

  const getTextColor = () => {
    if (isActive) return 'text-sky-200';
    if (isCompleted) return 'text-emerald-200';
    return 'text-slate-400';
  };

  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
      <Handle type="target" position={Position.Top} className="!bg-teal-500" />
      <Handle type="target" position={Position.Top} id="top-target" className="!bg-teal-500" style={{ left: '60%' }} />
      <Handle type="target" position={Position.Top} id="top-left-target" className="!bg-teal-500" style={{ left: '40%' }} />
      <Handle type="source" position={Position.Top} id="top-source" className="!bg-teal-500" style={{ left: '40%' }} />
      <Handle type="target" position={Position.Left} id="left-target" className="!bg-teal-500" />
      <Handle type="source" position={Position.Right} id="right-source" className="!bg-teal-500" />

      <div className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed ${getColor()} shadow-lg min-w-[180px]`}>
        <div className={`${getTextColor()} transition-colors`}>
          <NetworkIcon />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">{label || 'Network Platform'}</div>
          <div className="text-xs text-slate-400">SD-WAN / Catalyst / ACI</div>
        </div>

        {isActive && description && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center text-sky-200/90 mt-1 max-w-[160px]">
            {description}
          </motion.div>
        )}
        {planActivity && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center text-sky-300/95 mt-1 max-w-[160px] font-medium">
            {planActivity}
          </motion.div>
        )}

        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-sky-400/12"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default InfrastructureNode;
