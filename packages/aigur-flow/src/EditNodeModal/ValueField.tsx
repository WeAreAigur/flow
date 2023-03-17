import { UseFormRegister } from 'react-hook-form';

import { Option, ValueMenu } from './ValueMenu';

export interface ValueFieldProps {
	name: string;
	register: UseFormRegister<any>;
	type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';
	options: Option[];
	setValue: (name: string, value: string) => void;
	className?: string;
}

export function ValueField(props: ValueFieldProps) {
	function getInputType() {
		switch (props.type) {
			case 'string':
				return 'text';
			case 'number':
				return 'number';
			case 'boolean':
				return 'checkbox';
		}
	}
	return (
		<div>
			<input
				type={getInputType()}
				{...props.register(props.name, {
					onChange: (e) => {
						if (props.type === 'number') {
							const output = parseInt(e.target.value, 10);
							return isNaN(output) ? undefined : output;
						}
						return e.target.value;
					},
				})}
				name={props.name}
				className="col-span-3 border-r-0 rounded-tr-none rounded-br-none input input-bordered input-sm"
			/>
			<ValueMenu
				options={props.options}
				onChange={(values: string[]) => props.setValue(props.name, `$context.${values.join('.')}$`)}
			/>
		</div>
	);
}
