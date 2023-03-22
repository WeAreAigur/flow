import { z } from 'zod';

import { a } from './a';

const zodToAigur = {
	ZodString: a.string,
	base64: a.base64,
	url: a.url,
	ArrayBuffer: a.arrayBuffer,
} as const;

const transformerKeys = Object.keys(zodToAigur);

export function transformSchema(schema: z.AnyZodObject) {
	const objectShape = schema.shape;
	const newSchema: Record<string, any> = {};
	for (const property in objectShape) {
		newSchema[property] = objectShape[property];

		if (objectShape[property]._def.typeName === 'ZodObject') {
			newSchema[property] = transformSchema(objectShape[property]);
			continue;
		}

		if (objectShape[property]._def.typeName === 'ZodArray') {
			newSchema[property] = z.array(transformSchema(objectShape[property]._def.type));
			continue;
		}

		const description = objectShape[property].description;
		const transformableCheck = objectShape[property]._def.checks?.find((check: { kind: string }) =>
			transformerKeys.includes(check.kind)
		);
		const transformableDescription = transformerKeys.find((key) => key === description);
		const typeName = objectShape[property]._def.typeName;

		const transformerName: keyof typeof zodToAigur =
			transformableCheck?.kind ?? transformableDescription ?? typeName;

		if (transformerName in zodToAigur) {
			const transformer = zodToAigur[transformerName];
			newSchema[property] = transformer();
		}
	}

	return z.object(newSchema);
}
