import { z } from 'zod';

import { createIO } from '../createIO';

export const outputTextNode = createIO({
	type: 'output',
	title: 'Text Output',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});
