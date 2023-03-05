export interface LogoProps {
	size?: 'md' | 'lg' | 'xl';
}

export function Logo(props: LogoProps) {
	return (
		<span className={'font-bold text-2xl'}>
			<span className="text-primary">AI</span>GUR
		</span>
	);
}
