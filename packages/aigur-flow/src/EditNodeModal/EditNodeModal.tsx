import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useFlowStore } from '../stores/useFlow';
import { useNodesIOStore } from '../stores/useNodesIO';
import { NodeDefinition } from '../types';
import { upperFirst } from '../utils/stringUtils';
import { InputEditor } from './InputEditor';

export interface EditNodeModalProps {
	node: NodeDefinition;
}

export function EditNodeModal(props: EditNodeModalProps) {
	const form = useForm();
	const { setNodeIO, io } = useNodesIOStore((state) => state);
	const currentFlow = useFlowStore((state) => state.currentFlow);

	useEffect(() => {
		if (props.node) {
			form.reset({
				input: structuredClone(io[props.node.id]?.input ?? {}),
				output: structuredClone(io[props.node.id]?.output ?? {}),
			});
		}
	}, [currentFlow, form, io, props.node]);

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
					form.handleSubmit(submit)();
				}}
			/>
			<label htmlFor="edit-node-modal" className="cursor-pointer modal">
				<label className="relative modal-box" htmlFor="">
					{props.node ? (
						<>
							<div className="pt-4 pb-8">
								<div className="text-2xl underline">{upperFirst(props.node?.id)}</div>
								{/* <div>
									Description description description description description description
									description description description description description description{' '}
								</div> */}
							</div>
							<form onSubmit={form.handleSubmit(submit)}>
								<>
									<div className="py-4 font-bold">Node Input</div>
									<InputEditor node={props.node} form={form} />
									<div className="py-4 font-bold">Node Output</div>
									{Object.entries(props.node.output).map(([key, type]) => (
										<div key={key} className="grid grid-cols-2">
											<div>{key}</div> <div>{upperFirst(type)}</div>
										</div>
									))}
								</>
							</form>
							<div className="modal-action">
								<label htmlFor="edit-node-modal" className="btn">
									Close
								</label>
							</div>
						</>
					) : null}
				</label>
			</label>
		</>
	);
}
