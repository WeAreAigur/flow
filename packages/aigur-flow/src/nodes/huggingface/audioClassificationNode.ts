import {
	inputSchema as audioClassificationInputSchema,
	name as audioClassification,
	outputSchema as audioClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/audioClassification';

import { createNodeDefinition } from '../createNodeDefinition';

export const audioClassificationNode = createNodeDefinition({
	action: audioClassification,
	inputSchema: audioClassificationInputSchema,
	outputSchema: audioClassificationOutputSchema,
	title: 'Audio Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
