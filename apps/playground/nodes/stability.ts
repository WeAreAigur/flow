import { z } from 'zod';
import { makeid } from '#/utils/makeid';

import { supabaseUpload } from '@aigur/supabase';
import {
	inputSchema as stabilityInputSchema,
	stabilityTextToImage,
} from '@aigur/client/src/nodes/image/textToImage/stability';

export async function stabilityTextToImageAigur(
	input: z.input<typeof stabilityInputSchema>,
	apiKeys: Record<string, string>
) {
	const { result } = await stabilityTextToImage(input, apiKeys);
	const { url } = await supabaseUpload({
		bucket: 'flow',
		extension: 'png',
		file: result,
		name: makeid(),
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
		supabaseUrl: process.env.SUPABASE_URL!,
	});

	return { url };
}
