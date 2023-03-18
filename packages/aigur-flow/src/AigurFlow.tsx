import { ReactFlowProvider } from 'reactflow';
import { useEffect } from 'react';

import { useUserStore } from './stores/userUser';
import { useNodesIOStore } from './stores/useNodesIO';
import { nodeTree } from './nodeTree';
import { NodeEditor } from './NodeEditor';
import { NodeBank } from './NodeBank';

interface AigurFlowProps {
	userId: string;
}

export function AigurFlow(props: AigurFlowProps) {
	const io = useNodesIOStore((state) => state.io);
	const setUserId = useUserStore((state) => state.setUserId);
	useEffect(() => {
		setUserId(props.userId);
	}, [props.userId, setUserId]);
	return (
		<ReactFlowProvider>
			<div className="flex flex-col flex-1 space-y-4 aigur-flow">
				{process.env.NODE_ENV === 'development' ? <div>{JSON.stringify(io)}</div> : null}
				<div className="flex flex-1">
					<div className="w-16 bg-base-300"></div>
					<div className="w-1/4 max-w-4xl min-w-fit bg-base-200">
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
