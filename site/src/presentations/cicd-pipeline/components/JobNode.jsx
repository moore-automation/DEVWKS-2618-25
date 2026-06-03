import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

const JobNode = ({ data, isConnectable }) => {
  const { job, isActive, isCompleted, isPending } = data;

  const getStatusIcon = () => {
    if (job.condition === 'on_success') {
      return <CheckCircle2 className={`w-5 h-5 text-emerald-400 ${isActive ? 'animate-pulse' : ''}`} />;
    }
    if (job.condition === 'on_failure') {
      return <XCircle className={`w-5 h-5 text-rose-400 ${isActive ? 'animate-pulse' : ''}`} />;
    }
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (isActive) return <Circle className="w-5 h-5 text-sky-400 animate-pulse" />;
    return <Circle className="w-5 h-5 text-slate-600" />;
  };

  const getNodeStyle = () => {
    if (job.condition === 'on_failure') {
      return isActive
        ? 'bg-rose-950/60 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.35)]'
        : 'bg-rose-950/30 border-rose-500/45';
    }
    if (job.condition === 'on_success') {
      return isActive
        ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
        : 'bg-emerald-950/35 border-emerald-500/50';
    }
    if (isActive)
      return 'bg-sky-950/50 border-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.4)]';
    if (isCompleted) return 'bg-emerald-950/45 border-emerald-400/90';
    if (isPending) return 'bg-[#0f172a] border-slate-600';
    return 'bg-[#070b14] border-slate-700';
  };

  return (
    <>
      <Handle type="target" position={Position.Top} id="top-target" isConnectable={isConnectable} className="w-3 h-3 !bg-slate-600 !opacity-0" />
      <Handle type="source" position={Position.Top} id="top-source" isConnectable={isConnectable} className="w-3 h-3 !bg-slate-600 !opacity-0" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 !bg-slate-600" />
      <Handle type="target" position={Position.Bottom} id="bottom-target" isConnectable={isConnectable} className="w-3 h-3 !bg-teal-500 !opacity-0" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`px-6 py-4 rounded-lg border-2 ${getNodeStyle()} min-w-[200px] transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">{job.name}</div>
            <div className="text-xs text-[#94a3b8] mt-1">{job.stage}</div>
          </div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 !bg-slate-600" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-blue-500 !opacity-0"
        style={{ left: '50%', bottom: '-6px' }}
      />
    </>
  );
};

export default memo(JobNode);
