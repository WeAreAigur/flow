import { NodeDefinition } from '#/types';

export interface NodeDefinitionProps {
	node: NodeDefinition;
}

const onDragStart = (event, node) => {
	event.target.classList.add('bg-red-500');
	event.dataTransfer.setData('application/aigurflow', JSON.stringify(node));
	event.dataTransfer.effectAllowed = 'move';
};

const onDragStop = (event) => {
	event.target.classList.remove('bg-red-500');
};

export function NodeDefinitionInstance(props: NodeDefinitionProps) {
	return (
		<div
			className="border p-4 rounded-lg cursor-pointer"
			onDragStart={(event) => onDragStart(event, props.node)}
			onDragEnd={(event) => onDragStop(event)}
			draggable
		>
			{props.node.title}
		</div>
	);
}
