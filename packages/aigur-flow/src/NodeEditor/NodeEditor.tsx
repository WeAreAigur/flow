import './NodeEditor.css';

import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
	addEdge,
	Background,
	Panel,
	updateEdge,
	useEdgesState,
	useNodesState,
	useStoreApi,
} from 'reactflow';

import { EditNodeModal } from '../EditNodeModal';
import { flowToPipeline, invokePipeline } from '../flowToPipeline';
import { nodeDefinitions } from '../nodeDefinitions';
import { GenericNode } from '../nodeTypes/GenericNode';
import { InputNode } from '../nodeTypes/InputNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { ProviderNode } from '../nodeTypes/ProviderNode';
import { useNodeStore } from '../stores/useNode';
import { useNodesIOStore } from '../stores/useNodesIO';
import { NodeDefinition } from '../types';

const initialNodes = [
	{
		id: 'input',
		type: 'pipeline-input',
		position: { x: 0, y: 0 },
		data: nodeDefinitions.Pipeline.input,
	},
	{
		id: 'output',
		type: 'pipeline-output',
		position: { x: 850, y: 0 },
		data: nodeDefinitions.Pipeline.output,
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

const MIN_DISTANCE = 400;
const PROXIMITY_CLASS = 'proximity';

export function NodeEditor() {
	const reactFlowWrapper = useRef(null);
	const edgeUpdateSuccessful = useRef(true);
	const store = useStoreApi();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const selectedNode = useNodeStore((state) => state.selectedNode);
	const nodesIO = useNodesIOStore((state) => state.io);
	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	const [output, setOutput] = useState(null);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onSave = useCallback(async () => {
		if (reactFlowInstance) {
			const flow = reactFlowInstance.toObject();
			const pipeline = await flowToPipeline(flow, nodesIO);
			console.log(`***pipeline`, pipeline);
			const output = await invokePipeline(pipeline);
			setOutput(output);
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
				const nextEdges = edges.filter((edge) => edge.className !== PROXIMITY_CLASS);

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
					if (
						!nextEdges.some(
							(edge) => edge.source === closeEdge.source && edge.target === closeEdge.target
						)
					) {
						nextEdges.push(closeEdge);
					}
				}

				return nextEdges;
			});
		},
		[getClosestEdge, setEdges]
	);

	const onEdgeUpdateStart = useCallback(() => {
		edgeUpdateSuccessful.current = false;
	}, []);

	const onEdgeUpdate = useCallback(
		(oldEdge, newConnection) => {
			edgeUpdateSuccessful.current = true;
			setEdges((els) => updateEdge(oldEdge, newConnection, els));
		},
		[setEdges]
	);

	const onEdgeUpdateEnd = useCallback(
		(_, edge) => {
			if (!edgeUpdateSuccessful.current) {
				setEdges((eds) => eds.filter((e) => e.id !== edge.id));
			}

			edgeUpdateSuccessful.current = true;
		},
		[setEdges]
	);

	return (
		<div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onEdgeUpdate={onEdgeUpdate}
				onEdgeUpdateStart={onEdgeUpdateStart}
				onEdgeUpdateEnd={onEdgeUpdateEnd}
				onConnect={onConnect}
				onDragOver={onDragOver}
				onDrop={onDrop}
				onNodeDrag={onNodeDrag}
				onNodeDragStop={onNodeDragStop}
				onInit={setReactFlowInstance}
				nodeTypes={nodeTypes}
				maxZoom={0.75}
				proOptions={{ hideAttribution: true }}
				fitView
			>
				<Background />
				<Panel position="bottom-right">
					<button onClick={onSave}>Save</button>
				</Panel>
				<Panel position="top-right">Output - {JSON.stringify(output)}</Panel>
			</ReactFlow>
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
