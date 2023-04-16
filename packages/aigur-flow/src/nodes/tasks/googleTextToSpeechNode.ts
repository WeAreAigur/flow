import {
    inputSchema as googleTextToSpeechInputSchema, name as googleTextToSpeechLabeling,
    outputSchema as googleTextToSpeechOutputSchema
} from '@aigur/client/src/nodes/voice/textToSpeech/googleTextToSpeech';

import { createNodeDefinition } from '../createNodeDefinition';

export const googleTextToSpeechNode = createNodeDefinition({
	action: googleTextToSpeechLabeling,
	inputSchema: googleTextToSpeechInputSchema,
	outputSchema: googleTextToSpeechOutputSchema,
	title: 'Google Text to Speech',
	definitionLabel: 'Google',
	type: 'provider',
});
