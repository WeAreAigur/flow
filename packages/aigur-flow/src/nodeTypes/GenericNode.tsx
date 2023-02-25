import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';
import { NodeDefinition } from '../types';

import type { Pipeline } from '@aigur/client';
export interface GenericNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
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
						position: Position.Right,
						type: 'source',
					},
					{
						position: Position.Left,
						type: 'target',
					},
				],
			}}
		/>
	);
}
