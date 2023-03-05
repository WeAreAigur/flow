import { makeid } from '#/utils/makeid';
import { z } from 'zod';

import {
	inputSchema as stabilityInputSchema,
	stabilityTextToImage,
} from '@aigur/client/src/nodes/image/textToImage/stability';
import { supabaseUpload } from '@aigur/supabase';

export async function stabilityTextToImageAigur(
	input: z.input<typeof stabilityInputSchema>,
	apiKeys: Record<string, string>
) {
	console.log('generating image');
	const { result } = await stabilityTextToImage(input, apiKeys);
	console.log('generated image');
	const { url } = await supabaseUpload({
		bucket: 'flow',
		extension: 'png',
		file: result,
		name: makeid(),
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
		supabaseUrl: process.env.SUPABASE_URL!,
	});

	console.log('uploaded image', { url });

	return { url };
}
