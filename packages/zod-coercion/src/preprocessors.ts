import { base64ToBytes, bytesToBase64 } from 'byte-base64';

export const preprocessors = {
	arrayToString: (arg: any) => {
		if (Array.isArray(arg)) {
			return arg.toString();
		}
	},
	numberToString: (arg: any) => {
		if (typeof arg === 'number') {
			return arg.toString();
		}
	},
	arrayBufferToBase64: (arg: any) => {
		if (arg instanceof ArrayBuffer) {
			return bytesToBase64(new Uint8Array(arg));
		}
	},
	urlToBase64: async (arg: any) => {
		if (isUrl(arg)) {
			return toDataURL(arg);
		}
	},
	base64ToArrayBuffer: (arg: any) => {
		if (isBase64(arg)) {
			return base64ToBytes(arg);
			// const typedArray = Uint8Array.from(atob(arg), (c) => c.charCodeAt(0));
			// return typedArray.buffer;
		}
	},
	urlToArrayBuffer: async (arg: any) => {
		if (isUrl(arg)) {
			return fetch(arg).then((response) => response.arrayBuffer());
		}
	},
	base64ToUrl: async (arg: any) => {
		if (isBase64(arg)) {
			// TODO: use file-type to get extension
			// https://www.npmjs.com/package/file-type
			return fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/uploadtostorage`, {
				method: 'POST',
				body: JSON.stringify({ file: arg, extension: 'png' }),
			})
				.then((response) => response.json())
				.then((data) => {
					return data.url;
				})
				.catch((e) => {
					console.log(`***error! e`, e);
					return '';
				});
		}
	},
	arrayBufferToUrl: async (arg: any) => {
		if (arg instanceof ArrayBuffer) {
			return preprocessors.base64ToUrl(preprocessors.arrayBufferToBase64(arg));
		}
	},
} as const;

function isBase64(str: string) {
	try {
		return btoa(atob(str)) === str;
	} catch (err) {
		return false;
	}
}
function isUrl(str: string) {
	try {
		new URL(str);
		return true;
	} catch (_) {
		return false;
	}
}

function toDataURL(url: string) {
	return fetch(url)
		.then((response) => response.arrayBuffer())
		.then(preprocessors.arrayBufferToBase64);
}
