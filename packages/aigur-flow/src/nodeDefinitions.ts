import { makeid } from '@aigur/client/src/makeid';

import { NodeDefinitions } from './types';

const createInput = ({
	title,
	input,
	subtype,
}: {
	title: string;
	input: Record<string, string>;
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
				input: { subject: 'string' },
			}),
			inputText: createInput({
				title: 'Text Input',
				input: { text: 'string' },
				subtype: 'text',
			}),
			inputAudio: createInput({
				title: 'Audio Input',
				input: { audio: 'string' },
				subtype: 'audio',
			}),
		},
		output: {
			title: 'Pipeline Output',
			id: 'output',
			type: 'pipeline-output',
			input: { joke: 'string' },
			output: { joke: 'string' },
			tag: makeid(10),
		},
	},
	Text: {
		Prediction: {
			gpt3: {
				title: 'GPT-3 Prediction',
				id: 'gpt3Prediction',
				type: 'provider',
				definitionLabel: 'GPT-3',
				input: { prompt: 'string' },
				output: { text: 'string' },
				tag: makeid(10),
			},
		},
	},
	Voice: {
		Transcription: {
			whisperApi: {
				title: 'Whisper.com API',
				id: 'whisperApi',
				type: 'provider',
				definitionLabel: 'Whisper',
				input: { audioUrl: 'string' },
				output: { text: 'string' },
				tag: makeid(10),
			},
		},
	},
};
