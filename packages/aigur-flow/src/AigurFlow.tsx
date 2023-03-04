import { ReactFlowProvider } from 'reactflow';

import { useNodesIOStore } from './stores/useNodesIO';
import { nodeTree } from './nodeTree';
import { NodeEditor } from './NodeEditor';
import { NodeBank } from './NodeBank';

export function AigurFlow() {
	const io = useNodesIOStore((state) => state.io);
	return (
		<ReactFlowProvider>
			<div className="flex flex-col h-full space-y-4 aigur-flow">
				{/* <div>{JSON.stringify(io)}</div> */}
				<div className="flex h-full">
					<div className="w-16 bg-base-300"></div>
					<div className="w-1/4 h-full max-w-4xl min-w-fit bg-base-200">
						<NodeBank nodeTree={nodeTree} />
					</div>
					<div className="flex-1">
						<NodeEditor />
					</div>
				</div>
			</div>
		</ReactFlowProvider>
	);
}
