import { useState } from 'react';
import { Position } from 'reactflow';

import { useNodesIOStore } from '../../stores/useNodesIO';
import { NodeInstance } from '../../types';
import { PipelineNode } from '../PipelineNode';

import type { Pipeline } from '@aigur/client/src';
export interface TextInputNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function TextInputNode(props: TextInputNodeProps) {
	const { setNodeIO, io } = useNodesIOStore((state) => state);
	const [text, setText] = useState(io[props.id]?.input?.text ?? '');
	const saveText = (text) => {
		setText(text);
		setNodeIO(props.id, { input: { text }, output: { text } });
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
						position: Position.Bottom,
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
