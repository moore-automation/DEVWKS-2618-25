import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ShieldCheck,
  PlusCircle,
  Settings,
  ShieldAlert,
  Star,
  FileCode,
  Sliders,
  Globe,
  Lock,
  Rocket,
  Building2,
  Layers,
  Wifi,
  Cpu,
} from 'lucide-react';

const ICONS = {
  'check-circle': CheckCircle2,
  'shield-check': ShieldCheck,
  'plus-circle': PlusCircle,
  settings: Settings,
  'shield-alert': ShieldAlert,
  star: Star,
  'file-code': FileCode,
  sliders: Sliders,
  globe: Globe,
  lock: Lock,
  rocket: Rocket,
  building: Building2,
  layers: Layers,
  wifi: Wifi,
  cpu: Cpu,
};

const colorStyles = {
  emerald: {
    activeBg: 'bg-emerald-500',
    activeRing: 'ring-emerald-400/60',
    activeText: 'text-emerald-300',
    border: 'border-emerald-500/40',
  },
  blue: {
    activeBg: 'bg-blue-500',
    activeRing: 'ring-blue-400/60',
    activeText: 'text-blue-300',
    border: 'border-blue-500/40',
  },
  indigo: {
    activeBg: 'bg-indigo-500',
    activeRing: 'ring-indigo-400/60',
    activeText: 'text-indigo-300',
    border: 'border-indigo-500/40',
  },
  purple: {
    activeBg: 'bg-purple-500',
    activeRing: 'ring-purple-400/60',
    activeText: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  amber: {
    activeBg: 'bg-amber-500',
    activeRing: 'ring-amber-400/60',
    activeText: 'text-amber-300',
    border: 'border-amber-500/40',
  },
  yellow: {
    activeBg: 'bg-yellow-500',
    activeRing: 'ring-yellow-400/60',
    activeText: 'text-yellow-300',
    border: 'border-yellow-500/40',
  },
  cyan: {
    activeBg: 'bg-cyan-500',
    activeRing: 'ring-cyan-400/60',
    activeText: 'text-cyan-300',
    border: 'border-cyan-500/40',
  },
  orange: {
    activeBg: 'bg-orange-500',
    activeRing: 'ring-orange-400/60',
    activeText: 'text-orange-300',
    border: 'border-orange-500/40',
  },
};

const TaskFlowItem = ({ task, isActive, isCompleted, isLast }) => {
  const colors = colorStyles[task.color] || colorStyles.emerald;
  const TaskIcon = ICONS[task.icon] || Circle;

  return (
    <div className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}>
      {!isLast && (
        <div
          className="absolute left-[7px] top-4 w-px bg-gradient-to-b from-slate-600 via-slate-600 to-slate-700"
          style={{ height: 'calc(100% - 0.25rem)' }}
          aria-hidden
        />
      )}

      <div className="relative z-10 flex flex-col items-center shrink-0">
        {isCompleted && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 ring-2 ring-emerald-500/50">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
          </div>
        )}
        {isActive && (
          <motion.div
            className={`flex h-4 w-4 items-center justify-center rounded-full ${colors.activeBg} ring-2 ${colors.activeRing}`}
            animate={{ scale: [1, 1.12, 1], opacity: [1, 0.85, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TaskIcon className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
          </motion.div>
        )}
        {!isCompleted && !isActive && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-600 bg-[#0f172a]">
            <Circle className="h-2 w-2 text-slate-500" />
          </div>
        )}
      </div>

      <div
        className={`min-w-0 flex-1 rounded-xl border px-4 py-3 transition-all duration-300 ${
          isActive
            ? 'border border-slate-600/80 bg-[#0f172a]/90 border-l-4 border-l-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
            : isCompleted
              ? 'border-slate-700/80 border-l-4 border-l-emerald-600/70 bg-emerald-950/15'
              : 'border-slate-800 bg-[#070b14]/80'
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xs font-mono text-slate-500">#{task.order}</span>
          <h3
            className={`text-sm font-semibold ${
              isActive ? 'text-white' : isCompleted ? 'text-emerald-100/95' : 'text-slate-400'
            }`}
          >
            {task.title}
          </h3>
        </div>
        <p
          className={`mt-1 text-xs leading-relaxed ${
            isActive ? 'text-slate-400' : isCompleted ? 'text-slate-500' : 'text-slate-600'
          }`}
        >
          {task.description}
        </p>
      </div>
    </div>
  );
};

export default TaskFlowItem;
