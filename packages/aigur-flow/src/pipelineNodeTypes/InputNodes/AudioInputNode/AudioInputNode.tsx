import { useEffect } from 'react';
import { Position } from 'reactflow';

import { Pipeline } from '@aigur/client/src';

import { useNodesIOStore } from '../../../stores/useNodesIO';
import { NodeDefinition } from '../../../types';
import { PipelineNode } from '../../PipelineNode';
import { useRecord } from './useRecord';
import { VoiceRecorder } from './VoiceRecorder';

export interface AudioInputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
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
