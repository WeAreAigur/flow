import {
	inputSchema as textClassificationInputSchema,
	name as textClassification,
	outputSchema as textClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textClassification';

import { createNodeDefinition } from '../createNodeDefinition';

export const textClassificationNode = createNodeDefinition({
	action: textClassification,
	inputSchema: textClassificationInputSchema,
	outputSchema: textClassificationOutputSchema,
	title: 'Text Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
