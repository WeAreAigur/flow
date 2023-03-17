import { create } from 'zustand';

import { Pipeline } from '@aigur/client/src';

interface PipelineState {
	selectedPipeline: Pipeline<any, any, any> | null;
	selectPipeline: (pipeline: Pipeline<any, any, any>) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
	selectedPipeline: null,
	selectPipeline: (pipeline) => set((state) => ({ selectedPipeline: pipeline })),
}));
