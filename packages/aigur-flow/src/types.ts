import { ZTO_Base } from 'zod-to-obj';
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
	getRequiredFields?: (input: ZTO_Base[]) => ZTO_Base[];
	createNodeInput?: (outputField: ZTO_Base, sourceNodeIndex: number) => any;
}

export interface NodeInstance extends NodeDefinition {
	tag: string;
}

export type NodeDefinitionType = string; //'generic' | 'pipeline-input' | 'pipeline-output' | 'provider';

export interface PipelineData {
	id: string;
	input: Record<string, any>;
	nodes: any[];
}

export type NodesIO = Record<string, NodeIODefinition>;

export type NodeIODefinition = {
	type?: string;
	subType?: string;
	input: Record<string, string>;
	output: Record<string, string>;
};

export type ZodReadableStream = z.ZodType<
	InstanceType<typeof ReadableStream>,
	z.ZodTypeDef,
	InstanceType<typeof ReadableStream>
>;
