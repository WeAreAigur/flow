import { NodeDefinitions } from '#/types';

import { NodeCategory } from './NodeCategory';

interface NodeBankProps {
	nodeDefinitions: NodeDefinitions;
}

export function NodeBank(props: NodeBankProps) {
	return (
		<div className="h-full p-4">
			{Object.entries(props.nodeDefinitions).map(([category, val]) => (
				<NodeCategory key={category} title={category} nodeDefinitions={val} />
			))}
		</div>
	);
}
