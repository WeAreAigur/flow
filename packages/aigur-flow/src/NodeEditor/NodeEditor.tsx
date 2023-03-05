import './NodeEditor.css';

import { zodToObj } from 'zod-to-obj';
import ReactFlow, {
	addEdge,
	Background,
	Edge,
	Panel,
	updateEdge,
	useEdgesState,
	useNodesState,
	useStoreApi,
} from 'reactflow';
import { useCallback, useEffect, useRef, useState } from 'react';

import { makeid } from '@aigur/client/src/makeid';

import { upperFirst } from '../utils/stringUtils';
import { getPreviousNodes } from '../utils/getPreviousNodes';
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
import { AudioInputNode } from '../pipelineNodeTypes/InputNodes/AudioInputNode/AudioInputNode';
import { GenericNode } from '../pipelineNodeTypes/GenericNode';
import { nodeRepository } from '../nodeRepository';
import { flowToPipelineData, invokePipeline, pipelineDataToPipeline } from '../flowToPipeline';
import { EditNodeModal } from '../EditNodeModal';

function loadDataFromUrl() {
	return;
	if (typeof window === 'undefined' || !window.location.hash.slice(1)) return;
	const data = JSON.parse(atob(window.location.hash.slice(1)));
	if (data?.flow.nodes) {
		for (let node of data.flow.nodes) {
			console.log(`***node`, node);
			node.data = nodeRepository[node.data.id];
		}
	}
	return data;
}

const savedFlow = { nodes: null, edges: null }; // loadDataFromUrl().flow;

const initialNodes = savedFlow?.nodes ?? [];

const initialEdges = savedFlow?.edges ?? [];

let nodeCnt = 0;

const nodeTypes = {
	'pipeline-inputText': TextInputNode,
	'pipeline-inputAudio': AudioInputNode,
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
	const reactFlowWrapper = useRef(null);
	const edgeUpdateSuccessful = useRef(true);
	const store = useStoreApi();
	const { setNodeIO, initIO } = useNodesIOStore((state) => state);
	const selectPipeline = usePipelineStore((state) => state.selectPipeline);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const selectedNode = useNodeStore((state) => state.selectedNode);
	const nodesIO = useNodesIOStore((state) => state.io);
	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	const [output, setOutput] = useState(null);
	const { setFlow, currentFlow } = useFlowStore((state) => state);

	useEffect(() => {
		const data = loadDataFromUrl();
		if (!data) {
			return;
		}
		if (data.flow) {
			console.log(`setting flow from url`, data.flow);
			setNodes(data.flow.nodes);
			setEdges(data.flow.edges);
		}
		if (data.nodesIO) {
			console.log(`setting io from url`, data.nodesIO);
			initIO(data.nodesIO);
		}
	}, []);

	const saveFlowInUrl = useCallback(() => {
		return;
		if (reactFlowInstance) {
			setTimeout(() => {
				console.log(`saving`);
				const flow = reactFlowInstance.toObject();
				if (!flow?.nodes.length && typeof window !== 'undefined') {
					history.replaceState('', '', location.pathname);
					return;
				}
				const base64Flow = btoa(JSON.stringify({ flow, nodesIO }));
				window.location.hash = base64Flow;
			});
		}
	}, [nodesIO, reactFlowInstance]);

	useEffect(() => {
		saveFlowInUrl();
	}, [nodesIO, saveFlowInUrl]);

	const connectNodesProperties = useCallback(
		(edge: Edge<any>) => {
			const { nodeInternals } = store.getState();

			const sourceNode = nodeInternals.get(edge.source);
			const targetNode = nodeInternals.get(edge.target);

			const targetInputFields = zodToObj(targetNode.data.schema.input);
			const targetRequiredInputFields = targetInputFields.filter((field) => field.required);
			const sourceOutputFields = zodToObj(sourceNode.data.schema.output);

			if (targetRequiredInputFields.length > 1) {
				return;
			}
			const filteredOutputFields = sourceOutputFields.filter(
				(field) => field.type === targetRequiredInputFields[0].type
			);

			if (filteredOutputFields.length > 1) {
				return;
			}

			const previousNodes = getPreviousNodes(targetNode.id, currentFlow.toObject());

			const sourceNodeIndex = previousNodes.length - 2 < 0 ? 'input' : previousNodes.length - 2;
			setNodeIO(targetNode.id, {
				input: {
					[targetRequiredInputFields[0]
						.property]: `$context.${sourceNodeIndex}.${filteredOutputFields[0].property}$`,
				},
				output: {},
			});

			// get targetNode's schema.input
			// find required property
			// get sourceNode's schema.output
			// find property with same type as required property
			// if only one, connect
			// setNodeIO
		},
		[currentFlow, setNodeIO, store]
	);

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
			const nodeDefinitionId: string = event.dataTransfer.getData('application/aigurflow');
			const nodeDefinition = nodeRepository[nodeDefinitionId];

			// check if the dropped element is valid
			if (!nodeDefinition) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const newNode = {
				id: `${nodeDefinition.id}@@${nodeCnt++}`,
				type: `${nodeDefinition.type}${upperFirst(nodeDefinition.subtype ?? '')}`,
				position,
				data: nodeDefinition,
				tag: makeid(16),
			};

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

			const closeNodeIsSource = closestNode.node.positionAbsolute.y < node.positionAbsolute.y;

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

			connectNodesProperties(edge);
			saveFlowInUrl();
			edgeUpdateSuccessful.current = true;
		},
		[connectNodesProperties, saveFlowInUrl, setEdges]
	);

	function newPipeline() {
		setNodes([]);
		setEdges([]);
		initIO({});
	}

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
				<Panel position="top-right">
					<button onClick={newPipeline} className="btn btn-secondary btn-sm">
						New
					</button>
				</Panel>
				<Panel position="bottom-right">
					<button onClick={onRun} className="btn btn-primary btn-lg">
						Run
					</button>
				</Panel>
				{/* <Panel position="bottom-left">
					<div className="bg-neutral-800 text-white h-24 w-[32rem] p-2 rounded-lg">
						<pre>{output}</pre>
					</div>
				</Panel> */}
			</ReactFlow>
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
