import { useReactFlow } from 'reactflow';
import { GlobalHotKeys } from 'react-hotkeys';
import { useCallback, useState } from 'react';

import { OutputPanel } from './OutputPanel';
import { InputPanel } from './InputPanel';
import { useUserStore } from '../stores/userUser';
import { usePipelineStore } from '../stores/usePipeline';
import { useNodesIOStore } from '../stores/useNodesIO';
import { flowToPipelineData, invokePipeline, pipelineDataToPipeline } from '../flowToPipeline';

export interface ControlPanelProps {}

export function ControlPanel(props: ControlPanelProps) {
	const reactFlowInstance = useReactFlow();
	const { initIO, io: nodesIO } = useNodesIOStore((state) => state);
	const selectPipeline = usePipelineStore((state) => state.selectPipeline);
	const [isRunning, setIsRunning] = useState(false);
	const [output, setOutput] = useState<Record<string, any> | null>(null);
	const userId = useUserStore((state) => state.userId);

	function newPipeline() {
		reactFlowInstance.setNodes([]);
		reactFlowInstance.setEdges([]);
		initIO({});
		setOutput(null);
	}

	const runPipeline = useCallback(async () => {
		if (reactFlowInstance) {
			setIsRunning(true);
			const flow = reactFlowInstance.toObject();
			const pipelineData = await flowToPipelineData(flow, nodesIO);
			if (!pipelineData) {
				// TODO: show error
				setIsRunning(false);
				return;
			}
			const pipeline = pipelineDataToPipeline(pipelineData);
			selectPipeline(pipeline);
			const output = await invokePipeline(pipeline, pipelineData, userId);
			setIsRunning(false);
			setOutput(output);
		}
	}, [nodesIO, reactFlowInstance, selectPipeline, userId]);

	const keyMap = {
		runPipeline: ['ctrl+enter', 'cmd+enter'],
	};

	const handlers = {
		runPipeline,
	};

	function getInputKey() {
		return Object.keys(nodesIO).find((key) => key.startsWith('input'));
	}

	return (
		<GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
			<div className="w-72 drawer drawer-end drawer-mobile">
				<input id="control-panel" type="checkbox" className="drawer-toggle" defaultChecked={true} />
				<div className="hidden drawer-content">
					<label htmlFor="control-panel" className="drawer-button btn btn-primary lg:hidden">
						Open drawer
					</label>
				</div>
				<div className="w-72 drawer-side bg-base-300">
					<label htmlFor="control-panel" className="drawer-overlay"></label>
					<div className="flex flex-col w-full p-4">
						<div className="btn-group">
							<button onClick={newPipeline} className="btn btn-secondary btn-sm">
								New
							</button>
							<button
								onClick={runPipeline}
								className={`btn btn-primary btn-sm ${isRunning ? 'loading' : ''}`}
							>
								{isRunning ? '' : 'Run'}
							</button>
						</div>
						<InputPanel inputKeyName={getInputKey()} />
						<OutputPanel output={output} />
					</div>
				</div>
			</div>
		</GlobalHotKeys>
	);
}
