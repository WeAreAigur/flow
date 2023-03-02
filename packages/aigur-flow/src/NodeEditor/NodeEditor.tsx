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
import { flowToPipelineData, invokePipeline, pipelineDataToPipeline } from '../flowToPipeline';
import { nodeDefinitions } from '../nodeDefinitions';
import { GenericNode } from '../nodeTypes/GenericNode';
import { InputNode } from '../nodeTypes/InputNode';
import { AudioInputNode } from '../nodeTypes/InputNodes/AudioInputNode/AudioInputNode';
import { TextInputNode } from '../nodeTypes/InputNodes/TextInputNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { ProviderNode } from '../nodeTypes/ProviderNode';
import { useFlowStore } from '../stores/useFlow';
import { useNodeStore } from '../stores/useNode';
import { useNodesIOStore } from '../stores/useNodesIO';
import { usePipelineStore } from '../stores/usePipeline';
import { NodeDefinition } from '../types';

function load(): { nodes: any[]; edges: any[] } {
	if (typeof window === 'undefined' || !window.location.hash.slice(1)) return;
	const flow = JSON.parse(atob(window.location.hash.slice(1)));
	return flow;
}

const savedFlow = load();

const initialNodes = savedFlow?.nodes ?? [
	{
		id: 'input',
		type: 'pipeline-input-audio',
		position: { x: 0, y: 0 },
		data: nodeDefinitions.Pipeline.inputAudio,
	},
	{
		id: 'output',
		type: 'pipeline-output',
		position: { x: 850, y: 0 },
		data: nodeDefinitions.Pipeline.output,
	},
];

const initialEdges = savedFlow?.edges ?? [];

let nodeCnt = 0;

const nodeTypes = {
	'pipeline-input-text': TextInputNode,
	'pipeline-input-audio': AudioInputNode,
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

	const saveFlowInUrl = useCallback(() => {
		if (reactFlowInstance) {
			setTimeout(() => {
				const flow = reactFlowInstance.toObject();
				const base64Flow = btoa(JSON.stringify(flow));
				window.location.hash = base64Flow;
				console.log(`***saving flow`, flow);
			});
		}
	}, [reactFlowInstance]);

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
				type: `${nodeDefinition.type}${nodeDefinition.subtype ? `-${nodeDefinition.subtype}` : ''}`,
				position,
				data: nodeDefinition,
			};

			console.log(`***nodeDefinition`, nodeDefinition);
			console.log(`***newNode`, newNode);

			setNodes((nodes) => nodes.concat(newNode));
			saveFlowInUrl();
		},
		[reactFlowInstance, saveFlowInUrl, setNodes]
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
			saveFlowInUrl();
		},
		[getClosestEdge, reactFlowInstance, saveFlowInUrl, setEdges, setFlow]
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
			saveFlowInUrl();
			edgeUpdateSuccessful.current = true;
		},
		[reactFlowInstance, saveFlowInUrl, setEdges, setFlow]
	);

	return (
		<div className="h-full reactflow-wrapper" ref={reactFlowWrapper}>
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
