import {
	inputSchema as googleImageInputSchema,
	name as googleImageLabeling,
	outputSchema as googleImageOutputSchema,
} from '@aigur/client/src/nodes/image/labeling/googleImageLabeling';

import { createNodeDefinition } from '../createNodeDefinition';

export const googleImageLabelingNode = createNodeDefinition({
	action: googleImageLabeling,
	inputSchema: googleImageInputSchema,
	outputSchema: googleImageOutputSchema,
	title: 'Google Image Labeling',
	definitionLabel: 'Google',
	type: 'provider',
});
