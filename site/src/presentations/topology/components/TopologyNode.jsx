import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Cloud,
  GitBranch,
  Monitor,
  Router,
  Server,
  Shield,
  SwitchCamera,
} from 'lucide-react';

const categoryConfig = {
  platform: {
    icon: Server,
    gradient: 'from-cyan-600/40 to-indigo-800/30',
    border: 'border-cyan-500/70',
    activeBorder: 'border-cyan-300',
    glow: 'shadow-cyan-500/35',
    iconColor: 'text-cyan-200',
  },
  router: {
    icon: Router,
    gradient: 'from-slate-600/35 to-slate-800/25',
    border: 'border-slate-500/60',
    activeBorder: 'border-sky-400',
    glow: 'shadow-sky-500/30',
    iconColor: 'text-slate-200',
  },
  switch: {
    icon: SwitchCamera,
    gradient: 'from-violet-700/30 to-violet-900/20',
    border: 'border-violet-500/55',
    activeBorder: 'border-violet-300',
    glow: 'shadow-violet-500/30',
    iconColor: 'text-violet-200',
  },
  firewall: {
    icon: Shield,
    gradient: 'from-orange-700/35 to-orange-900/25',
    border: 'border-orange-500/60',
    activeBorder: 'border-orange-300',
    glow: 'shadow-orange-500/30',
    iconColor: 'text-orange-200',
  },
  host: {
    icon: Monitor,
    gradient: 'from-emerald-700/30 to-emerald-900/20',
    border: 'border-emerald-500/55',
    activeBorder: 'border-emerald-300',
    glow: 'shadow-emerald-500/30',
    iconColor: 'text-emerald-200',
  },
  cloud: {
    icon: Cloud,
    gradient: 'from-slate-700/25 to-slate-900/15',
    border: 'border-slate-600/50',
    activeBorder: 'border-slate-400',
    glow: 'shadow-slate-500/25',
    iconColor: 'text-slate-300',
  },
};

const platformIcons = {
  devtools: GitBranch,
  devbox: Monitor,
};

/** Shorter labels on-canvas — full detail in click panel */
const displayName = (nodeData) => {
  const short = {
    'nso-dev': 'NSO Dev',
    'nso-prod': 'NSO Prod',
    devbox: 'DevBox',
    devtools: 'DevTools',
    'sandbox-bridge': 'sandbox bridge',
  };
  return short[nodeData.id] || nodeData.name;
};

const TopologyNode = ({ data }) => {
  const { nodeData, isSelected } = data;
  const isPlatform = nodeData.category === 'platform';
  const config = categoryConfig[nodeData.category] || categoryConfig.router;
  const Icon = platformIcons[nodeData.id] || config.icon;
  const borderClass = isSelected ? config.activeBorder : config.border;
  const shadowClass = isSelected ? `shadow-lg ${config.glow}` : '';
  const label = displayName(nodeData);

  return (
    <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
      <Handle type="target" position={Position.Top} id="top-target" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="target" position={Position.Left} id="left-target" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="target" position={Position.Bottom} id="bottom-target" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="source" position={Position.Top} id="top-source" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="source" position={Position.Right} id="right-source" className="!h-2 !w-2 !border-0 !bg-slate-500" />
      <Handle type="source" position={Position.Left} id="left-source" className="!h-2 !w-2 !border-0 !bg-slate-500" />

      <div
        className={`relative flex cursor-pointer items-center gap-2 rounded-lg border-2 bg-gradient-to-br transition-all duration-200 hover:brightness-110 ${config.gradient} ${borderClass} ${shadowClass} ${
          isPlatform
            ? 'min-w-[148px] max-w-[168px] px-3 py-2.5'
            : 'min-w-[128px] max-w-[148px] px-2.5 py-2'
        }`}
      >
        <div className={`shrink-0 ${config.iconColor}`}>
          <Icon className={isPlatform ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        </div>
        <div className="min-w-0 text-left leading-tight">
          <div className={`font-semibold text-white ${isPlatform ? 'text-[13px]' : 'text-xs'}`}>
            {label}
          </div>
          {isPlatform && nodeData.ip && (
            <div className="mt-0.5 font-mono text-[11px] text-cyan-200/80">{nodeData.ip}</div>
          )}
          {!isPlatform && nodeData.nsoManaged && (
            <div className="mt-0.5 text-[10px] font-medium text-sky-400/90">NSO {nodeData.nsoManaged}</div>
          )}
        </div>
      </div>

      {isSelected && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{ boxShadow: '0 0 22px rgba(56,189,248,0.35)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
};

export default memo(TopologyNode);
