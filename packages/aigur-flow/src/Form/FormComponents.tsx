export interface InputProps {
	register?: any;
	name: string;
	[key: string]: any;
}

export function Input({ register, name, ...rest }: InputProps) {
	return <input {...register(name)} {...rest} />;
}

export interface SelectProps {
	register?: any;
	name: string;
	options: string[];
	[key: string]: any;
}

export function Select({ register, options, name, ...rest }: SelectProps) {
	return (
		<select {...register(name)} {...rest}>
			{options.map((value) => (
				<option key={value} value={value}>
					{value}
				</option>
			))}
		</select>
	);
}
