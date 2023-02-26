import { createAblyNotifier } from '@aigur/ably';
import { Pipeline } from '@aigur/client';
import { makeid } from '@aigur/client/src/makeid';

import { FlowPipeline, NodesIO, PipelineData } from './types';

export async function flowToPipelineData(flow: FlowPipeline, nodesIO: NodesIO) {
	const nodes = flow.nodes;
	const edges = flow.edges;
	const pipelineData: PipelineData = {
		id: `pipeline-${makeid(5)}`,
		nodes: [],
		input: nodesIO['input'].input,
	};
	let edge = edges.find((edge) => edge.source === 'input');
	const outputEdge = edges.find((edge) => edge.target === 'output');
	if (!edge || !outputEdge) {
		console.warn(`input and output nodes must be connected`);
		return;
	}
	do {
		const node = nodes.find((node) => node.id === edge.source);
		const nodeIO = nodesIO[node.id];
		if (node.data.id !== 'input') {
			pipelineData.nodes.push({
				...nodeIO,
				id: node.data.tag,
				action: node.data.id,
				memoryToSave: null,
			});
		}
		edge = edges.find((_edge) => _edge.source === edge.target);
	} while (!!edge);
	const outputNode = nodes.find((node) => node.id === 'output');
	pipelineData.nodes.push({
		...nodesIO['output'],
		id: outputNode.data.tag,
		action: 'output',
		memoryToSave: null,
	});

	return pipelineData;
}

export function pipelineDataToPipeline(pipelineData: PipelineData) {
	const flow: any = {
		getNodes: () => pipelineData.nodes,
	};
	const ably = createAblyNotifier('', process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!, 'aigur-flow');
	return new Pipeline<any, any, any>(
		{
			...pipelineData,
			eventListener: ably.eventListener,
			eventPublisher: ably.eventPublisher,
			updateProgress: true,
		} as any,
		flow,
		{}
	);
}

export async function invokePipeline(
	pipeline: Pipeline<any, any, any>,
	pipelineData: PipelineData
) {
	return fetch(`/api/pipelines/${pipelineData.id}`, {
		method: 'POST',
		body: JSON.stringify({
			...pipelineData,
			pipelineInstanceId: (pipeline as any).pipelineInstanceId,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('flowToPipeline', async () => {
		const flow = {
			nodes: [
				{
					width: 240,
					height: 242,
					id: 'input',
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
					id: 'output',
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
					id: 'gpt3Prediction@@0-input',
					source: 'input',
					target: 'gpt3Prediction@@0',
				},
				{
					id: 'output-gpt3Prediction@@0',
					source: 'gpt3Prediction@@0',
					target: 'output',
				},
			],
			viewport: {
				x: 318.75,
				y: 586.75,
				zoom: 0.75,
			},
		};
		const nodesIO = {
			input: {
				input: {
					subject: 'cars',
				},
				output: {},
			},
			'gpt3Prediction@@0': {
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
		const pipelineData = await flowToPipelineData(flow as any, nodesIO);

		expect(pipelineData).toMatchObject({
			id: /pipeline\-\w+/,
			input: { subject: 'cars' },
			nodes: [
				{
					action: 'gpt3Prediction',
					input: {
						prompt: '$context.input.subject$',
					},
					output: {},
					memoryToSave: null,
				},
				{
					action: 'output',
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
