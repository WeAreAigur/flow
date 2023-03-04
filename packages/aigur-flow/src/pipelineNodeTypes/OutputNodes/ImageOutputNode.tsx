import { useEffect, useState } from 'react';
import { Position } from 'reactflow';

import { useNodesIOStore } from '../../stores/useNodesIO';
import { usePipelineStore } from '../../stores/usePipeline';
import { NodeDefinition } from '../../types';
import { PipelineNode } from '../PipelineNode';

import type { Pipeline } from '@aigur/client/src';
export interface ImageOutputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function ImageOutputNode(props: ImageOutputNodeProps) {
	const { setNodeIO } = useNodesIOStore((state) => state);
	const selectedPipeline = usePipelineStore((state) => state.selectedPipeline);
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		if (!selectedPipeline) {
			return;
		}
		return selectedPipeline.onFinish((event) => {
			console.log(`***props.data`, props.data);
			setImageUrl(event.data.output.imageUrl);
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
			{imageUrl ? <img src={imageUrl} width={128} height={128} alt="" /> : <div>no image</div>}
		</PipelineNode>
	);
}