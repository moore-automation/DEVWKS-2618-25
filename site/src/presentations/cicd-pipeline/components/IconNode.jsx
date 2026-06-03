import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';

function SelfServiceSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
      <rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 7h20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4.5" cy="5" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="7" cy="5" r="0.7" fill="currentColor" opacity="0.5" />
      <circle cx="9.5" cy="5" r="0.7" fill="currentColor" opacity="0.5" />
      <rect x="5" y="9.5" width="14" height="2.2" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5" y="13.2" width="14" height="2.2" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="14" y="16.5" width="5" height="1.8" rx="0.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function EngineerSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 21v-2a5 5 0 0110 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M16 13l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13l-2 2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 12.5l-2 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PortalAPISVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 7.5v-1M17 12v-1M15.5 9.5h-1M19.5 9.5h-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function YamlTerraformSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
      <path
        d="M20 16V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V16M20 16H4M20 16L21.5 18C21.7761 18.4 21.5 19 21 19H3C2.5 19 2.22386 18.4 2.5 18L4 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="7" y="8" width="10" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function GitLabSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16">
      <path d="M12 21L15.5 10.5H8.5L12 21Z" fill="currentColor" opacity="0.8" />
      <path d="M12 21L8.5 10.5H3L12 21Z" fill="currentColor" opacity="0.6" />
      <path d="M3 10.5L1.5 15L12 21L3 10.5Z" fill="currentColor" opacity="0.4" />
      <path d="M3 10.5H8.5L6.5 4.5L3 10.5Z" fill="currentColor" opacity="0.5" />
      <path d="M12 21L15.5 10.5H21L12 21Z" fill="currentColor" opacity="0.6" />
      <path d="M21 10.5L22.5 15L12 21L21 10.5Z" fill="currentColor" opacity="0.4" />
      <path d="M21 10.5H15.5L17.5 4.5L21 10.5Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

const ICON_COMPONENTS = {
  'self-service-user': SelfServiceSVG,
  'network-engineer': EngineerSVG,
  'portal-api': PortalAPISVG,
  'yaml-terraform': YamlTerraformSVG,
  'gitlab-repo': GitLabSVG,
};

const IconNode = ({ data }) => {
  const { job, isActive, isCompleted } = data;

  const Icon = ICON_COMPONENTS[job.id];

  const getColor = () => {
    if (isActive) return 'from-sky-500/45 to-sky-600/35';
    if (isCompleted) return 'from-emerald-500/45 to-emerald-600/35';
    return 'from-slate-600/35 to-slate-700/30';
  };

  const getTextColor = () => {
    if (isActive) return 'text-sky-200';
    if (isCompleted) return 'text-emerald-200';
    return 'text-slate-300';
  };

  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
      <Handle type="target" position={Position.Top} id="top" className="!bg-slate-600 !opacity-0" />
      <Handle type="source" position={Position.Top} id="top-source" className="!bg-slate-600 !opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-slate-600 !opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-slate-600 !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-slate-600 !opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-slate-600 !opacity-0" />

      <div className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-br ${getColor()} shadow-lg min-w-[160px]`}>
        <div className={`${getTextColor()} transition-colors`}>{Icon ? <Icon /> : null}</div>
        <div className="text-center">
          <div className="text-sm font-bold text-white">{job.name}</div>
          <div className="text-xs text-white/70">{job.stage}</div>
        </div>

        {isCompleted && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg shadow-emerald-900/50">
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-sky-400/25"
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default IconNode;
