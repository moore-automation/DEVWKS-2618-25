import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const ExpandableImage = ({ src, alt = 'Workshop screenshot' }) => {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in rounded-xl border border-slate-700/80 text-left transition-colors hover:border-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        aria-label={`Enlarge: ${alt}`}
      >
        <img src={src} alt={alt} className="max-w-full rounded-xl" />
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-md border border-slate-600/80 bg-[#0b1120]/90 px-2 py-1 text-[10px] text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 md:text-xs">
          <ZoomIn className="h-3 w-3" />
          Click to enlarge
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-lg border border-slate-600 bg-slate-900/90 p-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white md:right-6 md:top-6"
              aria-label="Close enlarged image"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={src}
              alt={alt}
              className="max-h-[92vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableImage;
