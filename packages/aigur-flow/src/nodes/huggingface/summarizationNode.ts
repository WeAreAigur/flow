import {
	inputSchema as summarizationInputSchema,
	name as summarization,
	outputSchema as summarizationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/summarization';

import { createNodeDefinition } from '../createNodeDefinition';

export const summarizationNode = createNodeDefinition({
	action: summarization,
	inputSchema: summarizationInputSchema,
	outputSchema: summarizationOutputSchema,
	title: 'Summarization',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
