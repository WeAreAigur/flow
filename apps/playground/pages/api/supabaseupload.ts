import { NextRequest, NextResponse } from 'next/server';

import { supabaseUpload } from '@aigur/supabase';
import { stringToArrayBuffer } from '@aigur/client/src';

export default async function upload(req: NextRequest) {
	const { audio } = await req.json();
	const { arrayBuffer } = await stringToArrayBuffer({ string: audio });
	const { url } = await supabaseUpload({
		bucket: 'flow',
		file: arrayBuffer,
		name: makeid(),
		extension: 'mp3',
		supabaseUrl: process.env.SUPABASE_URL!,
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
	});

	return NextResponse.json({ url });
}

export const config = {
	runtime: 'edge',
};

function makeid(length: number = 16) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
