import { create } from 'zustand';

import { NodesIO } from '../types';

interface NodesIOState {
	io: NodesIO;
	setNodeIO: (
		nodeId: string,
		io: { input: Record<string, string>; output: Record<string, string> }
	) => void;
	deleteNodeIO: (nodeId: string) => void;
}

export const useNodesIOStore = create<NodesIOState>((set) => ({
	io: {},
	setNodeIO: (nodeId, io) => set((state) => ({ io: { ...state.io, [nodeId]: io } })),
	deleteNodeIO: (nodeId) => set((state) => ({ io: { ...state.io, [nodeId]: undefined } })),
}));
