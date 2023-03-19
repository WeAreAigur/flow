import {
	inputSchema as automaticSpeechRecognitionInputSchema,
	name as automaticSpeechRecognition,
	outputSchema as automaticSpeechRecognitionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/automaticSpeechRecognition';

import { createNodeDefinition } from '../createNodeDefinition';

export const automaticSpeechRecognitionNode = createNodeDefinition({
	action: automaticSpeechRecognition,
	inputSchema: automaticSpeechRecognitionInputSchema,
	outputSchema: automaticSpeechRecognitionOutputSchema,
	title: 'Automatic Speech Recognition',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
