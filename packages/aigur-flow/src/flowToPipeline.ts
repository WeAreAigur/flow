import { createClient } from '@aigur/client';

import { FlowPipeline, NodeDefinitionType, NodesIO, PipelineData } from './types';

export function flowToPipeline(flow: FlowPipeline, nodesIO: NodesIO) {
	console.log(`***flow`, flow);
	console.log(`***nodesIO`, nodesIO);
	const nodes = flow.nodes;
	const edges = flow.edges;
	const pipelineData: PipelineData = { input: null, output: null, nodes: [] };

	for (const node of nodes) {
		const nodeId = node.id.split('@@')[0] as NodeDefinitionType;

		if (nodeId === 'pipeline-input') {
			pipelineData.input = { subject: 'subject!' };
		} else if (nodeId === 'pipeline-output') {
			pipelineData.output = { joke: 'joke!' };
		}
	}

	let edge = edges.find((edge) => edge.source === 'pipeline-input');
	const outputEdge = edges.find((edge) => edge.target === 'pipeline-output');
	if (!edge || !outputEdge) {
		console.warn(`input and output nodes must be  connected`);
		return;
	}
	do {
		console.log(`***edge`, edge);
		const node = nodes.find((node) => node.id === edge.source);
		console.log(`***node`, node);
		const nodeIO = nodesIO[node.data.id];
		console.log(`***nodeIO`, nodeIO);
		pipelineData.nodes.push({
			...node,
			...nodeIO,
		});
		edge = edges.find((_edge) => _edge.source === edge.target);
	} while (!!edge);
	pipelineData.nodes.push({
		...nodes.find((node) => node.id === 'pipeline-output'),
		...nodesIO['pipeline-output'],
	});

	// for (const edge of edges) {
	// 	const source = edge.source;
	// 	const target = edge.target;
	// 	const sourceNode = nodes.find((node) => node.id === source);
	// 	const targetNode = nodes.find((node) => node.id === target);
	// 	const sourceNodeDefinition = sourceNode.data.label;
	// 	const targetNodeDefinition = targetNode.data.label;

	// 	// TODO: configure nodes according to source/target
	// }

	return pipelineData;
}

export function invokePipeline(pipelineData: PipelineData) {
	const aigur = createClient({
		apiKeys: {
			openai: process.env.OPENAI_KEY!,
		},
	});
	// aigur.pipeline.create<any, any>({
	// 	flow: pipelineData.nodes
	// })
}
