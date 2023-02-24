import type { Pipeline } from '@aigur/client';
import { Position } from 'reactflow';

import { PipelineNode } from './PipelineNode';

export interface GenericNodeProps {
	id: string;
	data: {
		title: string;
		id: string;
		pipeline: Pipeline<any, any, any>;
	};
}

export function GenericNode(props: GenericNodeProps) {
	return (
		<PipelineNode
			id={props.id}
			data={{
				label: props.data.title,
				nodeClassName: 'border-pink-600 ring-pink-900',
				handleClassName: '!bg-pink-400',
				type: 'generic',
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
				definitionLabel: 'Beep',
				pipeline: props.data.pipeline,
			}}
		/>
	);
}
