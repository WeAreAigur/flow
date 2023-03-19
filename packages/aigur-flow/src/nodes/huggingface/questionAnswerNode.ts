import {
	inputSchema as questionAnswerInputSchema,
	name as questionAnswer,
	outputSchema as questionAnswerOutputSchema,
} from '@aigur/client/src/nodes/huggingface/questionAnswer';

import { createNodeDefinition } from '../createNodeDefinition';

export const questionAnswerNode = createNodeDefinition({
	action: questionAnswer,
	inputSchema: questionAnswerInputSchema,
	outputSchema: questionAnswerOutputSchema,
	title: 'Question Answer',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
