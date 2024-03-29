import './NodeEditor.css';

import ReactFlow, {
    addEdge, Background, Connection, Edge, Node, ReactFlowInstance, updateEdge, useEdgesState,
    useNodesState, useStoreApi
} from 'reactflow';
import { useCallback, useEffect, useRef, useState } from 'react';

import { createNode } from './nodeCreator';
import { useConnectNodesProperties } from './connectNodeProperties';
import { useUserStore } from '../stores/userUser';
import { usePipelineStore } from '../stores/usePipeline';
import { useNodesIOStore } from '../stores/useNodesIO';
import { useNodeStore } from '../stores/useNode';
import { useFlowStore } from '../stores/useFlow';
import { ProviderNode } from '../pipelineNodeTypes/ProviderNode';
import { TextOutputNode } from '../pipelineNodeTypes/OutputNodes/TextOutputNode';
import { OutputNode } from '../pipelineNodeTypes/OutputNodes/OutputNode';
import { ImageOutputNode } from '../pipelineNodeTypes/OutputNodes/ImageOutputNode';
import { AudioOutputNode } from '../pipelineNodeTypes/OutputNodes/AudioOutputNode/AudioOutputNode';
import { TextInputNode } from '../pipelineNodeTypes/InputNodes/TextInputNode';
import { InputNode } from '../pipelineNodeTypes/InputNodes/InputNode';
import { ImageInputNode } from '../pipelineNodeTypes/InputNodes/ImageInputNode/ImageInputNode';
import { AudioInputNode } from '../pipelineNodeTypes/InputNodes/AudioInputNode/AudioInputNode';
import { GenericNode } from '../pipelineNodeTypes/GenericNode';
import { nodeRepository } from '../nodes/nodeRepository';
import { flowToPipelineData, invokePipeline, pipelineDataToPipeline } from '../flowToPipeline';
import { EditNodeModal } from '../EditNodeModal';

function loadDataFromUrl() {
	if (typeof window === 'undefined' || !window.location.hash.slice(1)) return;
	const data = JSON.parse(atob(window.location.hash.slice(1)));
	if (data?.flow.nodes) {
		for (let node of data.flow.nodes) {
			node.data = (nodeRepository as any)[node.data.id];
		}
	}
	return data;
}

let isLoaded = false;

const savedFlow = { nodes: null, edges: null }; // loadDataFromUrl().flow;

const initialNodes = savedFlow?.nodes ?? [];

const initialEdges = savedFlow?.edges ?? [];

const nodeTypes = {
	'pipeline-inputText': TextInputNode,
	'pipeline-inputAudio': AudioInputNode,
	'pipeline-inputImage': ImageInputNode,
	'pipeline-inputCustom': InputNode,
	'pipeline-outputText': TextOutputNode,
	'pipeline-outputAudio': AudioOutputNode,
	'pipeline-outputImage': ImageOutputNode,
	'pipeline-outputCustom': OutputNode,
	generic: GenericNode,
	provider: ProviderNode,
};

const MIN_DISTANCE = 550;
const PROXIMITY_CLASS = 'proximity';

export function NodeEditor() {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const edgeUpdateSuccessful = useRef(true);
	const store = useStoreApi();
	const { setNodeIO, initIO, deleteNodeIO, io: nodesIO } = useNodesIOStore((state) => state);
	const selectPipeline = usePipelineStore((state) => state.selectPipeline);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(
		null
	);
	const selectedNode = useNodeStore((state) => state.selectedNode);
	const [output, setOutput] = useState(null);
	const setFlow = useFlowStore((state) => state.setFlow);
	const [isRunning, setIsRunning] = useState(false);
	const connectNodesProperties = useConnectNodesProperties();
	const userId = useUserStore((state) => state.userId);

	const onConnect = useCallback(
		(edge: any) => {
			connectNodesProperties(edge);
			setEdges((eds) => addEdge(edge, eds));
		},
		[connectNodesProperties, setEdges]
	);

	useEffect(() => {
		if (!isLoaded) {
			isLoaded = true;
			const data = loadDataFromUrl();
			if (!data) {
				return;
			}
			if (data.flow) {
				setNodes(data.flow.nodes);
				setEdges(data.flow.edges);
			}
			if (data.nodesIO) {
				initIO(data.nodesIO);
			}
		}
	}, []);

	const saveFlowInUrl = useCallback(() => {
		setTimeout(() => {
			if (reactFlowInstance) {
				const flow = reactFlowInstance.toObject();
				if (!flow?.nodes.length && typeof window !== 'undefined') {
					history.replaceState('', '', location.pathname);
					return;
				}
				const base64Flow = btoa(JSON.stringify({ flow, nodesIO }));
				window.location.hash = base64Flow;
			}
		});
	}, [nodesIO, reactFlowInstance]);

	useEffect(() => {
		saveFlowInUrl();
	}, [nodesIO, saveFlowInUrl]);

	const onDragOver = useCallback((event: any) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const runPipeline = useCallback(async () => {
		if (reactFlowInstance) {
			setIsRunning(true);
			const flow = reactFlowInstance.toObject();
			const pipelineData = await flowToPipelineData(flow, nodesIO);
			if (!pipelineData) {
				// TODO: show error
				setIsRunning(false);
				return;
			}
			const pipeline = pipelineDataToPipeline(pipelineData);
			selectPipeline(pipeline);
			const output = await invokePipeline(pipeline, pipelineData, userId);
			setIsRunning(false);
			setOutput(output);
		}
	}, [nodesIO, reactFlowInstance, selectPipeline, userId]);

	const onDrop = useCallback(
		(event: any) => {
			event.preventDefault();
			if (!reactFlowWrapper.current) {
				return;
			}
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const nodeDefinitionId: string = event.dataTransfer.getData('application/aigurflow');
			const nodeDefinition = (nodeRepository as any)[nodeDefinitionId];

			// check if the dropped element is valid
			if (!nodeDefinition) {
				return;
			}

			const position = reactFlowInstance
				? reactFlowInstance.project({
						x: event.clientX - reactFlowBounds.left,
						y: event.clientY - reactFlowBounds.top,
				  })
				: { x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top };
			const newNode = createNode(nodeDefinition, position);
			setNodeIO(newNode.id, {
				type: newNode.type,
				subType: newNode.subType,
				input: {},
				output: {},
			});

			setNodes((nodes) => nodes.concat(newNode));
			saveFlowInUrl();
		},
		[reactFlowInstance, saveFlowInUrl, setNodeIO, setNodes]
	);

	const getClosestEdge = useCallback(
		(node: Node) => {
			const { nodeInternals } = store.getState();
			const storeNodes = Array.from(nodeInternals.values());

			const closestNode = storeNodes.reduce(
				(res, n) => {
					if (n && n.id !== node.id) {
						const dx = n.positionAbsolute!.x - node.positionAbsolute!.x;
						const dy = n.positionAbsolute!.y - node.positionAbsolute!.y;
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
					node: null as any,
				}
			);

			if (!closestNode.node) {
				return null;
			}

			const closeNodeIsSource = closestNode.node.positionAbsolute.y < node.positionAbsolute!.y;

			return {
				id: `${node.id}-${closestNode.node.id}`,
				source: closeNodeIsSource ? closestNode.node.id : node.id,
				target: closeNodeIsSource ? node.id : closestNode.node.id,
			};
		},
		[store]
	);

	const onNodeDrag = useCallback(
		(_: any, node: Node) => {
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
		(_: any, node: Node) => {
			const closeEdge = getClosestEdge(node);

			setEdges((edges) => {
				const nextEdges = edges.filter((edge) => edge.className !== PROXIMITY_CLASS);

				if (
					closeEdge &&
					!nextEdges.some(
						(edge) => edge.source === closeEdge.source && edge.target === closeEdge.target
					)
				) {
					nextEdges.push(closeEdge);
				}

				return nextEdges;
			});
			if (closeEdge) {
				connectNodesProperties(closeEdge);
			}
			saveFlowInUrl();
		},
		[connectNodesProperties, getClosestEdge, saveFlowInUrl, setEdges]
	);

	useEffect(() => {
		if (reactFlowInstance) {
			setFlow(reactFlowInstance);
		}
	}, [reactFlowInstance, setFlow]);

	// useEffect(() => {
	// 	if (
	// 		currentFlow &&
	// 		edges &&
	// 		edges.length > 0 &&
	// 		edges[edges.length - 1].className !== PROXIMITY_CLASS
	// 	) {
	// 		connectNodesProperties(edges[edges.length - 1]);
	// 	}
	// }, [connectNodesProperties, edges, currentFlow]);

	const onEdgeUpdateStart = useCallback(() => {
		edgeUpdateSuccessful.current = false;
	}, []);

	const onEdgeUpdate = useCallback(
		(oldEdge: Edge, newConnection: Connection) => {
			edgeUpdateSuccessful.current = true;
			setEdges((els) => updateEdge(oldEdge, newConnection, els));
		},
		[setEdges]
	);

	const onEdgeUpdateEnd = useCallback(
		(_: any, edge: Edge) => {
			if (!edgeUpdateSuccessful.current) {
				setEdges((eds) => eds.filter((e) => e.id !== edge.id));
				deleteNodeIO(edge.target);
			}

			// connectNodesProperties(edge);
			saveFlowInUrl();
			edgeUpdateSuccessful.current = true;
		},
		[deleteNodeIO, saveFlowInUrl, setEdges]
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
			</ReactFlow>
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
