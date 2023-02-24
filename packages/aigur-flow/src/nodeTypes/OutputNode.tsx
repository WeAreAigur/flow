import type { Pipeline } from '@aigur/client';
import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';

export interface OutputNodeProps {
	id: string;
	data: {
		title: string;
		id: string;
		pipeline: Pipeline<any, any, any>;
	};
}

export function OutputNode(props: OutputNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				label: props.data.title,
				nodeClassName: 'border-yellow-600 ring-yellow-900',
				handleClassName: '!bg-yellow-400',
				type: 'output',
				handles: [
					{
						position: Position.Left,
						type: 'target',
					},
				],
				index: 0,
				definitionLabel: 'Pipeline',
				pipeline: props.data.pipeline,
			}}
		/>
	);
}
