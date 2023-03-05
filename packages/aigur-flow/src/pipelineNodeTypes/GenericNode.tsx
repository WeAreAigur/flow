import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';
import { NodeInstance } from '../types';

import type { Pipeline } from '@aigur/client/src';
export interface GenericNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function GenericNode(props: GenericNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				...props.data,
				nodeClassName: 'border-pink-600 ring-pink-900',
				handleClassName: '!bg-pink-400',
				handles: [
					{
						position: Position.Top,
						type: 'source',
					},
					{
						position: Position.Bottom,
						type: 'target',
					},
				],
			}}
		/>
	);
}
