import { create } from 'zustand';

interface FlowState {
	currentFlow: any;
	setFlow: (flow: any) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
	currentFlow: null,
	setFlow: (flow) => set((state) => ({ currentFlow: flow })),
}));
