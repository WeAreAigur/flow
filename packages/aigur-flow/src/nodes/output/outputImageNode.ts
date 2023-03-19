import { z } from 'zod';

import { createIO } from '../createIO';

export const outputImageNode = createIO({
	type: 'output',
	title: 'Image Output',
	input: z.object({ imageUrl: z.string() }),
	subtype: 'image',
});
