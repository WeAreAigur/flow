import { z } from 'zod';

import { inputSchema as stabilityInputSchema } from '@aigur/client/src/nodes/image/textToImage/stability';

import { createNodeDefinition } from '../createNodeDefinition';

export const stabilityTextToImageNode = createNodeDefinition({
	action: 'stabilityTextToImageAigur',
	inputSchema: stabilityInputSchema,
	outputSchema: z.object({ url: z.string() }),
	title: 'Stability Text to Image',
	definitionLabel: 'Stability',
	type: 'provider',
});
