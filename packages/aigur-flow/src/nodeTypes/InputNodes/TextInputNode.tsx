import { Position } from 'reactflow';
import { useState } from 'react';

import { PipelineNode } from '../PipelineNode';
import { NodeDefinition } from '../../types';
import { useNodesIOStore } from '../../stores/useNodesIO';

import type { Pipeline } from '@aigur/client';
export interface TextInputNodeProps {
	id: string;
	data: NodeDefinition & { pipeline: Pipeline<any, any, any> };
}

export function TextInputNode(props: TextInputNodeProps) {
	const { setNodeIO } = useNodesIOStore((state) => state);
	const [text, setText] = useState('');
	const saveText = (text) => {
		setText(text);
		setNodeIO(props.data.id, { input: { text }, output: { text } });
	};
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
			<textarea
				className="w-full h-24 textarea textarea-bordered"
				name="text"
				value={text}
				onChange={(e) => saveText(e.target.value)}
			/>
		</PipelineNode>
	);
}
