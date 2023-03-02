import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';
import { NodeDefinition } from '../types';

import type { Pipeline } from '@aigur/client';
export interface ProviderNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function ProviderNode(props: ProviderNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				...props.data,
				nodeClassName: 'border-blue-600 ring-blue-900',
				handleClassName: '!bg-blue-500',
				type: 'provider',
				handles: [
					{
						position: Position.Bottom,
						type: 'source',
					},
					{
						position: Position.Top,
						type: 'target',
					},
				],
			}}
		/>
	);
}
