import { getUserId } from '#/services/user';
import { Logo } from '#/components/Logo';

import { AigurFlow } from '@aigur/flow';

export default function Web() {
	return (
		<div className="flex flex-col h-full">
			<div className="px-4 py-2">
				<Logo />
			</div>
			<AigurFlow userId={getUserId()} />
		</div>
	);
}
