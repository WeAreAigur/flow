import { createClient, Pipeline } from '@aigur/client/src';

import { FlowPipeline, NodesIO, PipelineData } from './types';

export async function flowToPipeline(flow: FlowPipeline, nodesIO: NodesIO) {
	console.log(`***flow`, flow);
	const nodes = flow.nodes;
	const edges = flow.edges;
	const pipelineData: PipelineData = { nodes: [] };

	let edge = edges.find((edge) => edge.source === 'pipeline-input');
	const outputEdge = edges.find((edge) => edge.target === 'pipeline-output');
	if (!edge || !outputEdge) {
		console.warn(`input and output nodes must be connected`);
		return;
	}
	do {
		const node = nodes.find((node) => node.id === edge.source);
		const nodeIO = nodesIO[node.data.id];
		if (node.data.id !== 'input') {
			pipelineData.nodes.push({
				...nodeIO,
				action: await getAction(node.data.id),
				memoryToSave: null,
			});
		}
		edge = edges.find((_edge) => _edge.source === edge.target);
	} while (!!edge);
	pipelineData.nodes.push({
		...nodesIO['output'],
		action: await getAction('output'),
		memoryToSave: null,
	});

	return pipelineData;
}

export async function invokePipeline(pipe: PipelineData) {
	// const pipeline = createClient({
	// 	apiKeys: {
	// 		openai: process.env.OPENAI_KEY!,
	// 	},
	// }).pipeline.create<any, any>(pipe as any);
	const flow: any = {
		getNodes: () => pipe.nodes,
	};
	const pipeline = new Pipeline<any, any, any>(pipe as any, flow, {
		openai: process.env.NEXT_PUBLIC_OPENAI_KEY!,
	});

	// console.log(`***pipe.nodes`, pipe.nodes);

	const res = await pipeline.invoke({ subject: 'tell me a joke about computers' });
	console.log(`***res`, res);
}

async function getAction(nodeId: string) {
	return import('@aigur/client').then((mod) => mod[nodeId]);
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('flowToPipeline', async () => {
		const flow = {
			nodes: [
				{
					width: 240,
					height: 242,
					id: 'pipeline-input',
					type: 'pipeline-input',
					position: {
						x: 0,
						y: 0,
					},
					data: {
						title: 'Pipeline Input',
						id: 'input',
						type: 'pipeline-input',
						input: {
							subject: 'string',
						},
						output: {
							subject: 'string',
						},
					},
					positionAbsolute: {
						x: 0,
						y: 0,
					},
				},
				{
					width: 240,
					height: 242,
					id: 'pipeline-output',
					type: 'pipeline-output',
					position: {
						x: 742,
						y: -10.666666666666657,
					},
					data: {
						title: 'Pipeline Output',
						id: 'output',
						type: 'pipeline-output',
						input: {
							joke: 'string',
						},
						output: {
							joke: 'string',
						},
					},
					selected: true,
					positionAbsolute: {
						x: 742,
						y: -10.666666666666657,
					},
					dragging: false,
				},
				{
					width: 240,
					height: 258,
					id: 'gpt3Prediction@@0',
					type: 'provider',
					position: {
						x: 363.3124999999999,
						y: -42.333333333333314,
					},
					data: {
						title: 'GPT-3 Prediction',
						id: 'gpt3Prediction',
						type: 'provider',
						definitionLabel: 'GPT-3',
						input: {
							prompt: 'string',
						},
						output: {
							text: 'string',
						},
					},
					selected: false,
					positionAbsolute: {
						x: 363.3124999999999,
						y: -42.333333333333314,
					},
					dragging: false,
				},
			],
			edges: [
				{
					id: 'gpt3Prediction@@0-pipeline-input',
					source: 'pipeline-input',
					target: 'gpt3Prediction@@0',
				},
				{
					id: 'pipeline-output-gpt3Prediction@@0',
					source: 'gpt3Prediction@@0',
					target: 'pipeline-output',
				},
			],
			viewport: {
				x: 318.75,
				y: 586.75,
				zoom: 0.75,
			},
		};
		const nodesIO = {
			gpt3Prediction: {
				input: {
					prompt: '$context.input.subject$',
				},
				output: {},
			},
			output: {
				input: {
					joke: '$context.0.text$',
				},
				output: {},
			},
		};
		const pipelineData = await flowToPipeline(flow as any, nodesIO);
		const { gpt3Prediction, output } = await import('@aigur/client').then(
			({ gpt3Prediction, output }) => ({ gpt3Prediction, output })
		);
		const p = createClient({ apiKeys: {} }).pipeline.create<any, any, any>({
			id: '',
			flow: (flow) =>
				flow
					.node(gpt3Prediction, ({ input }) => ({ prompt: input.subject }))
					.output(output, ({ input }) => ({ joke: input.text })),
		});

		expect(pipelineData).toStrictEqual({
			nodes: [
				{
					action: gpt3Prediction,
					input: {
						prompt: '$context.input.subject$',
					},
					output: {},
					memoryToSave: null,
				},
				{
					action: output,
					input: {
						joke: '$context.0.text$',
					},
					output: {},
					memoryToSave: null,
				},
			],
		});
	});
}
