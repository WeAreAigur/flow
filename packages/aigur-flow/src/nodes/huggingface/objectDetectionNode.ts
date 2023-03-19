import {
	inputSchema as objectDetectionInputSchema,
	name as objectDetection,
	outputSchema as objectDetectionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/objectDetection';

import { createNodeDefinition } from '../createNodeDefinition';

export const objectDetectionNode = createNodeDefinition({
	action: objectDetection,
	inputSchema: objectDetectionInputSchema,
	outputSchema: objectDetectionOutputSchema,
	title: 'Object Detection',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
