import {
	name as gpt3Prediction,
	outputSchema as gpt3OutputSchema,
	rawInputSchema as gpt3InputSchema,
} from '@aigur/client/src/nodes/text/prediction/gpt3';

import { createNodeDefinition } from '../createNodeDefinition';

export const gpt3PredictionNode = createNodeDefinition({
	action: gpt3Prediction,
	inputSchema: gpt3InputSchema,
	outputSchema: gpt3OutputSchema,
	title: 'GPT-3 Prediction',
	definitionLabel: 'GPT-3',
	type: 'provider',
});
