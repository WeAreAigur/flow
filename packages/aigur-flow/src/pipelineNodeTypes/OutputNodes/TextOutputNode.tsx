import { Position } from 'reactflow';
import { useEffect, useState } from 'react';

import { PipelineNode } from '../PipelineNode';
import { NodeInstance } from '../../types';
import { usePipelineStore } from '../../stores/usePipeline';
import { useNodesIOStore } from '../../stores/useNodesIO';

import type { Pipeline } from '@aigur/client/src';
export interface TextInputNodeProps {
	id: string;
	data: NodeInstance & { pipeline: Pipeline<any, any, any> };
}

export function TextOutputNode(props: TextInputNodeProps) {
	const { setNodeIO } = useNodesIOStore((state) => state);
	const selectedPipeline = usePipelineStore((state) => state.selectedPipeline);
	const [text, setText] = useState('');
	const saveText = (text: string) => {
		setText(text);
		setNodeIO(props.id, { input: { text }, output: { text } });
	};

	useEffect(() => {
		if (!selectedPipeline) {
			return;
		}
		return selectedPipeline.onFinish((event: any) => {
			setText(event.data.output.text);
		});
	}, [selectedPipeline]);

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
