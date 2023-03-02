import { z } from 'zod';

import { APIKeys } from '@aigur/client/src/types';
import {
    inputSchema as whisperInputSchema, outputSchema as whisperOutputSchema, whisperApi
} from '@aigur/client/src/nodes/voice/transcribe/whisper/whisperapi';
import {
    gpt3Prediction, outputSchema as gpt3OutputSchema, rawInputSchema as gpt3InputSchema
} from '@aigur/client/src/nodes/text/prediction/gpt3';
import { makeid } from '@aigur/client/src/makeid';

import { NodeDefinition, NodeDefinitions, NodeDefinitionType, ZodReadableStream } from './types';

const createInput = ({
	title,
	input,
	subtype,
}: {
	title: string;
	input: z.AnyZodObject | z.ZodEffects<any, any>;
	subtype?: string;
}) => ({
	title,
	id: 'input',
	type: 'pipeline-input',
	subtype,
	input,
	output: input,
	tag: makeid(10),
});

export const nodeDefinitions: NodeDefinitions = {
	Pipeline: {
		Input: {
			inputCustom: createInput({
				title: 'Custom Input',
				input: z.object({}),
			}),
			inputText: createInput({
				title: 'Text Input',
				input: z.object({ text: z.string() }),
				subtype: 'text',
			}),
			inputAudio: createInput({
				title: 'Audio Input',
				input: z.object({ audio: z.string() }),
				subtype: 'audio',
			}),
		},
		output: {
			title: 'Pipeline Output',
			id: 'output',
			type: 'pipeline-output',
			input: z.object({ joke: z.string() }),
			output: z.object({ joke: z.string() }),
			tag: makeid(10),
		},
	},
	Text: {
		Prediction: {
			// gpt3: {
			// 	title: 'GPT-3 Prediction',
			// 	id: 'gpt3Prediction',
			// 	type: 'provider',
			// 	definitionLabel: 'GPT-3',
			// 	input: { prompt: 'string' },
			// 	output: { text: 'string' },
			// 	tag: makeid(10),
			// },
			gpt3: createNodeDefinition({
				action: gpt3Prediction,
				inputSchema: gpt3InputSchema,
				outputSchema: gpt3OutputSchema,
				title: 'GPT-3 Prediction',
				definitionLabel: 'GPT-3',
				type: 'provider',
			}),
		},
	},
	Voice: {
		Transcription: {
			whisperApi: createNodeDefinition({
				action: whisperApi,
				inputSchema: whisperInputSchema,
				outputSchema: whisperOutputSchema,
				title: 'Whisper.com API',
				definitionLabel: 'Whisper',
				type: 'provider',
			}),
		},
	},
};

function createNodeDefinition(opts: {
	action: (input: any, apiKeys: APIKeys) => Promise<any>;
	inputSchema: z.AnyZodObject | z.ZodEffects<any, any>;
	outputSchema: z.AnyZodObject | ZodReadableStream;
	title: string;
	type: NodeDefinitionType;
	definitionLabel: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: opts.action.name,
		input: opts.inputSchema,
		output: opts.outputSchema,
		definitionLabel: opts.definitionLabel,
		type: opts.type,
		tag: makeid(10),
	};
}
