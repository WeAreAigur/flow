import { makeid } from '@aigur/client/src/makeid';

import { NodeDefinitions } from './types';

export const nodeDefinitions: NodeDefinitions = {
	Pipeline: {
		input: {
			title: 'Pipeline Input',
			id: 'input',
			type: 'pipeline-input',
			input: { subject: 'string' },
			output: { subject: 'string' },
			tag: makeid(10),
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
};
