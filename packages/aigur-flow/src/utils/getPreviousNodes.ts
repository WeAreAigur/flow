export function getPreviousNodes(nodeId: string, currentFlow) {
	const previousNodes = [];
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
