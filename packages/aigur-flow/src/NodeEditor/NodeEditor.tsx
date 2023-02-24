import { useCallback, useRef, useState } from 'react';
import ReactFlow, { addEdge, Background, Panel, useEdgesState, useNodesState } from 'reactflow';

const initialNodes = [];

const initialEdges = [];

let nodeCnt = 0;

export function NodeEditor() {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onSave = useCallback(() => {
		if (reactFlowInstance) {
			const flow = reactFlowInstance.toObject();
			const pipeline = reactFlowToAigurPipeline(flow);
			console.log(`***pipeline`, pipeline);
		}
	}, [reactFlowInstance]);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const nodeDefinitionId = event.dataTransfer.getData('application/aigurflow/id');
			const nodeDefinitionTitle = event.dataTransfer.getData('application/aigurflow/title');

			// check if the dropped element is valid
			if (typeof nodeDefinitionId === 'undefined' || !nodeDefinitionId) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const newNode = {
				id: `${nodeDefinitionId}@@${nodeCnt++}`,
				type: 'default', // TODO: get type by id (gpt -> provider, etc)
				position,
				data: { label: nodeDefinitionTitle },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance, setNodes]
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
				onInit={setReactFlowInstance}
				fitView
			>
				<Background />
				<Panel position="bottom-right">
					<button onClick={onSave}>Save</button>
				</Panel>
			</ReactFlow>
		</div>
	);
}

function reactFlowToAigurPipeline(flow: ReactFlowObject) {
	const nodes = flow.nodes;
	const edges = flow.edges;
	const pipeline: AigurPipeline = { input: null, output: null, nodes: [] };

	for (const node of nodes) {
		const [nodeId] = node.id.split('@@');

		if (nodeId === 'input') {
			pipeline.input = { subject: 'subject!' };
		} else if (nodeId === 'output') {
			pipeline.output = { joke: 'joke!' };
		} else {
			pipeline.nodes.push({
				id: nodeId,
			});
		}
	}

	// for (const edge of edges) {
	// 	const source = edge.source;
	// 	const target = edge.target;
	// 	const sourceNode = nodes.find((node) => node.id === source);
	// 	const targetNode = nodes.find((node) => node.id === target);
	// 	const sourceNodeDefinition = sourceNode.data.label;
	// 	const targetNodeDefinition = targetNode.data.label;

	// 	// TODO: configure nodes according to source/target
	// }

	return pipeline;
}

interface ReactFlowObject {
	nodes: {
		id: string;
	}[];
	edges: {
		id: string;
		source: string;
		target: string;
		sourceHandle: string;
		targetHandle: string;
	}[];
}

interface AigurPipeline {
	input: Record<string, any>; // TODO: zod?
	output: Record<string, any>; // TODO: ReadableStream
	nodes: any[];
}
