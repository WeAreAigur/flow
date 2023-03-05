import { z } from 'zod';

import {
	googleImageLabeling,
	inputSchema as googleImageInputSchema,
	outputSchema as googleImageOutputSchema,
} from '@aigur/client/src/nodes/image/labeling/googleImageLabeling';
import { inputSchema as stabilityInputSchema } from '@aigur/client/src/nodes/image/textToImage/stability';
import {
	gpt3Prediction,
	outputSchema as gpt3OutputSchema,
	rawInputSchema as gpt3InputSchema,
} from '@aigur/client/src/nodes/text/prediction/gpt3';
import {
	inputSchema as whisperInputSchema,
	outputSchema as whisperOutputSchema,
	whisperApi,
} from '@aigur/client/src/nodes/voice/transcribe/whisper/whisperapi';
import { APIKeys } from '@aigur/client/src/types';

import { NodeDefinition, NodeDefinitionType, ZodReadableStream } from './types';
import { upperFirst } from './utils/stringUtils';

export const inputCustomNode = createIO({
	type: 'input',
	title: 'Custom Input',
	input: z.object({}),
	subtype: 'custom',
});

export const inputTextNode = createIO({
	type: 'input',
	title: 'Text Input',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});

export const inputAudioNode = createIO({
	type: 'input',
	title: 'Audio Input',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});

export const outputCustomNode = createIO({
	type: 'output',
	title: 'Custom Output',
	input: z.object({}),
	subtype: 'custom',
});

export const outputTextNode = createIO({
	type: 'output',
	title: 'Text Output',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});

export const outputAudioNode = createIO({
	type: 'output',
	title: 'Audio Output',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});

export const outputImageNode = createIO({
	type: 'output',
	title: 'Image Output',
	input: z.object({ imageUrl: z.string() }),
	subtype: 'image',
});

export const gpt3PredictionNode = createNodeDefinition({
	action: gpt3Prediction,
	inputSchema: gpt3InputSchema,
	outputSchema: gpt3OutputSchema,
	title: 'GPT-3 Prediction',
	definitionLabel: 'GPT-3',
	type: 'provider',
});

export const whisperApiNode = createNodeDefinition({
	action: whisperApi,
	inputSchema: whisperInputSchema,
	outputSchema: whisperOutputSchema,
	title: 'Whisper',
	definitionLabel: 'Whisper',
	type: 'provider',
});

export const googleImageLabelingNode = createNodeDefinition({
	action: googleImageLabeling,
	inputSchema: googleImageInputSchema,
	outputSchema: googleImageOutputSchema,
	title: 'Google Image Labeling',
	definitionLabel: 'Google',
	type: 'provider',
});

export const stabilityTextToImageNode = createNodeDefinition({
	action: async function stabilityTextToImageAigur(input: any, APIKeys: any) {
		return true;
	},
	inputSchema: stabilityInputSchema,
	outputSchema: z.object({ url: z.string() }),
	title: 'Stability Text to Image',
	definitionLabel: 'Stability',
	type: 'provider',
});

export const nodeRepository = {
	/// input
	inputCustom: inputCustomNode,
	inputText: inputTextNode,
	inputAudio: inputAudioNode,
	/// output
	outputCustom: outputCustomNode,
	outputText: outputTextNode,
	outputAudio: outputAudioNode,
	outputImage: outputImageNode,
	/// nodes
	gpt3Prediction: gpt3PredictionNode,
	whisperApi: whisperApiNode,
	googleImageLabeling: googleImageLabelingNode,
	stabilityTextToImageAigur: stabilityTextToImageNode,
} as const satisfies Record<string, NodeDefinition>;

function createNodeDefinition(opts: {
	action: (input: any, apiKeys: APIKeys) => Promise<any>;
	inputSchema: z.AnyZodObject;
	outputSchema: z.AnyZodObject | ZodReadableStream;
	title: string;
	type: NodeDefinitionType;
	definitionLabel: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: opts.action.name,
		definitionLabel: opts.definitionLabel,
		type: opts.type,
		schema: {
			input: opts.inputSchema,
			output: opts.outputSchema,
		},
	};
}

function createIO(opts: {
	title: string;
	type: 'input' | 'output';
	input: z.AnyZodObject;
	subtype?: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: `${opts.type}${upperFirst(opts.subtype)}`,
		type: `pipeline-${opts.type}`,
		subtype: opts.subtype,
		schema: {
			input: opts.input,
			output: opts.input,
		},
	};
}
