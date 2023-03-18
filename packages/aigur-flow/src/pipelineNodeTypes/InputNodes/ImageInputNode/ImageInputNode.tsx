import { useState } from 'react';
import { Position } from 'reactflow';

import { useNodesIOStore } from '../../../stores/useNodesIO';
import { NodeInstance } from '../../../types';
import { PipelineNode } from '../../PipelineNode';
import { ImageUpload } from './ImageUpload';

import type { Pipeline } from '@aigur/client/src';
export interface ImageInputNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function ImageInputNode(props: ImageInputNodeProps) {
	const { setNodeIO, io } = useNodesIOStore((state) => state);
	const [image, setImage] = useState(io[props.id]?.input?.image ?? '');
	const saveImage = (image: string) => {
		setImage(image);
		setNodeIO(props.id, { input: { image }, output: { image } });
	};
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
			<ImageUpload onSelect={saveImage} />
			{image ? <img src={image} width={128} height={128} alt="Uploaded Image" /> : null}
		</PipelineNode>
	);
}
