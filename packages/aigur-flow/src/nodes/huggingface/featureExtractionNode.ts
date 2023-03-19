import {
	inputSchema as featureExtractionInputSchema,
	name as featureExtraction,
	outputSchema as featureExtractionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/featureExtraction';

import { createNodeDefinition } from '../createNodeDefinition';

export const featureExtractionNode = createNodeDefinition({
	action: featureExtraction,
	inputSchema: featureExtractionInputSchema,
	outputSchema: featureExtractionOutputSchema,
	title: 'Feature Extraction',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
