import { Position } from 'reactflow';

import { PipelineNode } from '../PipelineNode';
import { NodeDefinition } from '../../types';

import type { Pipeline } from '@aigur/client/src';
export interface OutputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function OutputNode(props: OutputNodeProps) {
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
		/>
	);
}
