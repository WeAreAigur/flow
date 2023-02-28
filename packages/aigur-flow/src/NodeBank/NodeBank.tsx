import { Tree } from 'antd';

import { NodeDefinitions } from '../types';

interface Branch {
	title: string;
	key: string;
	children?: Branch[];
}

type TreeData = Branch[];

interface NodeBankProps {
	nodeDefinitions: NodeDefinitions;
}

export function NodeBank(props: NodeBankProps) {
	return (
		<div className="h-full p-4">
			<Tree
				rootClassName="bg-transparent text-white"
				treeData={nodeDefinitionsToTreeData(props.nodeDefinitions)}
				onDragStart={({ event, node }) => {
					event.dataTransfer.setData('application/aigurflow', JSON.stringify(node));
				}}
				defaultExpandAll={true}
				draggable={{
					icon: false,
					nodeDraggable: (node) =>
						node.children === undefined && node.title !== 'input' && node.title !== 'output',
				}}
			/>
			{/* {Object.entries(props.nodeDefinitions).map(([category, val]) => (
				<NodeCategory key={category} title={category} nodeDefinitions={val} />
			))} */}
		</div>
	);
}

// TODO: rewrite this
function nodeDefinitionsToTreeData(nodeDefinitions: NodeDefinitions): TreeData {
	return inner(nodeDefinitions);

	function inner(nodeDefinitionsLevel, treeLevel = []) {
		for (let key in nodeDefinitionsLevel) {
			const obj = nodeDefinitionsLevel[key];
			const objData = {
				id: obj.id,
				type: obj.type,
				definitionLabel: obj.definitionLabel,
				input: obj.input,
				output: obj.output,
				tag: obj.tag,
			};
			if (!nodeDefinitionsLevel[key].title) {
				treeLevel.push({
					title: key,
					key,
					children: inner(nodeDefinitionsLevel[key]),
					...objData,
				});
			} else {
				treeLevel.push({
					title: objData.id,
					key,
					...objData,
				});
			}
		}

		return treeLevel;
	}
}
