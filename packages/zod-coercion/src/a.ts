import { z } from 'zod';

import { preprocessors } from './preprocessors';

// a as in Aigur like z as in zod

export const a = {
	string: () =>
		z.preprocess(preprocess(preprocessors.arrayToString, preprocessors.numberToString), z.string()),
	base64: () =>
		z.preprocess(
			preprocess(preprocessors.arrayBufferToBase64, preprocessors.urlToBase64),
			z.string()
		),
	url: () =>
		z.preprocess(
			preprocess(preprocessors.base64ToUrl, preprocessors.arrayBufferToUrl),
			z.string().url()
		),
	arrayBuffer: () =>
		z.preprocess(
			preprocess(preprocessors.base64ToArrayBuffer, preprocessors.urlToArrayBuffer),
			z.instanceof(ArrayBuffer)
		),
};

type ValueOf<T> = T[keyof T];

function preprocess(...processors: ValueOf<typeof preprocessors>[]) {
	return async (arg: any) => {
		for (let processor of processors) {
			const result = await processor(arg);
			if (result) {
				return result;
			}
		}
		return arg;
	};
}
