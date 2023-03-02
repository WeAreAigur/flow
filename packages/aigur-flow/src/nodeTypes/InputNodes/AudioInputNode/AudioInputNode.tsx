import { Position } from 'reactflow';
import { useEffect } from 'react';

import { supabaseUpload } from '@aigur/supabase';
import { makeid } from '@aigur/client/src/makeid';
import { Pipeline, stringToArrayBuffer } from '@aigur/client';

import { VoiceRecorder } from './VoiceRecorder';
import { useRecord } from './useRecord';
import { PipelineNode } from '../../PipelineNode';
import { NodeDefinition } from '../../../types';
import { useNodesIOStore } from '../../../stores/useNodesIO';

export interface AudioInputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function AudioInputNode(props: AudioInputNodeProps) {
	const { toggleRecording, isRecording, result: audio } = useRecord();
	const { setNodeIO } = useNodesIOStore((state) => state);

	useEffect(() => {
		if (audio) {
			stringToArrayBuffer({ string: audio })
				.then(({ arrayBuffer }) =>
					supabaseUpload({
						bucket: 'flow',
						file: arrayBuffer,
						name: makeid(10),
						extension: 'mp3',
						supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
						supabaseServiceKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
					})
				)
				.then(({ url }) =>
					setNodeIO(props.data.id, { input: { audio: url }, output: { audio: url } })
				);
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
