import { UseFormRegister } from 'react-hook-form';

import { Option, ValueMenu } from './ValueMenu';

export interface ValueFieldProps {
	name: string;
	register: UseFormRegister<any>;
	type: 'ZodString' | 'ZodNumber' | 'ZodBoolean';
	options: Option[];
	setValue: (name: string, value: string) => void;
	className?: string;
}

export function ValueField(props: ValueFieldProps) {
	function getInputType() {
		switch (props.type) {
			case 'ZodString':
				return 'text';
			case 'ZodNumber':
				return 'number';
			case 'ZodBoolean':
				return 'checkbox';
		}
	}
	return (
		<>
			<input
				type={getInputType()}
				name={props.name}
				{...props.register(props.name, {
					onChange: (e) => {
						if (props.type === 'ZodNumber') {
							const output = parseInt(e.target.value, 10);
							console.log(`***output`, props.name, output);
							return isNaN(output) ? undefined : output;
						}
						return e.target.value;
					},
				})}
				className="col-span-3 border-r-0 rounded-tr-none rounded-br-none input input-bordered"
			/>
			<ValueMenu
				options={props.options}
				onChange={(values: string[]) => props.setValue(props.name, `$context.${values.join('.')}$`)}
			/>
		</>
	);
}
