import { NextRequest, NextResponse } from 'next/server';

import { supabaseUpload } from '@aigur/supabase';

export default async function upload(req: NextRequest) {
	const { arrayBuffer, extension } = await req.json();
	console.log(`***arrayBuffer`, arrayBuffer);
	console.log(`uploading to supabase`, { extension });
	const { url } = await supabaseUpload({
		bucket: 'flow',
		file: arrayBuffer,
		name: makeid(),
		extension,
		supabaseUrl: process.env.SUPABASE_URL!,
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
	});

	console.log(`uploaded to supabase`, { url });

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
