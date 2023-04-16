import Image from 'next/image';

import { PlayAudio } from '../pipelineNodeTypes/OutputNodes/AudioOutputNode/PlayAudio';

export interface OutputPanelProps {
	output: Record<string, any> | null;
}

export function OutputPanel(props: OutputPanelProps) {
	function getTypedOutputPanel() {
		if (props.output === null) {
			return null;
		}
		console.log(`***props.output`, props.output);
		if (props.output.text) {
			return <TextOutputPanel output={props.output} />;
		}
		if (props.output.audio) {
			return <AudioOutputPanel audioUrl={props.output.audio} />;
		}
		if (props.output.imageUrl) {
			return <ImageOutputPanel imageUrl={props.output.imageUrl} />;
		}
	}

	return (
		<div className="flex flex-col space-y-2">
			<div className="text-xl">Output</div>
			{getTypedOutputPanel()}
		</div>
	);
}

function TextOutputPanel(props: OutputPanelProps) {
	return (
		<textarea
			className="w-full h-24 textarea textarea-bordered"
			name="text"
			value={props.output ? props.output['text'] : ''}
		/>
	);
}

interface AudioOutputPanelProps {
	audioUrl: string;
}

function AudioOutputPanel(props: AudioOutputPanelProps) {
	return <PlayAudio audioUrl={props.audioUrl} inProgress={false} />;
}

interface ImageOutputPanelProps {
	imageUrl: string;
}

function ImageOutputPanel(props: ImageOutputPanelProps) {
	return <Image src={props.imageUrl} width={128} height={128} alt="" />;
}
