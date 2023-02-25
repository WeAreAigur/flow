import './NodeEditor.css';

import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
	addEdge,
	Background,
	Panel,
	useEdgesState,
	useNodesState,
	useStoreApi,
} from 'reactflow';

import { EditNodeModal } from '../EditNodeModal';
import { flowToPipeline } from '../flowToPipeline';
import { GenericNode } from '../nodeTypes/GenericNode';
import { InputNode } from '../nodeTypes/InputNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { ProviderNode } from '../nodeTypes/ProviderNode';
import { useNodeStore } from '../stores/useNode';
import { useNodesIOStore } from '../stores/useNodesIO';
import { NodeDefinition } from '../types';

const initialNodes = [
	{
		id: 'pipeline-input',
		type: 'pipeline-input',
		position: { x: 0, y: 0 },
		data: {
			title: 'Input',
		},
	},
	{
		id: 'pipeline-output',
		type: 'pipeline-output',
		position: { x: 850, y: 0 },
		data: {
			title: 'Output',
		},
	},
];

const initialEdges = [];

let nodeCnt = 0;

const nodeTypes = {
	'pipeline-input': InputNode,
	'pipeline-output': OutputNode,
	generic: GenericNode,
	provider: ProviderNode,
};

const MIN_DISTANCE = 550;
const PROXIMITY_CLASS = 'proximity';

export function NodeEditor() {
	const reactFlowWrapper = useRef(null);
	const store = useStoreApi();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const selectedNode = useNodeStore((state) => state.selectedNode);
	const nodesIO = useNodesIOStore((state) => state.io);
	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onSave = useCallback(() => {
		if (reactFlowInstance) {
			const flow = reactFlowInstance.toObject();
			const pipeline = flowToPipeline(flow, nodesIO);
			console.log(`***pipeline`, pipeline);
		}
	}, [nodesIO, reactFlowInstance]);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const nodeDefinition: NodeDefinition = JSON.parse(
				event.dataTransfer.getData('application/aigurflow')
			);

			console.log(`***nodeDefinition`, nodeDefinition);

			// check if the dropped element is valid
			if (!nodeDefinition?.id) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			console.log(`***nodeDefinition.type`, nodeDefinition.type);
			const newNode = {
				id: `${nodeDefinition.id}@@${nodeCnt++}`,
				type: nodeDefinition.type,
				position,
				data: nodeDefinition,
			};

			setNodes((nodes) => nodes.concat(newNode));
		},
		[reactFlowInstance, setNodes]
	);

	const getClosestEdge = useCallback(
		(node) => {
			const { nodeInternals } = store.getState();
			const storeNodes = Array.from(nodeInternals.values());

			const closestNode = storeNodes.reduce(
				(res, n) => {
					if (n.id !== node.id) {
						const dx = n.positionAbsolute.x - node.positionAbsolute.x;
						const dy = n.positionAbsolute.y - node.positionAbsolute.y;
						const d = Math.sqrt(dx * dx + dy * dy);

						if (d < res.distance && d < MIN_DISTANCE) {
							res.distance = d;
							res.node = n;
						}
					}

					return res;
				},
				{
					distance: Number.MAX_VALUE,
					node: null,
				}
			);

			if (!closestNode.node) {
				return null;
			}

			const closeNodeIsSource = closestNode.node.positionAbsolute.x < node.positionAbsolute.x;

			return {
				id: `${node.id}-${closestNode.node.id}`,
				source: closeNodeIsSource ? closestNode.node.id : node.id,
				target: closeNodeIsSource ? node.id : closestNode.node.id,
			};
		},
		[store]
	);

	const onNodeDrag = useCallback(
		(_, node) => {
			const closeEdge = getClosestEdge(node);

			setEdges((edges) => {
				const nextEdges = edges.filter((e) => e.className !== PROXIMITY_CLASS);

				if (
					closeEdge &&
					!nextEdges.find(
						(nextEdge) =>
							nextEdge.source === closeEdge.source && nextEdge.target === closeEdge.target
					)
				) {
					(closeEdge as any).className = PROXIMITY_CLASS;
					nextEdges.push(closeEdge);
				}

				return nextEdges;
			});
		},
		[getClosestEdge, setEdges]
	);

	const onNodeDragStop = useCallback(
		(_, node) => {
			const closeEdge = getClosestEdge(node);

			setEdges((edges) => {
				const nextEdges = edges.filter((edge) => edge.className !== PROXIMITY_CLASS);

				if (closeEdge) {
					nextEdges.push(closeEdge);
				}

				return nextEdges;
			});
		},
		[getClosestEdge, setEdges]
	);

	return (
		<div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onDragOver={onDragOver}
				onDrop={onDrop}
				onNodeDrag={onNodeDrag}
				onNodeDragStop={onNodeDragStop}
				onInit={setReactFlowInstance}
				nodeTypes={nodeTypes}
				maxZoom={0.75}
				fitView
			>
				<Background />
				<Panel position="bottom-right">
					<button onClick={onSave}>Save</button>
				</Panel>
			</ReactFlow>
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
