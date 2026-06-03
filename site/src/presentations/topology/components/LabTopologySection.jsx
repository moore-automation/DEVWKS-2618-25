import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TopologyFlow from './TopologyFlow';
import { DEVICE_CREDENTIALS } from '../data/topologyData';

const LabTopologySection = ({ selectedNodeId, onNodeClick }) => {
  const [visible, setVisible] = useState(true);

  return (
    <section className="shrink-0 border-b border-slate-800/80 bg-[#070b14] px-3 py-2.5 md:px-6 md:py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white md:text-base">Lab topology</h2>
          {visible && (
            <p className="text-[11px] text-slate-500 md:text-xs">
              Workshop VMs and NSO-managed routers — click a node for access details
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="flex items-center gap-1 rounded-lg border border-slate-600/80 bg-[#111827]/90 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-white"
        >
          {visible ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Expand
            </>
          )}
        </button>
      </div>

      {visible && (
        <>
          <div
            className="mt-2 overflow-hidden rounded-xl border border-slate-700/80 bg-[#0f172a]/50"
            style={{ height: 'min(44vh, 400px)' }}
          >
            <TopologyFlow selectedNodeId={selectedNodeId} onNodeClick={onNodeClick} />
          </div>
          <p className="mt-1.5 hidden text-[10px] text-slate-500 md:block">
            Device credentials: <code className="text-slate-400">{DEVICE_CREDENTIALS}</code> — dashed lines =
            NSO management
          </p>
        </>
      )}
    </section>
  );
};

export default LabTopologySection;
