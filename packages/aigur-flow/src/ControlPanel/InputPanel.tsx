import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useNodesIOStore } from '../stores/useNodesIO';
import { ImageUpload } from '../pipelineNodeTypes/InputNodes/ImageInputNode/ImageUpload';
import { VoiceRecorder } from '../pipelineNodeTypes/InputNodes/AudioInputNode/VoiceRecorder';
import { useRecord } from '../pipelineNodeTypes/InputNodes/AudioInputNode/useRecord';

export interface InputPanelProps {
	inputKeyName?: string;
}

export function InputPanel(props: InputPanelProps) {
	const { io: nodesIO, setNodeIO } = useNodesIOStore((state) => state);

	function getTypedInputPanel() {
		if (!props.inputKeyName) {
			return null;
		}
		const node = nodesIO[props.inputKeyName];

		console.log(`***node`, node);

		if (node.subType === 'text') {
			return (
				<TextInputPanel
					value={node.input.text}
					onChange={(text) =>
						setNodeIO(props.inputKeyName!, {
							input: { text },
							output: { text },
						})
					}
				/>
			);
		}
		if (node.subType === 'image') {
			return (
				<ImageInputPanel
					value={node.input.image}
					onChange={(image) =>
						setNodeIO(props.inputKeyName!, {
							input: { image },
							output: { image },
						})
					}
				/>
			);
		}

		if (node.subType === 'audio') {
			return (
				<AudioInputPanel
					value={node.input.audio}
					onChange={(audio) =>
						setNodeIO(props.inputKeyName!, {
							input: { audio },
							output: { audio },
						})
					}
				/>
			);
		}
	}

	return (
		<div className="flex flex-col space-y-2">
			<div className="text-xl">Input</div>
			{getTypedInputPanel()}
		</div>
	);
}

interface TextInputPanelProps {
	value: string;
	onChange: (text: string) => void;
}

function TextInputPanel(props: TextInputPanelProps) {
	return (
		<textarea
			className="w-full h-24 textarea textarea-bordered"
			name="text"
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
		/>
	);
}

interface ImageInputPanelProps {
	value: string;
	onChange: (image: string) => void;
}

function ImageInputPanel(props: ImageInputPanelProps) {
	const [image, setImage] = useState<string | null>(null);
	const saveImage = (image: string) => {
		setImage(image);
		props.onChange(image);
	};

	return (
		<>
			<ImageUpload onSelect={saveImage} />
			{image ? <Image src={image} width={128} height={128} alt="Uploaded Image" /> : null}
		</>
	);
}

interface AudioInputPanelProps {
	value: string;
	onChange: (audioUrl: string) => void;
}

function AudioInputPanel(props: AudioInputPanelProps) {
	const { toggleRecording, isRecording, result: audio } = useRecord();
	const saveImage = (image: string) => {
		props.onChange(image);
	};
	useEffect(() => {
		if (audio) {
			fetch('/api/uploadtostorage', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					file: audio,
					extension: 'mp3',
				}),
			})
				.then((res) => res.json())
				.then(({ url }) => props.onChange(url));
		}
	}, [audio]);

	return <VoiceRecorder isRecording={isRecording} toggleRecording={toggleRecording} />;
}
