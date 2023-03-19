import { z } from 'zod';

import { createIO } from '../createIO';

export const outputCustomNode = createIO({
	type: 'output',
	title: 'Custom Output',
	input: z.object({}),
	subtype: 'custom',
});
