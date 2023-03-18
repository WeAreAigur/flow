export function uploadImage(imageBase64: string) {
	return fetch('/api/uploadtostorage', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			file: imageBase64,
			extension: 'png',
		}),
	}).then((res) => res.json());
}
