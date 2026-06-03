import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

const TopologyEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dashed = data?.dashed;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={dashed ? undefined : markerEnd}
        style={{
          stroke: dashed ? '#475569' : '#64748b',
          strokeWidth: dashed ? 1.25 : 1.5,
          strokeDasharray: dashed ? '6 4' : undefined,
          opacity: dashed ? 0.55 : 0.7,
        }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="rounded border border-slate-700/50 bg-[#0f172a]/95 px-1 py-0.5 text-[8px] text-slate-500"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(TopologyEdge);
