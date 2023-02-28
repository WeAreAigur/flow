import { ReactFlowProvider } from 'reactflow';

import { useNodesIOStore } from './stores/useNodesIO';
import { NodeEditor } from './NodeEditor';
import { nodeDefinitions } from './nodeDefinitions';
import { NodeBank } from './NodeBank';

export function AigurFlow() {
	const io = useNodesIOStore((state) => state.io);
	return (
		<ReactFlowProvider>
			<div className="aigur-flow h-full flex flex-col space-y-4">
				{/* <div>{JSON.stringify(io)}</div> */}
				<div className="h-full flex">
					<div className="h-full w-1/4">
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
