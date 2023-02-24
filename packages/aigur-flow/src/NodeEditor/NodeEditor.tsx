import { NodeDefinition, NodeDefinitionType } from '#/types';
import { useCallback, useRef, useState } from 'react';
import ReactFlow, { addEdge, Background, Panel, useEdgesState, useNodesState } from 'reactflow';

import { GenericNode } from '../nodeTypes/GenericNode';
import { InputNode } from '../nodeTypes/InputNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { ProviderNode } from '../nodeTypes/ProviderNode';

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
		position: { x: 550, y: 0 },
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
				nodeTypes={nodeTypes}
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
		const nodeId = node.id.split('@@')[0] as NodeDefinitionType;

		if (nodeId === 'pipeline-input') {
			pipeline.input = { subject: 'subject!' };
		} else if (nodeId === 'pipeline-output') {
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
