export interface EditNodeModalTriggerProps {
	onSelect: (node: any) => void;
}

export function EditNodeModalTrigger(props: EditNodeModalTriggerProps) {
	return (
		<label htmlFor="edit-node-modal" className="btn btn-ghost btn-primary" onClick={props.onSelect}>
			Edit
		</label>
	);
}
