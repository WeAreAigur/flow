import React from 'react';
import { useForm } from 'react-hook-form';

export interface FormProps {
	defaultValues?: any;
	children: React.ReactNode;
	onSubmit: (data: any) => void;
}

export default function Form(props: FormProps) {
	const methods = useForm({ defaultValues: props.defaultValues });
	const { handleSubmit } = methods;

	return (
		<form onSubmit={handleSubmit(props.onSubmit)}>
			{React.Children.map(props.children, (child: any) => {
				return child.props.name
					? React.createElement(child.type, {
							...{
								...child.props,
								register: methods.register,
								key: child.props.name,
							},
					  })
					: child;
			})}
		</form>
	);
}
