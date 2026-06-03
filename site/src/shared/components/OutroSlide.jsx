import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const OutroSlide = ({ title, subtitle }) => {
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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
            <CheckCircle2 className="w-20 h-20 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-[#94a3b8] mb-8"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="text-lg text-slate-200">
            Presentation complete
          </div>
          <div className="text-sm text-slate-500">
            Press Home to return to the main menu
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OutroSlide;
