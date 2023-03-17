import { z, ZodSchema } from 'zod';

import { ZTO_Array, ZTO_Base, ZTO_Enum, ZTO_Object } from './types';

export * from './types';

const zodTypeToType = {
	ZodString: 'string',
	ZodNumber: 'number',
	ZodObject: 'object',
	ZodArray: 'array',
	ZodEnum: 'enum',
	ZodBoolean: 'boolean',
} as const;

function getTypeByZodType(type: keyof typeof zodTypeToType): ZTO_Base['type'] {
	return zodTypeToType[type];
}

export function zodToObj(schema: z.AnyZodObject): ZTO_Base[] {
	const shape = schema._def.shape();
	const result = [];
	for (const key in shape) {
		const field = shape[key];
		const realType = getRealType(field);
		const obj: ZTO_Base = {
			property: key,
			type: getTypeByZodType(realType._def.typeName),
			required: !field.isOptional(),
		};
		if (obj.type === 'object') {
			(obj as ZTO_Object).properties = zodToObj(field);
		}
		if (obj.type === 'array') {
			obj.subType = getTypeByZodType(realType.element._def.typeName);
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

function getRealType(field: any): any {
	if (field._def.typeName === 'ZodUnion') {
		const options: ZodSchema[] = field._def.options;
		const foundString = options.find((x) => (x._def as any).typeName === 'ZodString');
		if (foundString) {
			return foundString;
		}
		return options[0];
	}
	if (field.innerType) {
		return field.innerType();
	}
	if (field.isOptional()) {
		return getRealType(field._def.innerType);
	}
	return field;
}

function getDefaultValue(schema: z.ZodTypeAny): any {
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
