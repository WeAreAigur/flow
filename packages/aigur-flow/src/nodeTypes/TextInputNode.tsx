import { Position } from 'reactflow';

import { NodeDefinition } from '../types';
import { PipelineNode } from './PipelineNode';

import type { Pipeline } from '@aigur/client';
export interface InputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function TextInputNode(props: InputNodeProps) {
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
			<div className="text-red-500">hello</div>
		</PipelineNode>
	);
}
