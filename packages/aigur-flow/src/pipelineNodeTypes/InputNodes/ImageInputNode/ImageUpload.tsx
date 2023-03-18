import Compressor from 'compressorjs';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadImage } from './uploadImage';

export interface ImageUploadProps {
	onSelect: (url: string) => void;
}

export function ImageUpload(props: ImageUploadProps) {
	const onDrop = useCallback(
		(files: File[]) => {
			const file = files[0];
			new Compressor(file, {
				width: 512,
				maxWidth: 512,
				maxHeight: 512,
				quality: 0.5,
				success: (result) => {
					const reader = new FileReader();
					reader.readAsDataURL(result);
					reader.onloadend = async () => {
						const base64 = (reader.result as string).split('base64,')[1];
						const { url } = await uploadImage(base64);
						props.onSelect(url);
					};
				},
			});
		},
		[props]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p>Drop the files here ...</p>
			) : (
				<p>Drop some files here, or click to select files</p>
			)}
		</div>
	);
}
