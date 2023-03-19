import {
	inputSchema as gpt4InputSchema,
	name as gpt4Prediction,
	outputSchema as gpt4OutputSchema,
} from '@aigur/client/src/nodes/text/prediction/gpt4';

import { createNodeDefinition } from '../createNodeDefinition';

export const gpt4PredictionNode = createNodeDefinition({
	action: gpt4Prediction,
	inputSchema: gpt4InputSchema,
	outputSchema: gpt4OutputSchema,
	title: 'GPT-4 Prediction',
	definitionLabel: 'GPT-4',
	type: 'provider',
});
gpt4PredictionNode.getRequiredFields = (input) => {
	return input.filter((i) => i.property === 'messages');
};
gpt4PredictionNode.createNodeInput = (outputField, sourceNodeIndex) => {
	return {
		messages: [
			{
				role: 'user',
				content: `$context.${sourceNodeIndex}.${outputField.property}$`,
			},
		],
	};
};
