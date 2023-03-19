import {
	inputSchema as whisperInputSchema,
	name as whisperApi,
	outputSchema as whisperOutputSchema,
} from '@aigur/client/src/nodes/voice/transcribe/whisper/whisperapi';

import { createNodeDefinition } from '../createNodeDefinition';

export const whisperApiNode = createNodeDefinition({
	action: whisperApi,
	inputSchema: whisperInputSchema,
	outputSchema: whisperOutputSchema,
	title: 'Whisper',
	definitionLabel: 'Whisper',
	type: 'provider',
});
