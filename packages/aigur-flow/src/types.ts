export interface NodeDefinitions {
	[property: string]: NodeDefinition | NodeDefinitions;
}

export interface NodeDefinition {
	title: string;
	id: string;
	type: NodeDefinitionType;
	definitionLabel?: string;
	action?: any;
	input?: Record<string, string>;
	output?: Record<string, string> | 'Stream';
}

export type NodeDefinitionType = 'generic' | 'pipeline-input' | 'pipeline-output' | 'provider';

export interface FlowPipeline {
	nodes: {
		id: string;
		data: NodeDefinition;
	}[];
	edges: {
		id: string;
		source: string;
		target: string;
		sourceHandle: string;
		targetHandle: string;
	}[];
}

export interface PipelineData {
	nodes: any[];
}

export type NodesIO = Record<
	string,
	{
		input: Record<string, string>;
		output: Record<string, string>;
	}
>;
