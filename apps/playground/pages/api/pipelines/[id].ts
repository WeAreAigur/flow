import { NextRequest } from 'next/server';

import { createAblyNotifier } from '@aigur/ably';
import { Pipeline, vercelEdgeFunction } from '@aigur/client';

const ably = createAblyNotifier(
	process.env.ABLY_KEY!,
	process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!,
	'aigur-flow'
);

export default async function genericEdgeFunction(req: NextRequest) {
	const pipe = await req.clone().json();
	pipe.nodes = await Promise.all(
		pipe.nodes.map(async (node: any) => ({
			...node,
			action: await getAction(node.action),
		}))
	);
	const flow: any = {
		getNodes: () => pipe.nodes,
	};
	const pipeline = new Pipeline<any, any, any>(
		{
			...pipe,
			eventListener: ably.eventListener,
			eventPublisher: ably.eventPublisher,
			updateProgress: true,
		} as any,
		flow,
		{
			openai: process.env.OPENAI_KEY!,
		}
	);
	return vercelEdgeFunction({ [pipe.id]: pipeline })(req);
}

export const config = {
	runtime: 'edge',
};

async function getAction(nodeId: string) {
	return import('@aigur/client').then((mod) => mod[nodeId]);
}
