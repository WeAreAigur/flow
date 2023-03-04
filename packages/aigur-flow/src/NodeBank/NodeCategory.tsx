import { Fragment } from 'react';

import { NodeDefinitionInstance } from './NodeDefinitionInstance';
import { NodeDefinition, NodeTree } from '../types';

interface NodeCategoryProps {
	title: string;
	nodeDefinitions: NodeDefinition | NodeTree;
}

export function NodeCategory(props: NodeCategoryProps) {
	return (
		<div className="collapse">
			<input type="checkbox" className="peer" defaultChecked={true} />
			<div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
				{props.title}
			</div>
			<div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
				{Object.entries(props.nodeDefinitions).map(([category, val]) => (
					<Fragment key={category}>
						{isNodeDefinition(val) ? (
							<NodeDefinitionInstance node={val} />
						) : (
							<NodeCategory title={category} nodeDefinitions={val} />
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
}

function isNodeDefinition(node: any): node is NodeDefinition {
	return node.id !== undefined && node.title !== undefined;
}
