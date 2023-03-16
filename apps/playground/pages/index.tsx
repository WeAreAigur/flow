import { Logo } from '#/components/Logo';
import { getUserId } from '#/services/user';

import { AigurFlow } from '@aigur/flow';

export default function Web() {
	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<div className="px-4 py-2">
				<Logo />
			</div>
			<AigurFlow userId={getUserId()} />
		</div>
	);
}
