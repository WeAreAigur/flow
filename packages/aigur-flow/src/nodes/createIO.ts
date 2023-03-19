import { z } from 'zod';

import { NodeDefinition } from '../types';
import { upperFirst } from '../utils/stringUtils';

export function createIO(opts: {
	title: string;
	type: 'input' | 'output';
	input: z.AnyZodObject;
	subtype?: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: `${opts.type}${upperFirst(opts.subtype ?? '')}`,
		type: `pipeline-${opts.type}`,
		subtype: opts.subtype,
		schema: {
			input: opts.input,
			output: opts.input,
		},
	};
}
