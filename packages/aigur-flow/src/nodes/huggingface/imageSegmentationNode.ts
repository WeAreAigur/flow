import {
	inputSchema as imageSegmentationInputSchema,
	name as imageSegmentation,
	outputSchema as imageSegmentationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/imageSegmentation';

import { createNodeDefinition } from '../createNodeDefinition';

export const imageSegmentationNode = createNodeDefinition({
	action: imageSegmentation,
	inputSchema: imageSegmentationInputSchema,
	outputSchema: imageSegmentationOutputSchema,
	title: 'Image Segmentation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
