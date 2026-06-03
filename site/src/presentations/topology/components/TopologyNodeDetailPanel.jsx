import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Info, X } from 'lucide-react';
import { DEVICE_CREDENTIALS } from '../data/topologyData';

const TopologyNodeDetailPanel = ({ node, onClose }) => {
  if (!node) return null;

  const isPlatform = node.category === 'platform';
  const isDevice = node.ip && !isPlatform;

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto border-l-2 border-cyan-500/70 bg-[#0b1120] shadow-2xl shadow-black/40 sm:w-[400px] md:w-[450px]"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-700 bg-[#0f172a]/95 p-4 backdrop-blur-sm md:p-6">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white md:text-2xl">{node.name}</h2>
            <p className="mt-1 text-xs capitalize text-[#94a3b8] md:text-sm">
              {node.zone === 'platform' ? 'Workshop platform' : node.zone?.replace('-', ' ') || node.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-800/80"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6 p-4 md:p-6">
          {node.role && (
            <p className="text-sm leading-relaxed text-slate-200 md:text-base">{node.role}</p>
          )}

          {node.workshopNote && (
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/25 p-3 text-sm text-cyan-100/90">
              {node.workshopNote}
            </div>
          )}

          <dl className="space-y-3 text-sm">
            {node.ip && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">IP address</dt>
                <dd className="font-mono text-slate-200">{node.ip}</dd>
              </div>
            )}
            {node.os && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">OS / platform</dt>
                <dd className="text-slate-200">{node.os}</dd>
              </div>
            )}
            {node.protocol && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Access</dt>
                <dd className="text-slate-200">{node.protocol}</dd>
              </div>
            )}
            {isDevice && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Credentials</dt>
                <dd className="font-mono text-slate-200">{DEVICE_CREDENTIALS}</dd>
              </div>
            )}
            {node.login && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Login</dt>
                <dd className="font-mono text-slate-200">{node.login}</dd>
              </div>
            )}
            {node.nsoManaged && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">NSO instance</dt>
                <dd className="capitalize text-slate-200">{node.nsoManaged}</dd>
              </div>
            )}
          </dl>

          {node.url && (
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="h-4 w-4" />
              Open in browser
            </a>
          )}

          {node.managedDevices && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Managed devices</h3>
              </div>
              <ul className="space-y-1 text-sm text-slate-300">
                {node.managedDevices.map((d) => (
                  <li key={d} className="font-mono text-xs">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TopologyNodeDetailPanel;
