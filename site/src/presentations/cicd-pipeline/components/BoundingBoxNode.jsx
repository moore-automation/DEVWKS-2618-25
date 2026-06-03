import { Handle, Position } from '@xyflow/react';

const BoundingBoxNode = ({ data }) => {
  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} id="box-top" className="!bg-sky-500 !opacity-0" />
      <Handle type="target" position={Position.Left} id="box-left" className="!bg-sky-500 !opacity-0" />
      <Handle type="source" position={Position.Left} id="box-left-source" className="!bg-sky-500 !opacity-0" />
      <div
        style={{
          width: '100%',
          height: '100%',
          border: '2px dashed rgba(56, 189, 248, 0.35)',
          borderRadius: '12px',
          backgroundColor: 'rgba(14, 165, 233, 0.06)',
          pointerEvents: 'none',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: 16,
            backgroundColor: '#070b14',
            padding: '4px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(51, 65, 85, 0.6)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#7dd3fc' }}>
            GitLab CI/CD Pipeline
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoundingBoxNode;
