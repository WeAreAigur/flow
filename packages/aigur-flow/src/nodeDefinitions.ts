import { NodeDefinitions } from './types';

export const nodeDefinitions: NodeDefinitions = {
	Pipeline: {
		input: {
			title: 'Pipeline Input',
			id: 'input',
			type: 'pipeline-input',
			input: { subject: 'string' },
			output: { subject: 'string' },
		},
		output: {
			title: 'Pipeline Output',
			id: 'output',
			type: 'pipeline-output',
			input: { joke: 'string' },
			output: { joke: 'string' },
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
			},
		},
	},
};
