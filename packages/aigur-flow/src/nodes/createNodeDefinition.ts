import { z } from 'zod';

import { NodeDefinition, NodeDefinitionType, ZodReadableStream } from '../types';

export function createNodeDefinition(opts: {
	action: string;
	inputSchema: z.AnyZodObject;
	outputSchema: z.AnyZodObject | ZodReadableStream;
	title: string;
	type: NodeDefinitionType;
	definitionLabel: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: opts.action,
		definitionLabel: opts.definitionLabel,
		type: opts.type,
		schema: {
			input: opts.inputSchema,
			output: opts.outputSchema,
		},
	};
}
