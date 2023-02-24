import type { Pipeline } from '@aigur/client';
import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';

export interface InputNodeProps {
	id: string;
	data: {
		title: string;
		id: string;
		pipeline: Pipeline<any, any, any>;
	};
}

export function InputNode(props: InputNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				label: props.data.title,
				nodeClassName: 'border-yellow-600 ring-yellow-900',
				handleClassName: '!bg-yellow-400',
				type: 'input',
				handles: [
					{
						position: Position.Right,
						type: 'source',
					},
				],
				index: 0,
				definitionLabel: 'Pipeline',
				pipeline: props.data.pipeline,
			}}
		/>
	);
}
