import type { Pipeline } from '@aigur/client';
import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';

export interface ProviderNodeProps {
	id: string;
	data: {
		title: string;
		id: string;
		pipeline: Pipeline<any, any, any>;
		definitionLabel: string;
	};
}

export function ProviderNode(props: ProviderNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				label: props.data.title,
				nodeClassName: 'border-blue-600 ring-blue-900',
				handleClassName: '!bg-blue-500',
				type: 'provider',
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
				index: 0,
				definitionLabel: props.data.definitionLabel,
				pipeline: props.data.pipeline,
			}}
		/>
	);
}
