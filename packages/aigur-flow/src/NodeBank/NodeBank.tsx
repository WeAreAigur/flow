import { Tree } from 'antd';

import { useConnectNodesProperties } from '../NodeEditor/connectNodeProperties';
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
	const connectNodesProperties = useConnectNodesProperties();
	return (
		<div className="h-full">
			<div className="p-4">
				<Tree
					rootClassName="bg-transparent text-slate-300"
					treeData={props.nodeTree}
					onClick={(_event, node) => {
						const nodeDefinition = nodeRepository[node.key];
						const viewport = currentFlow.getViewport();
						const { nodes } = currentFlow.toObject();
						const position = nodes[0]?.position ?? {
							x: viewport.x,
							y: viewport.y,
						};
						const newNode = createNode(nodeDefinition, {
							x: position.x,
							y: position.y + 300,
						});

						currentFlow.addNodes(newNode);

						if (nodes.length === 0) {
							currentFlow.fitView();
						} else {
							const edge = {
								id: `${newNode.id}-${nodes[0].id}`,
								source: nodes[0].id,
								target: newNode.id,
							};
							currentFlow.addEdges(edge);
							setTimeout(() => {
								connectNodesProperties(edge);
							});
						}
						// console.log(`***currentFlow.toObject()`, currentFlow.toObject());
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
