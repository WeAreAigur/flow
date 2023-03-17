import { ReactFlowInstance } from 'reactflow';
import { create } from 'zustand';

interface FlowState {
	currentFlow: ReactFlowInstance<any, any> | null;
	setFlow: (flow: ReactFlowInstance<any, any>) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
	currentFlow: null,
	setFlow: (flow) => set((state) => ({ currentFlow: flow })),
}));
