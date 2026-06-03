import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { motion } from 'framer-motion';

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const isActive = data?.isActive || false;
  const isCompleted = data?.isCompleted || false;
  const isGreyedOut = data?.isGreyedOut || false;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isGreyedOut ? '#334155' : isActive ? '#38bdf8' : isCompleted ? '#34d399' : '#64748b',
          strokeWidth: isActive ? 3 : 2,
          opacity: isGreyedOut ? 0.2 : isActive || isCompleted ? 1 : 0.35,
        }}
      />
      {isActive && !isGreyedOut && (
        <motion.circle
          r="4"
          fill="#38bdf8"
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </motion.circle>
      )}
      <EdgeLabelRenderer>
        {isActive && !isGreyedOut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-sky-500 text-white text-xs px-2 py-1 rounded-md shadow-lg shadow-sky-900/40"
          >
            Running
          </motion.div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(AnimatedEdge);
