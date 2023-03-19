import {
	inputSchema as conversationalInputSchema,
	name as conversational,
	outputSchema as conversationalOutputSchema,
} from '@aigur/client/src/nodes/huggingface/conversational';

import { createNodeDefinition } from '../createNodeDefinition';

export const conversationalNode = createNodeDefinition({
	action: conversational,
	inputSchema: conversationalInputSchema,
	outputSchema: conversationalOutputSchema,
	title: 'Conversational',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
