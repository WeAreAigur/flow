import { Position } from 'reactflow';
import { useEffect } from 'react';

import { Pipeline } from '@aigur/client/src';

import { VoiceRecorder } from './VoiceRecorder';
import { useRecord } from './useRecord';
import { PipelineNode } from '../../PipelineNode';
import { NodeInstance } from '../../../types';
import { useNodesIOStore } from '../../../stores/useNodesIO';

export interface AudioInputNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function AudioInputNode(props: AudioInputNodeProps) {
	const { toggleRecording, isRecording, result: audio } = useRecord();
	const { setNodeIO } = useNodesIOStore((state) => state);

	useEffect(() => {
		if (audio) {
			fetch('/api/audioupload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					audio,
				}),
			})
				.then((res) => res.json())
				.then(({ url }) => setNodeIO(props.id, { input: { audio: url }, output: { audio: url } }));
		}
	}, [audio, props.data.id, props.id, setNodeIO]);

	return (
		<PipelineNode
			id={props.id}
			data={{
				...props.data,
				nodeClassName: 'border-yellow-600 ring-yellow-900',
				handleClassName: '!bg-yellow-400',
				handles: [
					{
						position: Position.Bottom,
						type: 'source',
					},
				],
			}}
		>
			<VoiceRecorder isRecording={isRecording} toggleRecording={toggleRecording} />
		</PipelineNode>
	);
}
