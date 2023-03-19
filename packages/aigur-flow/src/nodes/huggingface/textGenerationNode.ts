import {
	inputSchema as textGenerationInputSchema,
	name as textGeneration,
	outputSchema as textGenerationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textGeneration';

import { createNodeDefinition } from '../createNodeDefinition';

export const textGenerationNode = createNodeDefinition({
	action: textGeneration,
	inputSchema: textGenerationInputSchema,
	outputSchema: textGenerationOutputSchema,
	title: 'Text Generation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
