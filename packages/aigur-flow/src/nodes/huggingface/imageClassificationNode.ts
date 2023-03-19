import {
	inputSchema as imageClassificationInputSchema,
	name as imageClassification,
	outputSchema as imageClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/imageClassification';

import { createNodeDefinition } from '../createNodeDefinition';

export const imageClassificationNode = createNodeDefinition({
	action: imageClassification,
	inputSchema: imageClassificationInputSchema,
	outputSchema: imageClassificationOutputSchema,
	title: 'Image Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
