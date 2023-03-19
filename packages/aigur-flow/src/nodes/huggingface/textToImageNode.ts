import {
	inputSchema as textToImageInputSchema,
	name as textToImage,
	outputSchema as textToImageOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textToImage';

import { createNodeDefinition } from '../createNodeDefinition';

export const textToImageNode = createNodeDefinition({
	action: textToImage,
	inputSchema: textToImageInputSchema,
	outputSchema: textToImageOutputSchema,
	title: 'Text to Image',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
