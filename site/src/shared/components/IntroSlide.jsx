import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const IntroSlide = ({ title, subtitle }) => {
  return (
    <div className="flex w-full justify-center px-6 py-10 md:px-8 md:py-14">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-3xl text-center"
      >
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex justify-center md:mb-8"
        >
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-sky-600 p-5 shadow-lg shadow-violet-950/40 md:rounded-3xl md:p-6">
            <Sparkles className="h-12 w-12 text-white md:h-14 md:w-14" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-4 bg-gradient-to-r from-[#a78bfa] via-sky-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent md:mb-5 md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-6 text-base text-[#94a3b8] md:mb-8 md:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-slate-500"
        >
          Use arrow keys or the navigation bar to begin
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntroSlide;
