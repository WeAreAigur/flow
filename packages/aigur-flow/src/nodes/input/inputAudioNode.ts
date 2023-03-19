import { z } from 'zod';

import { createIO } from '../createIO';

export const inputAudioNode = createIO({
	type: 'input',
	title: 'Audio Input',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});
