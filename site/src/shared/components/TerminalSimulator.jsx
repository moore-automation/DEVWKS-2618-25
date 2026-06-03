import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const TerminalSimulator = ({ lines = [], title = 'terminal', speed = 30 }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const startAnimation = useCallback(() => {
    setVisibleCount(0);
    let count = 0;

    const tick = () => {
      count += 1;
      setVisibleCount(count);

      if (count < lines.length) {
        const line = lines[count];
        const delay = line?.type === 'command' ? speed * (line.text?.length || 1) : line?.type === 'blank' ? 50 : 80;
        timerRef.current = setTimeout(tick, delay);
      }
    };

    if (lines.length > 0) {
      const firstLine = lines[0];
      const firstDelay = firstLine?.type === 'command' ? speed * (firstLine.text?.length || 1) : 80;
      timerRef.current = setTimeout(tick, firstDelay);
    }
  }, [lines, speed]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    queueMicrotask(() => {
      startAnimation();
    });
    return () => clearTimeout(timerRef.current);
  }, [startAnimation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const getLineColor = (line) => {
    switch (line.type) {
      case 'command': return 'text-emerald-400';
      case 'error': return 'text-rose-400';
      case 'success': return 'text-emerald-300';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-sky-400';
      case 'dim': return 'text-slate-500';
      case 'blank': return '';
      default: return 'text-slate-200';
    }
  };

  const displayed = lines.slice(0, visibleCount);
  const isDone = visibleCount >= lines.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full rounded-xl border border-slate-700/90 bg-[#020617] overflow-hidden shadow-inner"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] border-b border-slate-700/80">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-slate-500 ml-2 font-mono">{title}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-4 font-mono text-xs md:text-sm leading-relaxed bg-[#030712]">
        {displayed.map((line, idx) => {
          if (line.type === 'blank') {
            return <div key={idx} className="h-4" />;
          }
          return (
            <div key={idx} className={`${getLineColor(line)} whitespace-pre-wrap`}>
              {line.type === 'command' && <span className="text-slate-500 select-none">$ </span>}
              {line.text}
            </div>
          );
        })}

        {!isDone && (
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
        )}

        {isDone && displayed.length > 0 && (
          <div className="mt-1">
            <span className="text-slate-500 select-none">$ </span>
            <span className="inline-block w-2 h-4 bg-slate-500/60 animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalSimulator;
