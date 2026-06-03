import { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import JobNode from './JobNode';
import IconNode from './IconNode';
import BoundingBoxNode from './BoundingBoxNode';
import InfrastructureNode from './InfrastructureNode';
import AnimatedEdge from './AnimatedEdge';
import { pipelineData } from '../data/pipelineData';
import { platformOverrides } from '../data/platformPipelineData';
import { nsoPipelineData, nsoNodePositions, NSO_CICD_STAGES } from '../data/nsoPipelineData';

const nodeTypes = {
  jobNode: JobNode,
  iconNode: IconNode,
  boundingBox: BoundingBoxNode,
  infrastructure: InfrastructureNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const ICON_NODE_IDS = new Set([
  'self-service-user',
  'network-engineer',
  'portal-api',
  'yaml-terraform',
  'gitlab-repo',
]);

const EDGE_HANDLES = {
  'self-service-user->portal-api':    { sourceHandle: 'right', targetHandle: 'left' },
  'network-engineer->yaml-terraform': { sourceHandle: 'right', targetHandle: 'left' },
  'yaml-terraform->gitlab-repo':      { sourceHandle: 'bottom', targetHandle: 'top' },
  'portal-api->gitlab-repo':          { sourceHandle: 'top-source', targetHandle: 'bottom-target' },
  'test-idempotency->failure':        { sourceHandle: 'bottom-source', targetHandle: null },
  'test-integration->success':        { sourceHandle: 'top-source', targetHandle: null },
};

const NODE_POSITIONS = {
  'network-engineer':  { x: 0,    y: 15 },
  'yaml-terraform':    { x: 270,  y: 15 },
  'gitlab-repo':       { x: 270,  y: 185 },
  'self-service-user': { x: 0,    y: 355 },
  'portal-api':        { x: 270,  y: 355 },
  'validate':          { x: 570,  y: 180 },
  'plan':              { x: 820,  y: 180 },
  'deploy':            { x: 1070, y: 180 },
  'test-idempotency':  { x: 1320, y: 105 },
  'test-integration':  { x: 1320, y: 300 },
  'network-platform':  { x: 1070, y: 430 },
  'success':           { x: 1560, y: 105 },
  'failure':           { x: 1560, y: 300 },
};

const EMPTY_SET = new Set();

const PipelineFlow = ({ currentStepData, onNodeClick, platform, compact = false, excludeFromProgress }) => {
  const isNso = platform === 'nso';
  const data = isNso ? nsoPipelineData : pipelineData;
  const nodePositions = isNso ? nsoNodePositions : NODE_POSITIONS;
  const iconNodeIds = useMemo(() => (isNso ? new Set() : ICON_NODE_IDS), [isNso]);
  const cicdStageIds = useMemo(
    () => (isNso ? NSO_CICD_STAGES : ['validate', 'plan', 'deploy', 'test', 'notify']),
    [isNso],
  );

  const overrides = useMemo(
    () => (platform && !isNso ? (platformOverrides[platform] || {}) : {}),
    [platform, isNso],
  );
  const excluded = excludeFromProgress || EMPTY_SET;

  const createNodesAndEdges = useCallback(() => {
    const nodes = [];
    const edges = [];

    data.jobs.forEach((baseJob) => {
        const job = overrides[baseJob.id] ? { ...baseJob, ...overrides[baseJob.id] } : baseJob;
        const inPath = !excluded.has(job.id);
        const isActive =
          inPath &&
          currentStepData?.type === 'stage' && currentStepData?.jobId === job.id;
        const isCompleted =
          inPath &&
          currentStepData?.type === 'stage' &&
          data.jobs.findIndex((j) => j.id === job.id) <
            data.jobs.findIndex((j) => j.id === currentStepData?.jobId);

        let nodeType = 'jobNode';
        if (iconNodeIds.has(job.id)) {
          nodeType = 'iconNode';
        } else if (job.isInfrastructure) {
          nodeType = 'infrastructure';
        }

        const nodePosition = nodePositions[job.id] || { x: 0, y: 0 };

        const isPlanActive = !isNso && currentStepData?.type === 'stage' && currentStepData?.jobId === 'plan';

        nodes.push({
          id: job.id,
          type: nodeType,
          position: nodePosition,
          data: {
            job,
            isActive,
            isCompleted,
            isPending: !isActive && !isCompleted,
            label: job.isInfrastructure ? (isNso ? 'NSO' : 'Network Platform') : job.name,
            description: job.isInfrastructure && isActive ? (isNso ? 'Package deployed to NSO' : 'Config pushed via Terraform') : null,
            planActivity: job.isInfrastructure && isPlanActive ? 'Read current state' : null,
          },
          zIndex: job.isInfrastructure ? 5 : 10,
        });

        if (job.dependencies) {
          job.dependencies.forEach((depId) => {
            if (!isNso && job.id === 'validate' && depId === 'gitlab-repo') return;

            const edgeInPath = !excluded.has(job.id) && !excluded.has(depId);
            const edgeIsActive =
              edgeInPath &&
              currentStepData?.type === 'stage' && currentStepData?.jobId === job.id;

            const isFailurePath = job.condition === 'on_failure';
            const isSuccessPath = job.condition === 'on_success';
            const isGreyedOut = isFailurePath;

            let edgeIsCompleted =
              edgeInPath &&
              currentStepData?.type === 'stage' &&
              data.jobs.findIndex((j) => j.id === job.id) <
                data.jobs.findIndex((j) => j.id === currentStepData?.jobId);

            if ((isSuccessPath || isFailurePath) && edgeIsActive) {
              edgeIsCompleted = true;
            }

            const edgeConfig = {
              id: `${depId}-${job.id}`,
              source: depId,
              target: job.id,
              type: 'animated',
              data: {
                isActive: edgeIsActive && !isGreyedOut && !edgeIsCompleted,
                isCompleted: edgeIsCompleted && !isGreyedOut,
                isGreyedOut,
              },
              animated: edgeIsActive && !isGreyedOut && !edgeIsCompleted,
            };

            const handleKey = `${depId}->${job.id}`;
            const handleOverride = EDGE_HANDLES[handleKey];
            if (handleOverride) {
              edgeConfig.sourceHandle = handleOverride.sourceHandle;
              edgeConfig.targetHandle = handleOverride.targetHandle;
            }

            if (!isNso && job.id === 'plan' && depId === 'network-platform') {
              edgeConfig.source = 'plan';
              edgeConfig.target = 'network-platform';
              edgeConfig.id = 'plan-network-platform';
              edgeConfig.sourceHandle = 'bottom-source';
              edgeConfig.targetHandle = 'top-left-target';
            } else if (!isNso && job.id === 'network-platform') {
              edgeConfig.sourceHandle = 'bottom-source';
            }

            edges.push(edgeConfig);

            if (!isNso && job.id === 'test-integration' && depId === 'network-platform') {
              edges.push({
                id: `${job.id}-${depId}-response`,
                source: job.id,
                target: depId,
                type: 'animated',
                sourceHandle: 'bottom-source',
                targetHandle: 'top-target',
                data: {
                  isActive: edgeIsActive,
                  isCompleted: edgeIsCompleted,
                  isBidirectional: true,
                  label: 'API Response',
                },
                animated: edgeIsActive,
                style: { strokeDasharray: '5,5' },
              });
            }
          });
        }
    });

    const cicdNodes = nodes.filter((node) => {
      const job = node.data?.job;
      return job && cicdStageIds.includes(job.stage);
    });

    if (cicdNodes.length > 0) {
      const minX = Math.min(...cicdNodes.map((n) => n.position.x));
      const maxX = Math.max(...cicdNodes.map((n) => n.position.x));
      const minY = Math.min(...cicdNodes.map((n) => n.position.y));
      const maxY = Math.max(...cicdNodes.map((n) => n.position.y));

      nodes.unshift({
        id: 'cicd-pipeline-box',
        type: 'boundingBox',
        position: { x: minX - 30, y: minY - 35 },
        data: {
          width: maxX - minX + 250,
          height: maxY - minY + 140,
        },
        draggable: false,
        selectable: false,
        zIndex: 0,
      });

      edges.push({
        id: 'gitlab-repo-cicd-pipeline-box',
        source: 'gitlab-repo',
        target: 'cicd-pipeline-box',
        type: 'animated',
        sourceHandle: 'right',
        targetHandle: 'box-left',
        data: { isActive: false, isCompleted: false, isGreyedOut: false },
      });
    }

    return { nodes, edges };
  }, [currentStepData, overrides, excluded, data, nodePositions, iconNodeIds, cicdStageIds, isNso]);

  const [nodesState, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [createNodesAndEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (event, node) => {
      if (node.data.job) onNodeClick(node.data.job);
    },
    [onNodeClick],
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: compact ? 0.05 : 0.1 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={16} opacity={0.35} />
        {!compact && <Controls className="react-flow-controls-dark !bg-[#0f172a] !border-slate-700" />}
        {!compact && (
          <MiniMap
            className="!bg-[#0f172a] !border-slate-700"
            nodeColor={(node) => {
              if (node.data?.isActive) return '#38bdf8';
              if (node.data?.isCompleted) return '#34d399';
              return '#475569';
            }}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default PipelineFlow;
