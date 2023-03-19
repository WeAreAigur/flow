import { z } from 'zod';

import { createIO } from '../createIO';

export const inputImageNode = createIO({
	type: 'input',
	title: 'Image Input',
	input: z.object({ image: z.string() }),
	subtype: 'image',
});
