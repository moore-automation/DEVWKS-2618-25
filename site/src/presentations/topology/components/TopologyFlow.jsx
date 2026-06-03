import { useCallback, useLayoutEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TopologyNode from './TopologyNode';
import TopologyZoneNode from './TopologyZoneNode';
import TopologyEdge from './TopologyEdge';
import {
  topologyNodes,
  topologyZones,
  topologyEdges,
  nodePositions,
} from '../data/topologyData';

const nodeTypes = { topologyNode: TopologyNode, topologyZone: TopologyZoneNode };
const edgeTypes = { topologyEdge: TopologyEdge };

const FIT_PADDING = 0.16;

const TopologyFlow = ({ selectedNodeId, onNodeClick }) => {
  const createGraph = useCallback(() => {
    const zoneNodes = topologyZones.map((zone) => ({
      id: zone.id,
      type: 'topologyZone',
      position: nodePositions[zone.id] || { x: 0, y: 0 },
      data: { label: zone.label, zone: zone.zone, width: zone.width, height: zone.height },
      draggable: false,
      selectable: false,
      zIndex: 0,
    }));

    const deviceNodes = topologyNodes.map((nodeData) => ({
      id: nodeData.id,
      type: 'topologyNode',
      position: nodePositions[nodeData.id] || { x: 0, y: 0 },
      data: {
        nodeData,
        isSelected: nodeData.id === selectedNodeId,
      },
      zIndex: 10,
    }));

    const edges = topologyEdges.map((edge) => {
      const edgeConfig = {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: 'topologyEdge',
        data: { label: edge.label, dashed: edge.dashed },
        markerEnd: edge.dashed
          ? undefined
          : { type: MarkerType.ArrowClosed, width: 12, height: 12, color: '#64748b' },
      };
      if (edge.sourceHandle) edgeConfig.sourceHandle = edge.sourceHandle;
      if (edge.targetHandle) edgeConfig.targetHandle = edge.targetHandle;
      return edgeConfig;
    });

    return { nodes: [...zoneNodes, ...deviceNodes], edges };
  }, [selectedNodeId]);

  const [nodesState, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createGraph();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [createGraph, setNodes, setEdges]);

  const handleInit = useCallback((instance) => {
    instance.fitView({ padding: FIT_PADDING, duration: 0 });
  }, []);

  const handleNodeClick = useCallback(
    (_event, node) => {
      const nodeData = topologyNodes.find((n) => n.id === node.id);
      if (nodeData) onNodeClick(nodeData);
    },
    [onNodeClick],
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={handleInit}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.55}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
      >
        <Background color="#334155" gap={24} />
        <Controls
          showInteractive={false}
          className="react-flow-controls-dark !border-slate-700 !bg-slate-800"
        />
      </ReactFlow>
    </div>
  );
};

export default TopologyFlow;
