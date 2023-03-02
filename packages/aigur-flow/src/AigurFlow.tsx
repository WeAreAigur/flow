import { ReactFlowProvider } from 'reactflow';

import { NodeBank } from './NodeBank';
import { nodeDefinitions } from './nodeDefinitions';
import { NodeEditor } from './NodeEditor';
import { useNodesIOStore } from './stores/useNodesIO';

export function AigurFlow() {
	const io = useNodesIOStore((state) => state.io);
	return (
		<ReactFlowProvider>
			<div className="flex flex-col h-full space-y-4 aigur-flow">
				<div>{JSON.stringify(io)}</div>
				<div className="flex h-full">
					<div className="w-1/4 h-full min-w-fit bg-base-300">
						<NodeBank nodeDefinitions={nodeDefinitions} />
					</div>
					<div className="flex-1">
						<NodeEditor />
					</div>
				</div>
			</div>
		</ReactFlowProvider>
	);
}
