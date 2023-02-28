import { Option, ValueMenu } from './ValueMenu';

export interface ValueFieldProps {
	name: string;
	register: any;
	options: Option[];
	setValue: (name: string, value: string) => void;
	className?: string;
}

export function ValueField(props: ValueFieldProps) {
	return (
		<>
			<input type="text" name={props.name} {...props.register(props.name)} className="col-span-3" />
			<ValueMenu
				options={props.options}
				onChange={(values: string[]) => props.setValue(props.name, `$context.${values.join('.')}$`)}
			/>
		</>
	);
}
