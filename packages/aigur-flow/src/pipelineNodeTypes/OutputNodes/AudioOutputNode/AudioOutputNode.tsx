import { Position } from 'reactflow';
import { useEffect, useState } from 'react';

import { Pipeline } from '@aigur/client/src';

import { PlayAudio } from './PlayAudio';
import { PipelineNode } from '../../PipelineNode';
import { NodeInstance } from '../../../types';
import { usePipelineStore } from '../../../stores/usePipeline';

export interface AudioOutputNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function AudioOutputNode(props: AudioOutputNodeProps) {
	const selectedPipeline = usePipelineStore((state) => state.selectedPipeline);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedPipeline) {
			return;
		}
		return selectedPipeline.onFinish((event: any) => {
			console.log(`***event.data.output`, event.data.output);
			setAudioUrl(event.data.output.audioUrl);
		});
	}, [props.data, selectedPipeline]);

	return (
		<PipelineNode
			id={props.id}
			data={{
				...props.data,
				nodeClassName: 'border-yellow-600 ring-yellow-900',
				handleClassName: '!bg-yellow-400',
				handles: [
					{
						position: Position.Top,
						type: 'target',
					},
				],
			}}
		>
			<PlayAudio audioUrl={audioUrl} inProgress={false} />
		</PipelineNode>
	);
}
