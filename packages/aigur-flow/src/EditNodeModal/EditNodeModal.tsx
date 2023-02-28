import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useFlowStore } from '../stores/useFlow';
import { useNodesIOStore } from '../stores/useNodesIO';
import { NodeDefinition } from '../types';
import { upperFirst } from '../utils/stringUtils';
import { ValueField } from './ValueField';

export interface EditNodeModalProps {
	node: NodeDefinition;
}

export function EditNodeModal(props: EditNodeModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = useForm();
	const { setNodeIO, io } = useNodesIOStore((state) => state);
	const currentFlow = useFlowStore((state) => state.currentFlow);
	const [previousNodes, setPreviousNodes] = useState<any[]>([]);

	useEffect(() => {
		if (props.node) {
			reset({
				input: structuredClone(io[props.node.id]?.input ?? {}),
				output: structuredClone(io[props.node.id]?.output ?? {}),
			});
		}
	}, [currentFlow, io, props.node, reset]);

	useEffect(() => {
		if (props.node && currentFlow) {
			const previousNodes = getPreviousNodes();
			console.log(`***previousNodes`, previousNodes);
			const nodesWithOutput = previousNodes.map((prevNode) => ({
				id: prevNode.id,
				output: prevNode.data.output,
			}));
			setPreviousNodes(nodesWithOutput);
			// for each node, get output properties
			// filter by field's type (cast number->string?)
			// create tree structure
			// set options in state
			// what about multiple variables in a single property? `$context.0.name$ - $context.1.age$`
		}

		function getPreviousNodes() {
			const previousNodes = [];
			let nodeId = props.node.id;
			let edge = currentFlow.edges.find((edge) => edge.target === nodeId);
			if (!edge) {
				return [];
			}
			do {
				const sourceNode = currentFlow.nodes.find((node) => node.id === edge.source);
				previousNodes.push(sourceNode);
				nodeId = sourceNode?.id;
				edge = currentFlow.edges.find((edge) => edge.target === nodeId);
			} while (!!edge);
			return previousNodes;
		}
	}, [currentFlow, props.node]);

	const submit = (data) => {
		setNodeIO(props.node.id, data);
	};

	const getOptionsFor = (type: string) => {
		const nodeWithFilteredOutput = [];

		let idx = previousNodes.length - 2;
		for (let node of previousNodes) {
			const filteredOutput = Object.entries(node.output).reduce((acc, [key, val]) => {
				if (val === type) {
					acc.push({
						label: key,
						value: key,
					});
				}
				return acc;
			}, []);
			nodeWithFilteredOutput.push({
				label: node.id,
				value: idx < 0 ? 'input' : idx,
				children: filteredOutput,
			});
			idx--;
		}
		console.log(`***nodeWithFilteredOutput`, nodeWithFilteredOutput);
		return nodeWithFilteredOutput;
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
					{props.node ? (
						<>
							<div className="pt-4 pb-8">
								<div className="text-2xl underline">{upperFirst(props.node?.id)}</div>
								{/* <div>
									Description description description description description description
									description description description description description description{' '}
								</div> */}
							</div>
							<form onSubmit={handleSubmit(submit)}>
								<>
									<div className="font-bold py-4">Node Input</div>
									{Object.entries(props.node.input).map(([key, type]) => (
										<div key={key} className="grid grid-cols-6">
											<div className="col-span-2">{key}</div>
											<ValueField
												name={`input.${key}`}
												register={register}
												setValue={setValue}
												options={getOptionsFor(type)}
											/>
											{/* <Select
											name={`input.${key}`}
											options={getOptionsFor(type)}
											register={register}
										/> */}
											{/* <input type="text" name={`input.${key}`} {...register(`input.${key}`)} /> */}
										</div>
									))}
									<div className="font-bold py-4">Node Output</div>
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
