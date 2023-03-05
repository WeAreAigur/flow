import { makeid } from '@aigur/client/src/makeid';

import { NodeDefinition } from '../types';
import { upperFirst } from '../utils/stringUtils';

let nodeCnt = 0;

export function createNode(
	nodeDefinition: NodeDefinition,
	position: { x: number; y: number }
): any {
	const newNode = {
		id: `${nodeDefinition.id}@@${nodeCnt++}`,
		type: `${nodeDefinition.type}${upperFirst(nodeDefinition.subtype ?? '')}`,
		position,
		data: { ...nodeDefinition, tag: makeid() },
	};
	return newNode;
}
