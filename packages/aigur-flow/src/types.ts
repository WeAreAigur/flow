export interface NodeDefinitions {
	[property: string]: NodeDefinition | NodeDefinitions;
}

export interface NodeDefinition {
	title: string;
	id: string;
	type: NodeDefinitionType;
	definitionLabel?: string;
}

export type NodeDefinitionType = 'generic' | 'pipeline-input' | 'pipeline-output' | 'provider';
