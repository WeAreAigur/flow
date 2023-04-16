import { useCallback, useMemo } from 'react';
import { DataNode, EventDataNode } from 'antd/es/tree';
import { Tree } from 'antd';

import { useNodesIOStore } from '../stores/useNodesIO';
import { useFlowStore } from '../stores/useFlow';
import { nodeRepository } from '../nodes/nodeRepository';
import { createNode } from '../NodeEditor/nodeCreator';
import { useConnectNodesProperties } from '../NodeEditor/connectNodeProperties';

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
	const setNodeIO = useNodesIOStore((state) => state.setNodeIO);
	const connectNodesProperties = useConnectNodesProperties();
	const onClick = useCallback(
		(_event: any, node: EventDataNode<DataNode>) => {
			if (!!node.children?.length || !currentFlow) {
				return;
			}
			const nodeDefinition = (nodeRepository as any)[node.key];
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

			console.log(`***adding new node`, newNode);
			currentFlow.addNodes(newNode);
			setNodeIO(newNode.id, {
				type: newNode.type,
				subType: newNode.subType,
				input: {},
				output: {},
			});

			if (nodes.length === 0) {
				currentFlow.fitView();
			} else {
				setTimeout(() => {
					const edge = {
						id: `${newNode.id}-${nodes[0].id}`,
						source: nodes[0].id,
						target: newNode.id,
					};
					console.log(`***edge`, edge);
					currentFlow.addEdges(edge);
					connectNodesProperties(edge);
				});
			}
			// console.log(`***currentFlow.toObject()`, currentFlow.toObject());
		},
		[connectNodesProperties, currentFlow, setNodeIO]
	);

	const onDragStart = useCallback(
		({ event, node }: { event: React.DragEvent<HTMLDivElement>; node: EventDataNode<Branch> }) => {
			// event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('application/aigurflow', node.key);
		},
		[]
	);

	const draggableDefinition = useMemo(
		() => ({
			icon: false,
			nodeDraggable: (node: DataNode) => !node.children,
		}),
		[]
	);

	return (
		<div className="max-h-[calc(100vh-50px)] overflow-scroll">
			<div className="p-4">
				<Tree
					rootClassName="bg-transparent text-slate-300"
					treeData={props.nodeTree}
					onClick={onClick}
					onDragStart={onDragStart}
					defaultExpandAll={true}
					draggable={draggableDefinition}
				/>
			</div>
		</div>
	);
}
