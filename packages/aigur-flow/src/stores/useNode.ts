import { create } from 'zustand';

interface NodeState {
	selectedNode: any;
	selectNode: (node: any) => void;
}

export const useNodeStore = create<NodeState>((set) => ({
	selectedNode: null,
	selectNode: (node) => set((state) => ({ selectedNode: node })),
}));
