import { useCallback } from 'react';
import { Edge, useStoreApi } from 'reactflow';
import { isZTOArray, isZTOObject, zodToObj, ZTO_Base } from 'zod-to-obj';

import { nodeRepository } from '../nodes/nodeRepository';
import { useFlowStore } from '../stores/useFlow';
import { useNodesIOStore } from '../stores/useNodesIO';
import { getPreviousNodes } from '../utils/getPreviousNodes';

export function useConnectNodesProperties() {
	const store = useStoreApi();
	const currentFlow = useFlowStore((state) => state.currentFlow);
	const setNodeIO = useNodesIOStore((state) => state.setNodeIO);
	const connect = useCallback(
		function connect(edge: Edge<any>) {
			if (!currentFlow) {
				return;
			}
			const { nodeInternals } = store.getState();
			const sourceNode = nodeInternals.get(edge.source);
			const targetNode = nodeInternals.get(edge.target);
			if (!sourceNode || !targetNode) {
				return;
			}
			const targetRepositoryNode = (nodeRepository as any)[targetNode.data.id];
			const targetInputFields = zodToObj(targetNode.data.schema.input);
			const targetRequiredInputFields = getRequiredInputFields();
			if (targetRequiredInputFields.length !== 1) {
				return;
			}

			const inputType = getRequiredFieldType(targetRequiredInputFields[0]);
			const sourceOutputFields = zodToObj(sourceNode.data.schema.output);
			const filteredOutputFields = getOutputFieldsByType();

			if (filteredOutputFields.length !== 1) {
				return;
			}

			const previousNodes = getPreviousNodes(targetNode.id, currentFlow.toObject());
			const sourceNodeIndex = previousNodes.length - 2 < 0 ? 'input' : previousNodes.length - 2;
			const input = targetRepositoryNode?.createNodeInput
				? targetRepositoryNode?.createNodeInput(filteredOutputFields[0], sourceNodeIndex)
				: getRequiredInput(targetRequiredInputFields[0], filteredOutputFields[0], sourceNodeIndex);
			setNodeIO(targetNode.id, {
				input,
				output: {},
			});

			function getOutputFieldsByType() {
				// TODO: create a data structure of types to acceptedTypes
				return sourceOutputFields.filter(
					(field) => field.type === inputType || (field.type === 'array' && inputType === 'string')
				);
			}

			function getRequiredInputFields() {
				if (targetRepositoryNode?.getRequiredFields) {
					return targetRepositoryNode?.getRequiredFields(targetInputFields);
				}

				return targetInputFields.filter((field) => {
					if (isZTOArray(field) && field.subType === 'object') {
						const requiredFields = field.properties.filter((prop) => prop.required); // if there is more than one required field, we can't auto connect it

						return requiredFields.length === 1;
					}

					return field.required;
				});
			}

			function getRequiredFieldType(requiredInputField: ZTO_Base) {
				if (
					isZTOObject(requiredInputField) ||
					(isZTOArray(requiredInputField) && requiredInputField.subType === 'object')
				) {
					return requiredInputField.properties.find((prop) => prop.required)?.type;
				}

				return requiredInputField.type;
			}

			function getRequiredInput(
				targetField: ZTO_Base,
				outputField: ZTO_Base,
				sourceNodeIndex: number | string
			): any {
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
