import {
	inputSchema as translationInputSchema,
	name as translation,
	outputSchema as translationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/translation';

import { createNodeDefinition } from '../createNodeDefinition';

/// hugging face

export const translationNode = createNodeDefinition({
	action: translation,
	inputSchema: translationInputSchema,
	outputSchema: translationOutputSchema,
	title: 'Translation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
