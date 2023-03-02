import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';
import { NodeDefinition } from '../types';

import type { Pipeline } from '@aigur/client';
export interface InputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function InputNode(props: InputNodeProps) {
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
		/>
	);
}
