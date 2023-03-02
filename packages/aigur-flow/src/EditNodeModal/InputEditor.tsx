import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

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
			console.log(`***previousNodes`, previousNodes);
			const nodesWithOutput = previousNodes.map((prevNode) => ({
				id: prevNode.id,
				output: prevNode.data.output,
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
		return nodeWithFilteredOutput;
	};

	return (
		<div className="">
			{Object.entries(props.node.input).map(([key, type]) => (
				<div key={key} className="grid grid-cols-6">
					<div className="col-span-2">{key}</div>
					<ValueField
						name={`input.${key}`}
						register={register}
						setValue={setValue}
						options={getOptionsFor(type)}
					/>
				</div>
			))}
		</div>
	);
}
