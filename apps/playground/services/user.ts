import { makeid } from '#/utils/makeid';

export function getUserId() {
	if (typeof window === 'undefined') {
		return '';
	}
	let userId = localStorage.getItem('@aigur/userId');
	if (!userId) {
		userId = makeid();
		localStorage.setItem('@aigur/userId', userId);
	}

	return userId;
}
