import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { ValueField } from './ValueField';
import { NodeDefinition } from '../types';
import { useFlowStore } from '../stores/useFlow';

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
			const fields = getFields(node.output as z.AnyZodObject);
			const filteredOutput = fields.filter(([key, fieldType]) => fieldType === type);
			const children = filteredOutput.map(([key, fieldType]) => ({
				label: key,
				value: key,
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

	// console.log(`***props.node.schema.input`, props.node.schema.input);
	// console.log(
	// 	`***props.node.schema.input shape`,
	// 	(props.node.schema.input as z.AnyZodObject)._def.shape()
	// );

	// TODO: handle nested objects
	function getFields(schema: z.AnyZodObject) {
		const shape = schema._def.shape();
		return Object.entries(shape).map(([key, type]) => {
			const isDefault = type instanceof z.ZodDefault;
			const shapeType = isDefault ? shape[key]._def.innerType : shape[key];
			const typeName = shapeType._def.typeName;
			return [key, typeName];
		});
	}

	return (
		<div className="">
			{getFields(props.node.schema.input).map(([key, type]) => (
				<div key={key} className="grid items-center grid-cols-7 space-y-4">
					<div className="col-span-3">{key}</div>
					<ValueField
						name={`input.${key}`}
						type={type}
						register={register}
						setValue={setValue}
						options={getOptionsFor(type)}
					/>
				</div>
			))}
		</div>
	);
}
