import { zodToObj } from 'zod-to-obj';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { InputEditor } from './InputEditor';
import { upperFirst } from '../utils/stringUtils';
import { NodeDefinition } from '../types';
import { useNodesIOStore } from '../stores/useNodesIO';
import { useFlowStore } from '../stores/useFlow';

export interface EditNodeModalProps {
	node: NodeDefinition;
}

export function EditNodeModal(props: EditNodeModalProps) {
	const form = useForm();
	const { setNodeIO, io } = useNodesIOStore((state) => state);
	const currentFlow = useFlowStore((state) => state.currentFlow);

	useEffect(() => {
		if (props.node) {
			// TODO: set default values
			form.reset({
				input: structuredClone(io[props.node.id]?.input ?? {}),
				output: structuredClone(io[props.node.id]?.output ?? {}),
			});
		}
	}, [currentFlow, form, io, props.node]);

	const submit = (data: any) => {
		const inputToSubmit = pruneObject(data.input);
		setNodeIO(props.node.id, {
			type: props.node.type,
			subType: props.node.subtype,
			input: inputToSubmit ?? {},
			output: {},
		});
	};

	function pruneObject(obj: Record<string, any>) {
		const prunedObject: Record<string, any> = {};
		for (let property in obj) {
			const value = obj[property];
			if (value !== 'NaN' && value !== '') {
				prunedObject[property] = value;
			}
			if (Array.isArray(value)) {
				prunedObject[property] = value.map(pruneObject).filter(Boolean);
			} else if (typeof value === 'object') {
				prunedObject[property] = Object.fromEntries(
					Object.entries(pruneObject(value) ?? {}).filter(([key, value]) => value !== null)
				);
			}
		}

		if (Object.keys(prunedObject).length === 0) {
			return null;
		}

		return prunedObject;
	}

	// function getType(key, type) {
	// 	const shape = getSchemaShape(props.node.input);
	// }

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
				<label className="relative p-0 modal-box" htmlFor="">
					{props.node ? (
						<>
							<div className="p-6 bg-base-200">
								<div className="text-4xl">{upperFirst(props.node?.title)}</div>
								{/* <div>
									Description description description description description description
									description description description description description description{' '}
								</div> */}
							</div>
							<div className="p-6">
								<form onSubmit={form.handleSubmit(submit)}>
									<>
										<div className="py-4 text-2xl font-bold">Input</div>
										<div className="p-4 rounded-lg bg-base-200">
											<InputEditor node={props.node} form={form} />
										</div>
										<div className="py-4 text-2xl font-bold">Output</div>
										<div className="p-4 rounded-lg bg-base-200">
											{/* TODO: handle streams */}
											{zodToObj(props.node.schema.output as z.AnyZodObject).map((field) => (
												<div key={field.property} className="grid grid-cols-2">
													<div>{field.property}</div> <div>{field.type}</div>
												</div>
											))}
										</div>
									</>
								</form>
								<div className="modal-action">
									<label htmlFor="edit-node-modal" className="btn">
										Close
									</label>
								</div>
							</div>
						</>
					) : null}
				</label>
			</label>
		</>
	);
}
