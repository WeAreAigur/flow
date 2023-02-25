import { NodeBank } from './NodeBank';
import { nodeDefinitions } from './nodeDefinitions';
import { NodeEditor } from './NodeEditor';
import { useNodesIOStore } from './stores/useNodesIO';

export function AigurFlow() {
	const io = useNodesIOStore((state) => state.io);
	return (
		<div className="aigur-flow h-full">
			<div className="h-full flex">
				<div>
					<pre>{JSON.stringify(io, null, 2)}</pre>
				</div>
				<div className="h-full w-1/4">
					<NodeBank nodeDefinitions={nodeDefinitions} />
				</div>
				<div className="flex-1">
					<NodeEditor />
				</div>
			</div>
		</div>
	);
}
