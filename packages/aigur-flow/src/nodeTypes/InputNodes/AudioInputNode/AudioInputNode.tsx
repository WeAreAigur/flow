import { Position } from 'reactflow';
import { useEffect } from 'react';

import { VoiceRecorder } from './VoiceRecorder';
import { useRecord } from './useRecord';
import { PipelineNode } from '../../PipelineNode';
import { NodeDefinition } from '../../../types';
import { useNodesIOStore } from '../../../stores/useNodesIO';

import type { Pipeline } from '@aigur/client';
export interface AudioInputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function AudioInputNode(props: AudioInputNodeProps) {
	const { toggleRecording, isRecording, result: audio } = useRecord();
	const { setNodeIO } = useNodesIOStore((state) => state);

	useEffect(() => {
		if (audio) {
			setNodeIO(props.data.id, { input: { audio }, output: { audio } });
		}
	}, [audio, props.data.id, setNodeIO]);

	return (
		<PipelineNode
			id={props.id}
			data={{
				...props.data,
				nodeClassName: 'border-yellow-600 ring-yellow-900',
				handleClassName: '!bg-yellow-400',
				handles: [
					{
						position: Position.Right,
						type: 'source',
					},
				],
			}}
		>
			<VoiceRecorder isRecording={isRecording} toggleRecording={toggleRecording} />
		</PipelineNode>
	);
}
