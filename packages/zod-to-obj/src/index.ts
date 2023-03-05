import { z } from 'zod';

import { ZTO_Array, ZTO_Base, ZTO_Enum, ZTO_Object } from './types';

export * from './types';

const zodTypeToType = {
	ZodString: 'string',
	ZodNumber: 'number',
	ZodObject: 'object',
	ZodArray: 'array',
	ZodEnum: 'enum',
	ZodBoolean: 'boolean',
};

export function zodToObj(schema: z.AnyZodObject): ZTO_Base[] {
	const shape = schema._def.shape();
	const result = [];
	for (const key in shape) {
		const field = shape[key];
		const realType = field.innerType ? field.innerType() : field;
		const obj: ZTO_Base = {
			property: key,
			type: zodTypeToType[realType._def.typeName],
			required: !field.isOptional(),
		};
		if (obj.type === 'object') {
			(obj as ZTO_Object).properties = zodToObj(field);
		}
		if (obj.type === 'array') {
			obj.subType = zodTypeToType[realType.element._def.typeName];
			if (obj.subType === 'object') {
				(obj as ZTO_Object).properties = zodToObj(realType._def.type);
			}
		}
		if (obj.type === 'enum') {
			(obj as ZTO_Enum).possibleValues = realType._def.values;
		}
		const defaultValue = getDefaultValue(field);
		if (defaultValue !== undefined) {
			obj.defaultValue = defaultValue;
		}
		result.push(obj);
	}
	return result;
}

function unwrapSchema(schema: z.ZodTypeAny) {
	if (schema.isOptional()) {
		return unwrapSchema(schema._def.innerType);
	}
	if (schema instanceof z.ZodEffects) {
		return unwrapSchema(schema._def.schema);
	}
	return schema;
}

function getDefaultValue(schema: z.ZodTypeAny) {
	if (schema._def.typeName === 'ZodDefault') {
		const defaultValue = schema._def.defaultValue();
		return defaultValue;
	}
	if (schema._def.typeName === 'ZodOptional') {
		return getDefaultValue(schema._def.innerType);
	}
	return;
}

export const isZTOObject = (obj: ZTO_Base): obj is ZTO_Object => obj.type === 'object';
export const isZTOEnum = (obj: ZTO_Base): obj is ZTO_Enum => obj.type === 'enum';
export const isZTOArray = (obj: ZTO_Base): obj is ZTO_Array => obj.type === 'array';
