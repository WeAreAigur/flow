import { Tree } from 'antd';

import { createNode } from '../NodeEditor/nodeCreator';
import { nodeRepository } from '../nodeRepository';
import { useFlowStore } from '../stores/useFlow';

export interface Branch {
	title: string;
	key: string;
	children?: Branch[];
}

export type TreeData = Branch[];

interface NodeBankProps {
	nodeTree: TreeData;
}

export function NodeBank(props: NodeBankProps) {
	const currentFlow = useFlowStore((state) => state.currentFlow);
	return (
		<div className="h-full">
			<div className="p-4">
				<Tree
					rootClassName="bg-transparent text-slate-300"
					treeData={props.nodeTree}
					onClick={(_event, node) => {
						const nodeDefinition = nodeRepository[node.key];
						const newNode = createNode(nodeDefinition, {
							x: 300 + Math.random() * 500,
							y: 400 + Math.random() * 500,
						});
						currentFlow.addNodes(newNode);
					}}
					onDragStart={({ event, node }) => {
						// event.dataTransfer.effectAllowed = 'move';
						event.dataTransfer.setData('application/aigurflow', node.key);
					}}
					defaultExpandAll={true}
					draggable={{
						icon: false,
						nodeDraggable: (node) => !node.children,
					}}
				/>
			</div>
		</div>
	);
}
