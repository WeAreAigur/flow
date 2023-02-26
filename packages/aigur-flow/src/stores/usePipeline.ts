import { create } from 'zustand';

import { Pipeline } from '@aigur/client';

interface PipelineState {
	selectedPipeline: Pipeline<any, any, any>;
	selectPipeline: (pipeline: Pipeline<any, any, any>) => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
	selectedPipeline: null,
	selectPipeline: (pipeline) => set((state) => ({ selectedPipeline: pipeline })),
}));
