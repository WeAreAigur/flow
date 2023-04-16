import { makeid } from '@aigur/client/src/makeid';

import { upperFirst } from '../utils/stringUtils';
import { NodeDefinition } from '../types';

let nodeCnt = 0;

export function createNode(
	nodeDefinition: NodeDefinition,
	position: { x: number; y: number }
): any {
	const newNode = {
		id: `${nodeDefinition.id}@@${nodeCnt++}`,
		type: `${nodeDefinition.type}${upperFirst(nodeDefinition.subtype ?? '')}`,
		subType: nodeDefinition.subtype,
		position,
		data: { ...nodeDefinition, tag: makeid() },
	};
	return newNode;
}
