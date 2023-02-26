import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { NodeDefinition } from '../types';
import { useNodesIOStore } from '../stores/useNodesIO';

export interface EditNodeModalProps {
	node: NodeDefinition;
}

export function EditNodeModal(props: EditNodeModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm();
	const { setNodeIO, io } = useNodesIOStore((state) => state);

	useEffect(() => {
		if (props.node) {
			reset({
				input: structuredClone(io[props.node.id]?.input ?? {}),
				output: structuredClone(io[props.node.id]?.output ?? {}),
			});
		}
	}, [io, props.node, reset]);

	const submit = (data) => {
		setNodeIO(props.node.id, data);
	};

	return (
		<>
			<input
				type="checkbox"
				id="edit-node-modal"
				className="modal-toggle"
				onChange={(e) => {
					if (e.currentTarget.checked) return;
					handleSubmit(submit)();
				}}
			/>
			<label htmlFor="edit-node-modal" className="modal cursor-pointer">
				<label className="modal-box relative" htmlFor="">
					<form onSubmit={handleSubmit(submit)}>
						{props.node ? (
							<>
								<div>Input</div>
								{Object.entries(props.node.input).map(([key, val]) => (
									<div key={key}>
										{key} - <input name={key} {...register(`input.${key}`)} />
									</div>
								))}
								<div>Output</div>
								{Object.entries(props.node.output).map(([key, val]) => (
									<div key={key}>
										{key} - {val}
									</div>
								))}
							</>
						) : null}
					</form>
					<div className="modal-action">
						<label htmlFor="edit-node-modal" className="btn">
							Close
						</label>
					</div>
				</label>
			</label>
		</>
	);
}
