import { ReactFlowJsonObject } from 'reactflow';

export function getPreviousNodes(nodeId: string, currentFlow: ReactFlowJsonObject<any, any>) {
	const previousNodes = [];
	let _nodeId = nodeId;
	let edge = currentFlow.edges.find((edge) => edge.target === _nodeId);
	if (!edge) {
		return [];
	}
	do {
		const sourceNode = currentFlow.nodes.find((node) => node.id === edge!.source);
		if (!sourceNode) {
			break;
		}
		previousNodes.push(sourceNode);
		_nodeId = sourceNode.id;
		edge = currentFlow.edges.find((edge) => edge.target === _nodeId);
	} while (!!edge);
	return previousNodes;
}
