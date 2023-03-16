import { useCallback } from 'react';
import { Edge, useStoreApi } from 'reactflow';
import { isZTOArray, isZTOObject, zodToObj, ZTO_Base } from 'zod-to-obj';

import { useFlowStore } from '../stores/useFlow';
import { useNodesIOStore } from '../stores/useNodesIO';
import { getPreviousNodes } from '../utils/getPreviousNodes';

export function useConnectNodesProperties() {
	const store = useStoreApi();
	const currentFlow = useFlowStore((state) => state.currentFlow);
	const setNodeIO = useNodesIOStore((state) => state.setNodeIO);

	const connect = useCallback(
		function connect(edge: Edge<any>) {
			const { nodeInternals } = store.getState();

			const sourceNode = nodeInternals.get(edge.source);
			const targetNode = nodeInternals.get(edge.target);

			const targetInputFields = zodToObj(targetNode.data.schema.input);
			const targetRequiredInputFields = targetInputFields.filter((field) => {
				if (isZTOArray(field) && field.subType === 'object') {
					const requiredFields = field.properties.filter((prop) => prop.required);
					// if there is more than one required field, we can't auto connect it
					return requiredFields.length === 1;
				}
				return field.required;
			});

			if (targetRequiredInputFields.length !== 1) {
				return;
			}

			const inputType = getRequiredType(targetRequiredInputFields[0]);

			const sourceOutputFields = zodToObj(sourceNode.data.schema.output);
			const filteredOutputFields = sourceOutputFields.filter((field) => field.type === inputType);

			if (filteredOutputFields.length !== 1) {
				return;
			}

			// {text_input: {text: '$context.0.text$'}}
			const previousNodes = getPreviousNodes(targetNode.id, currentFlow.toObject());
			const sourceNodeIndex = previousNodes.length - 2 < 0 ? 'input' : previousNodes.length - 2;
			setNodeIO(targetNode.id, {
				input: getRequiredInput(
					targetRequiredInputFields[0],
					filteredOutputFields[0],
					sourceNodeIndex
				),
				output: {},
			});

			function getRequiredType(requiredInputField: ZTO_Base) {
				if (
					isZTOObject(requiredInputField) ||
					(isZTOArray(requiredInputField) && requiredInputField.subType === 'object')
				) {
					return requiredInputField.properties.find((prop) => prop.required).type;
				}
				return requiredInputField.type;
			}

			function getRequiredInput(targetField, outputField, sourceNodeIndex) {
				if (isZTOObject(targetField)) {
					return {
						[targetField.property]: getRequiredInput(
							targetField.properties[0],
							outputField,
							sourceNodeIndex
						),
					};
				}
				if (isZTOArray(targetField) && targetField.subType === 'object') {
					return {
						[targetField.property]: [
							getRequiredInput(targetField.properties[0], outputField, sourceNodeIndex),
						],
					};
				}
				return {
					[targetField.property]: `$context.${sourceNodeIndex}.${outputField.property}$`,
				};
			}
		},
		[currentFlow, setNodeIO, store]
	);

	return connect;
}
