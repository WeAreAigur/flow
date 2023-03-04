export interface ZTO_Base {
	property: string;
	type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';
	subType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';
	defaultValue?: any;
	required: boolean;
}

export interface ZTO_Object extends ZTO_Base {
	properties: ZTO_Base[];
}

export interface ZTO_Enum extends ZTO_Base {
	possibleValues: string[];
}
