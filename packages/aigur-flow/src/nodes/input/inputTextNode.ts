import { z } from 'zod';

import { createIO } from '../createIO';

export const inputTextNode = createIO({
	type: 'input',
	title: 'Text Input',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});
