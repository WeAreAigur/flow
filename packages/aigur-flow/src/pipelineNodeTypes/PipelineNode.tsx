import { Handle, Position } from 'reactflow';
import { useEffect, useRef, useState } from 'react';

import { NodeInstance } from '../types';
import { usePipelineStore } from '../stores/usePipeline';
import { useNodeStore } from '../stores/useNode';
import { EditNodeModalTrigger } from '../EditNodeModal/EditNodeModalTrigger';

import type { Pipeline } from '@aigur/client/src';
export interface PipelineNodeProps {
	id: string;
	data: NodeInstance & {
		pipeline: Pipeline<any, any, any>;
		handles: {
			type: 'target' | 'source';
			position: Position;
		}[];
		nodeClassName?: string;
		handleClassName?: string;
	};
	children?: React.ReactNode;
}

let resetTimeout;
const PIPELINE_RESET_TIME = 1_500;
const PIPELINE_RESET_ON_START_TIME = 10_000;
export function PipelineNode(props: PipelineNodeProps) {
	const selectNode = useNodeStore((state) => state.selectNode);
	const selectedPipeline = usePipelineStore((state) => state.selectedPipeline);
	const [status, setStatus] = useState<'idle' | 'inProgress' | 'done'>('idle');
	const lastProgressEventIdx = useRef<number>(-1);

	useEffect(() => {
		if (!selectedPipeline) {
			return;
		}
		const unsubOnStart = selectedPipeline.onStart(() => {
			if (props.id === 'input') {
				setStatus('inProgress');
			}
			if (resetTimeout) {
				clearTimeout(resetTimeout);
			}
			resetTimeout = setTimeout(() => setStatus('idle'), PIPELINE_RESET_ON_START_TIME);
		});
		const unsubOnFinish = selectedPipeline.onFinish((event) => {
			// dont accept anymore events
			lastProgressEventIdx.current = event.eventIndex;
			setStatus('done');
			setTimeout(() => {
				setStatus('idle');
				lastProgressEventIdx.current = 0;
			}, PIPELINE_RESET_TIME);
		});
		const unsubOnProgress = selectedPipeline.onProgress((event) => {
			if (props.id === 'input') {
				setStatus('done');
			}
			if (event.data?.tag === props.data.tag) {
				if (event.eventIndex < lastProgressEventIdx.current) {
					return;
				}
				lastProgressEventIdx.current = event.eventIndex;
				if (event.type === 'node:start') {
					setStatus((status) => (status === 'idle' ? 'inProgress' : status));
				} else if (event.type === 'node:finish') {
					setStatus('done');
				}
			}
		});
		return () => {
			unsubOnFinish();
			unsubOnProgress();
			unsubOnStart();
		};
	}, [props.data, props.id, selectedPipeline, status]);

	function deleteNode() {}

	return (
		<div
			className={`flex px-4 py-4 rounded-lg bg-stone-800 border ring-2 ring-offset-2 ring-offset-zinc-900 min-h-[12rem] min-w-[14rem] w-[20rem] ${
				props.data.nodeClassName ?? ''
			}`}
		>
			<div className="flex flex-col justify-between flex-1 space-y-2 text-left">
				<div className="flex-1">
					<div className="text-xs text-stone-500">{props.data.definitionLabel}</div>
					<div className="text-2xl font-bold text-stone-100">{props.data.title}</div>
				</div>
				{props.children ? <div>{props.children}</div> : null}
				<div className="flex items-center justify-between">
					<EditNodeModalTrigger onSelect={() => selectNode({ ...props.data, id: props.id })} />
					<div>
						{/* Lovely double triple ternary 💪🏻 */}
						<div
							className={`transition-all duration-300 badge ${
								status === 'idle'
									? 'badge-outline'
									: status === 'inProgress'
									? 'badge-warning'
									: 'badge-success'
							}`}
						>
							{status === 'idle' ? 'Idle' : status === 'inProgress' ? 'In Progress' : 'Done'}
						</div>
					</div>
				</div>
			</div>
			{props.data.handles?.map((handle, i) => (
				<Handle
					key={`${handle.position}-${i}`}
					type={handle.type}
					position={handle.position}
					className={`!h-3 !w-12 !rounded-none !border-none ${props.data.handleClassName ?? ''}`}
					id={`${props.id}-${handle.position}`}
				/>
			))}
		</div>
	);
}
