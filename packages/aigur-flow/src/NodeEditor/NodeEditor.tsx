import ReactFlow, { addEdge, Background, Panel, useEdgesState, useNodesState } from 'reactflow';
import { useCallback, useRef, useState } from 'react';

import { NodeDefinition } from '../types';
import { useNodesIOStore } from '../stores/useNodesIO';
import { useNodeStore } from '../stores/useNode';
import { ProviderNode } from '../nodeTypes/ProviderNode';
import { OutputNode } from '../nodeTypes/OutputNode';
import { InputNode } from '../nodeTypes/InputNode';
import { GenericNode } from '../nodeTypes/GenericNode';
import { flowToPipeline } from '../flowToPipeline';
import { EditNodeModal } from '../EditNodeModal';

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
			<EditNodeModal node={selectedNode} />
		</div>
	);
}
