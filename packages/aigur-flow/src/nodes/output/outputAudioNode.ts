import { z } from 'zod';

import { createIO } from '../createIO';

export const outputAudioNode = createIO({
	type: 'output',
	title: 'Audio Output',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});
