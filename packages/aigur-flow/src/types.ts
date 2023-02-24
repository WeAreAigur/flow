export interface NodeDefinitions {
	[property: string]: NodeDefinition | NodeDefinitions;
}

export interface NodeDefinition {
	title: string;
	id: string;
}
