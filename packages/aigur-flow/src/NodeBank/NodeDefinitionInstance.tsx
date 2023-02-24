export interface NodeDefinitionProps {
	title: string;
	id: string;
}

const onDragStart = (event, nodeTitle, nodeId) => {
	event.target.classList.add('bg-red-500');
	event.dataTransfer.setData('application/aigurflow/title', nodeTitle);
	event.dataTransfer.setData('application/aigurflow/id', nodeId);
	event.dataTransfer.effectAllowed = 'move';
};

const onDragStop = (event) => {
	event.target.classList.remove('bg-red-500');
};

export function NodeDefinitionInstance(props: NodeDefinitionProps) {
	return (
		<div
			className="border p-4 rounded-lg cursor-pointer"
			onDragStart={(event) => onDragStart(event, props.title, props.id)}
			onDragEnd={(event) => onDragStop(event)}
			draggable
		>
			{props.title}
		</div>
	);
}
