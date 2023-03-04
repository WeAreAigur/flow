import { useEffect, useState } from 'react';
import { UseFormRegister, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { z } from 'zod';
import { isZTOObject, zodToObj, ZTO_Base } from 'zod-to-obj';

import { useFlowStore } from '../stores/useFlow';
import { NodeDefinition } from '../types';
import { ValueField } from './ValueField';

export interface InputEditorProps {
	node: NodeDefinition;
	form: UseFormReturn<any>;
}

export function InputEditor(props: InputEditorProps) {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = props.form;
	const currentFlow = useFlowStore((state) => state.currentFlow);
	const [previousNodes, setPreviousNodes] = useState<any[]>([]);

	useEffect(() => {
		if (props.node && currentFlow) {
			const previousNodes = getPreviousNodes();
			const nodesWithOutput = previousNodes.map((prevNode) => ({
				id: prevNode.id,
				output: prevNode.data.schema.output,
			}));
			setPreviousNodes(nodesWithOutput);
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

	const getOptionsFor = (type: string) => {
		const nodeWithFilteredOutput = [];

		let idx = previousNodes.length - 2;
		for (let node of previousNodes) {
			const fields = zodToObj(node.output as z.AnyZodObject);
			const filteredOutput = fields.filter((field) => field.type === type);
			const children = filteredOutput.map((field) => ({
				label: field.property,
				value: field.property,
			}));
			nodeWithFilteredOutput.push({
				label: node.id,
				value: idx < 0 ? 'input' : idx,
				children,
			});
			idx--;
		}
		return nodeWithFilteredOutput;
	};

	console.log(`***props.node.schema.input`, props.node.schema.input);
	const in2 = zodToObj(props.node.schema.input);
	console.log(`***in2`, in2);
	return (
		<div className="">
			<X
				prefix="input"
				data={in2}
				register={register}
				setValue={setValue}
				getOptionsFor={getOptionsFor}
			/>
		</div>
	);
}

function X(props: {
	data: ZTO_Base[];
	register: UseFormRegister<any>;
	setValue: UseFormSetValue<any>;
	getOptionsFor: (type: string) => any[];
	prefix: string;
}) {
	return (
		<>
			{props.data.map((field) => (
				<div key={field.property} className="grid items-center grid-cols-7 space-y-4">
					<div className="col-span-3">{field.property}</div>
					{isZTOObject(field) ? (
						<X {...props} data={field.properties} prefix={`${props.prefix}.${field.property}`} />
					) : (
						<ValueField
							name={`${props.prefix}.${field.property}`}
							type={field.type}
							register={props.register}
							setValue={props.setValue}
							options={props.getOptionsFor(field.type)}
						/>
					)}
				</div>
			))}
		</>
	);
}
