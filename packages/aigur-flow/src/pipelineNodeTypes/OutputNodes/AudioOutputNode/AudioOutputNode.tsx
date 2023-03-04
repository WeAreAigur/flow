import { Position } from 'reactflow';

import { Pipeline } from '@aigur/client/src';

import { PipelineNode } from '../../PipelineNode';
import { NodeDefinition } from '../../../types';

export interface AudioOutputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function AudioOutputNode(props: AudioOutputNodeProps) {
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
						type: 'source',
					},
				],
			}}
		>
			<div className="text-red-500">Voice</div>
		</PipelineNode>
	);
}
