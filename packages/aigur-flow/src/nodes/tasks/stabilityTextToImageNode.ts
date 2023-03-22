import { inputSchema, outputSchema } from '@aigur/client/src/nodes/image/textToImage/stability';

import { createNodeDefinition } from '../createNodeDefinition';

export const stabilityTextToImageNode = createNodeDefinition({
	action: 'stabilityTextToImage',
	inputSchema,
	outputSchema,
	title: 'Stability Text to Image',
	definitionLabel: 'Stability',
	type: 'provider',
});
