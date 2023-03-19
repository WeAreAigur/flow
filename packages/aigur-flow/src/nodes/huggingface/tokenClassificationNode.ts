import {
	inputSchema as tokenClassificationInputSchema,
	name as tokenClassification,
	outputSchema as tokenClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/tokenClassification';

import { createNodeDefinition } from '../createNodeDefinition';

export const tokenClassificationNode = createNodeDefinition({
	action: tokenClassification,
	inputSchema: tokenClassificationInputSchema,
	outputSchema: tokenClassificationOutputSchema,
	title: 'Token Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
