import { NextRequest, NextResponse } from 'next/server';
import { makeid } from '#/utils/makeid';

import { supabaseUpload } from '@aigur/supabase';
import { stringToArrayBuffer } from '@aigur/client/src';

export default async function uploadtostorage(req: NextRequest) {
	const { file, extension } = await req.json();
	const { arrayBuffer } = await stringToArrayBuffer({ string: file });
	const { url } = await supabaseUpload({
		bucket: 'flow',
		file: arrayBuffer,
		name: makeid(),
		extension,
		supabaseUrl: process.env.SUPABASE_URL!,
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
	});

	return NextResponse.json({ url });
}

export const config = {
	runtime: 'edge',
};
