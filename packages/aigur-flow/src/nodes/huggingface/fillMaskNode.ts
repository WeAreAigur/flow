import {
	inputSchema as fillMaskInputSchema,
	name as fillMask,
	outputSchema as fillMaskOutputSchema,
} from '@aigur/client/src/nodes/huggingface/fillMask';

import { createNodeDefinition } from '../createNodeDefinition';

export const fillMaskNode = createNodeDefinition({
	action: fillMask,
	inputSchema: fillMaskInputSchema,
	outputSchema: fillMaskOutputSchema,
	title: 'Fill Mask',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
