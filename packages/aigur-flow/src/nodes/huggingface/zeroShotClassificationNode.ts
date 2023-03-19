import {
	inputSchema as zeroShotClassificationInputSchema,
	name as zeroShotClassification,
	outputSchema as zeroShotClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/zeroShotClassification';

import { createNodeDefinition } from '../createNodeDefinition';

export const zeroShotClassificationNode = createNodeDefinition({
	action: zeroShotClassification,
	inputSchema: zeroShotClassificationInputSchema,
	outputSchema: zeroShotClassificationOutputSchema,
	title: 'Zero Shot Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
