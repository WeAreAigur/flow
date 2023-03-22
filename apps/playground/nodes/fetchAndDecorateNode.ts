import { z } from 'zod';
import { transformSchema } from 'zod-coercion';

import { nodeNameToPath } from './getNode';

export async function fetchAndDecorateNode(
	nodeName: keyof typeof nodeNameToPath,
	schema: {
		input: z.ZodRawShape;
		output: z.ZodRawShape;
	}
) {
	const nodePath = nodeNameToPath[nodeName];
	const { inputSchema, node } = await import(`@aigur/client/src/nodes/${nodePath}`).then((mod) => ({
		node: mod[nodeName],
		inputSchema: mod.inputSchema,
	}));
	const transformedInputSchema = inputSchema
		? transformSchema(inputSchema)
		: transformSchema(rebuildInputSchema(schema.input));
	return async (input: z.output<typeof inputSchema>, APIKeys: Record<string, string>) => {
		const payload: any = await transformedInputSchema?.parseAsync(input);
		return node(payload ?? input, APIKeys);
	};
}

function rebuildInputSchema(schema: z.ZodRawShape) {
	const input: z.ZodRawShape = {};

	for (const key in schema) {
		const field = schema[key];

		if (field._def.typeName === 'ZodString') {
			const str = (input[key] = z.string());

			if (field._def.checks?.find((c: { kind: string }) => c.kind === 'url')) {
				input[key] = str.url();
			}

			if (field.description === 'base64') {
				input[key] = str.describe('base64');
			}
		}
	}

	return z.object(input);
}
