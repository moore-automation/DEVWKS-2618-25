import { motion } from 'framer-motion';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 origin-left"
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
};

export default ProgressIndicator;
