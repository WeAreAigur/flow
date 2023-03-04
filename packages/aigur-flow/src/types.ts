import { z } from 'zod';

export interface NodeTree {
	[property: string]: NodeDefinition | NodeTree;
}

export interface NodeDefinition {
	title: string;
	id: string;
	type: NodeDefinitionType;
	subtype?: string;
	definitionLabel?: string;
	action?: any;
	schema: {
		input?: z.AnyZodObject;
		output?: z.AnyZodObject | ZodReadableStream;
	};
}

export interface NodeInstance extends NodeDefinition {
	tag: string;
}

export type NodeDefinitionType = string; //'generic' | 'pipeline-input' | 'pipeline-output' | 'provider';

export interface FlowPipeline {
	nodes: {
		id: string;
		data: NodeInstance;
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
	id: string;
	input: Record<string, any>;
	nodes: any[];
}

export type NodesIO = Record<
	string,
	{
		input: Record<string, string>;
		output: Record<string, string>;
	}
>;

export type ZodReadableStream = z.ZodType<
	InstanceType<typeof ReadableStream>,
	z.ZodTypeDef,
	InstanceType<typeof ReadableStream>
>;
