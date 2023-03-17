import { expect, test } from 'vitest';
import { z } from 'zod';

import { zodToObj } from '../src';

test('simple object', () => {
	const schema = z.object({
		name: z.string(),
		age: z.number(),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'age',
			type: 'number',
			required: true,
		},
	]);
});

test('optional property', () => {
	const schema = z.object({
		// name: z.string(),
		age: z.number().optional(),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		// {
		// 	property: 'name',
		// 	type: 'string',
		// 	required: true,
		// },
		{
			property: 'age',
			type: 'number',
			required: false,
		},
	]);
});

test('default value', () => {
	const schema = z.object({
		name: z.string(),
		age: z.number().default(1),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'age',
			type: 'number',
			required: false,
			defaultValue: 1,
		},
	]);
});

test('nested object', () => {
	const schema = z.object({
		name: z.string(),
		address: z.object({
			city: z.string(),
			country: z.string().optional(),
		}),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'address',
			type: 'object',
			required: true,
			properties: [
				{
					property: 'city',
					type: 'string',
					required: true,
				},
				{
					property: 'country',
					type: 'string',
					required: false,
				},
			],
		},
	]);
});

test('simple array', () => {
	const schema = z.object({
		name: z.string(),
		luckyNumbers: z.array(z.number()),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'luckyNumbers',
			type: 'array',
			subType: 'number',
			required: true,
		},
	]);
});

test('complex array', () => {
	const schema = z.object({
		name: z.string(),
		luckyNumbers: z
			.array(
				z.object({
					number: z.number(),
					color: z.string().optional().default('red'),
				})
			)
			.optional(),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'luckyNumbers',
			type: 'array',
			subType: 'object',
			required: false,
			properties: [
				{
					property: 'number',
					type: 'number',
					required: true,
				},
				{
					property: 'color',
					type: 'string',
					required: false,
					defaultValue: 'red',
				},
			],
		},
	]);
});

test('enum or string', () => {
	const schema = z.object({
		name: z.enum(['bla', 'doot']).or(z.string()),
		name2: z.enum(['bla', 'doot']).or(z.string()).optional(),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'name',
			type: 'string',
			required: true,
		},
		{
			property: 'name2',
			type: 'string',
			required: false,
		},
	]);
});

test('optional subobject', () => {
	const schema = z.object({
		options: z
			.object({
				name: z.string(),
			})
			.optional(),
	});
	const result = zodToObj(schema);
	expect(result).toStrictEqual([
		{
			property: 'options',
			type: 'object',
			required: false,
			properties: [
				{
					property: 'name',
					type: 'string',
					required: true,
				},
			],
		},
	]);
});
