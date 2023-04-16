export interface OutputPanelProps {
	output: Record<string, any> | null;
}

export function OutputPanel(props: OutputPanelProps) {
	function getTypedOutputPanel() {
		if (props.output === null) {
			return null;
		}
		if (props.output.text) {
			return <TextOutputPanel output={props.output} />;
		}
	}

	return (
		<div className="flex flex-col space-y-2">
			<div className="text-xl">Output</div>
			{getTypedOutputPanel()}
		</div>
	);
}

function TextOutputPanel(props: OutputPanelProps) {
	return (
		<textarea
			className="w-full h-24 textarea textarea-bordered"
			name="text"
			value={props.output ? props.output['text'] : ''}
		/>
	);
}
