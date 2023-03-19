import {
	inputSchema as tableQuestionAnswerInputSchema,
	name as tableQuestionAnswer,
	outputSchema as tableQuestionAnswerOutputSchema,
} from '@aigur/client/src/nodes/huggingface/tableQuestionAnswer';

import { createNodeDefinition } from '../createNodeDefinition';

export const tableQuestionAnswerNode = createNodeDefinition({
	action: tableQuestionAnswer,
	inputSchema: tableQuestionAnswerInputSchema,
	outputSchema: tableQuestionAnswerOutputSchema,
	title: 'Table Question Answer',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
