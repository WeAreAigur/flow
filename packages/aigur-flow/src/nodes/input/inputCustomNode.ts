import { z } from 'zod';

import { createIO } from '../createIO';

export const inputCustomNode = createIO({
	type: 'input',
	title: 'Custom Input',
	input: z.object({}),
	subtype: 'custom',
});
