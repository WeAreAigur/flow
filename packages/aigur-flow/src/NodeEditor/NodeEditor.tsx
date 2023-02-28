import './NodeEditor.css';

import ReactFlow, {
	addEdge,
	Background,
	Panel,
	updateEdge,
	useEdgesState,
	useNodesState,
	useStoreApi,
} from 'reactflow';
import { useCallback, useRef, useState } from 'react';

import { NodeDefinition } from '../types';
import { usePipelineStore } from '../stores/usePipeline';
import { useNodesIOStore } from '../stores/useNodesIO';
import { useNodeStore } from '../stores/useNode';
import { useFlowStore } from '../stores/useFlow';
import { ProviderNode } from '../nodeTypes/ProviderNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { InputNode } from '../nodeTypes/InputNode';
import { GenericNode } from '../nodeTypes/GenericNode';
import { nodeDefinitions } from '../nodeDefinitions';
import { flowToPipelineData, invokePipeline, pipelineDataToPipeline } from '../flowToPipeline';
import { EditNodeModal } from '../EditNodeModal';

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
	const selectPipeline = usePipelineStore((state) => state.selectPipeline);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const selectedNode = useNodeStore((state) => state.selectedNode);
	const nodesIO = useNodesIOStore((state) => state.io);
	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	const [output, setOutput] = useState(null);
	const setFlow = useFlowStore((state) => state.setFlow);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onRun = useCallback(async () => {
		if (reactFlowInstance) {
			const flow = reactFlowInstance.toObject();
			const pipelineData = await flowToPipelineData(flow, nodesIO);
			const pipeline = pipelineDataToPipeline(pipelineData);
			selectPipeline(pipeline);
			const output = await invokePipeline(pipeline, pipelineData);
			setOutput(output);
		}
	}, [nodesIO, reactFlowInstance, selectPipeline]);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const nodeDefinition: NodeDefinition = JSON.parse(
				event.dataTransfer.getData('application/aigurflow')
			);

			// check if the dropped element is valid
			if (!nodeDefinition?.id) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
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
			const flow = reactFlowInstance.toObject();
			setFlow(flow);
		},
		[getClosestEdge, reactFlowInstance, setEdges, setFlow]
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
			const flow = reactFlowInstance.toObject();
			setFlow(flow);

			edgeUpdateSuccessful.current = true;
		},
		[reactFlowInstance, setEdges, setFlow]
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
					<button onClick={onRun} className="btn btn-primary btn-lg">
						Run
					</button>
				</Panel>
				<Panel position="bottom-left">
					<div className="bg-neutral-800 text-white h-24 w-[32rem] p-2 rounded-lg">
						<pre>{output?.joke}</pre>
					</div>
				</Panel>
			</ReactFlow>
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
