import { Tree } from 'antd';

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
	return (
		<div className="h-full">
			{/* <div className="flex items-center bg-base-300 h-11 flex-end">
				<input type="text" className="input input-xs input-bordered" />
			</div> */}
			<div className="p-4">
				<Tree
					rootClassName="bg-transparent text-white"
					treeData={props.nodeTree}
					onDragStart={({ event, node }) => {
						// event.dataTransfer.effectAllowed = 'move';
						event.dataTransfer.setData('application/aigurflow', node.key);
					}}
					defaultExpandAll={true}
					draggable={{
						icon: false,
						nodeDraggable: (node) => node.children === undefined, // && node.title !== 'input' && node.title !== 'output',
					}}
				/>
			</div>
		</div>
	);
}
