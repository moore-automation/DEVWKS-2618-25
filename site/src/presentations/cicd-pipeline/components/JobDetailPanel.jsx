import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Package, FileText, AlertCircle } from 'lucide-react';
import TerminalSimulator from '../../../shared/components/TerminalSimulator';

const JobDetailPanel = ({ job, onClose }) => {
  if (!job) return null;

  const hasTerminal = job.terminalLines && job.terminalLines.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[450px] lg:w-[500px] bg-[#0b1120] border-l-2 border-sky-500/80 shadow-2xl shadow-black/40 flex flex-col z-50"
      >
        <div className="shrink-0 bg-[#0f172a]/95 border-b border-slate-700 p-4 md:p-6 flex items-center justify-between backdrop-blur-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{job.name}</h2>
            <p className="text-xs md:text-sm text-[#94a3b8] mt-1">Stage: {job.stage}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/80 rounded-lg transition-colors" type="button">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className={`${hasTerminal ? 'flex-1 min-h-0' : 'flex-1'} overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6`}>
          <div>
            <p className="text-slate-200 leading-relaxed">{job.description}</p>
          </div>

          {job.yamlExample && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">YAML Example</h3>
              </div>
              <div className="bg-[#020617] rounded-lg p-4">
                <pre className="font-mono text-sm text-cyan-300 overflow-x-auto">{job.yamlExample}</pre>
              </div>
            </motion.div>
          )}

          {job.repoInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-semibold text-white">Repository Contents</h3>
              </div>
              <div className="bg-[#020617] rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Project Name</p>
                  <p className="text-white font-semibold">{job.repoInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="text-slate-200">{job.repoInfo.description}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Contents</p>
                  <ul className="space-y-1">
                    {job.repoInfo.contents.map((item, idx) => (
                      <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                        <span className="text-pink-400">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {!hasTerminal && job.scripts && job.scripts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Scripts</h3>
              </div>
              <div className="bg-[#020617] rounded-lg p-4 space-y-2">
                {job.scripts.map((script, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="font-mono text-sm text-green-400 flex items-start gap-2"
                  >
                    <span className="text-slate-500 select-none">$</span>
                    <span>{script}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {job.artifacts && job.artifacts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Artifacts</h3>
              </div>
              <div className="space-y-2">
                {job.artifacts.map((artifact, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="bg-slate-800/90 rounded px-3 py-2 text-sm text-slate-200 font-mono"
                  >
                    {artifact}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {job.rules && job.rules.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Rules</h3>
              </div>
              <div className="space-y-2">
                {job.rules.map((rule, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    className="text-sm text-slate-400 flex items-start gap-2"
                  >
                    <span className="text-cyan-400">&bull;</span>
                    <span>{rule}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {job.condition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"
            >
              <p className="text-orange-400 text-sm font-semibold">Conditional: {job.condition}</p>
            </motion.div>
          )}
        </div>

        {hasTerminal && (
          <div className="min-h-0 flex-1 border-t border-slate-700 p-3 md:p-4">
            <TerminalSimulator
              key={job.id}
              lines={job.terminalLines}
              title={job.terminalTitle || job.stage}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default JobDetailPanel;
