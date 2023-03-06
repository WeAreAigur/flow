import { create } from 'zustand';

interface UserState {
	userId: string;
	setUserId: (userId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
	userId: '',
	setUserId: (userId) => set((state) => ({ userId })),
}));
