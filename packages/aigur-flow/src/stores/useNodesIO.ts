import { create } from 'zustand';

import { NodeIODefinition, NodesIO } from '../types';

const removeKey = (key: string, { [key]: _, ...rest }) => rest;

interface NodesIOState {
	io: NodesIO;
	setNodeIO: (nodeId: string, io: NodeIODefinition) => void;
	deleteNodeIO: (nodeId: string) => void;
	initIO: (io: NodesIO) => void;
}

export const useNodesIOStore = create<NodesIOState>((set) => ({
	io: {},
	initIO: (io) => set({ io }),
	setNodeIO: (nodeId, io) =>
		set((state) => ({ io: { ...state.io, [nodeId]: { ...state.io[nodeId], ...io } } })),
	deleteNodeIO: (nodeId) => set((state) => ({ io: removeKey(nodeId, state.io) })),
}));
