import { NodeBank } from './NodeBank';
import { NodeEditor } from './NodeEditor';

export function AigurFlow() {
	return (
		<div className="aigur-flow h-full flex">
			<div className="h-full w-1/4">
				<NodeBank
					nodeDefinitions={{
						Pipeline: {
							input: {
								title: 'Pipeline Input',
								id: 'input',
							},
							output: {
								title: 'Pipeline Output',
								id: 'output',
							},
						},
						Text: {
							Prediction: {
								gpt3: {
									title: 'GPT-3',
									id: 'gpt3',
								},
							},
						},
					}}
				/>
			</div>
			<div className="flex-1">
				<NodeEditor />
			</div>
		</div>
	);
}
