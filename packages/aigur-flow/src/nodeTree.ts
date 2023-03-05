import { nodeRepository } from './nodeRepository';
import { TreeData } from './NodeBank';

export const nodeTree: TreeData = [
	{
		title: 'Pipeline',
		key: 'pipeline',
		children: [
			{
				title: 'Input',
				key: 'input',
				children: [
					// {
					// 	title: nodeRepository.inputCustom.title,
					// 	key: nodeRepository.inputCustom.id,
					// },
					{
						title: nodeRepository.inputText.title,
						key: nodeRepository.inputText.id,
					},
					{
						title: nodeRepository.inputAudio.title,
						key: nodeRepository.inputAudio.id,
					},
				],
			},
			{
				title: 'Output',
				key: 'output',
				children: [
					// {
					// 	title: nodeRepository.outputCustom.title,
					// 	key: nodeRepository.outputCustom.id,
					// },
					{
						title: nodeRepository.outputText.title,
						key: nodeRepository.outputText.id,
					},
					{
						title: nodeRepository.outputAudio.title,
						key: nodeRepository.outputAudio.id,
					},
					{
						title: nodeRepository.outputImage.title,
						key: nodeRepository.outputImage.id,
					},
				],
			},
		],
	},
	{
		title: 'Text',
		key: 'text',
		children: [
			{
				title: nodeRepository.gpt3Prediction.title,
				key: nodeRepository.gpt3Prediction.id,
			},
		],
	},
	{
		title: 'Image',
		key: 'image',
		children: [
			{
				title: 'Text to Image',
				key: 'textToImage',
				children: [
					{
						title: nodeRepository.stabilityTextToImageAigur.title,
						key: nodeRepository.stabilityTextToImageAigur.id,
					},
				],
			},
			{
				title: 'Labeling',
				key: 'labeling',
				children: [
					{
						title: nodeRepository.googleImageLabeling.title,
						key: nodeRepository.googleImageLabeling.id,
					},
				],
			},
		],
	},
	{
		title: 'Voice',
		key: 'voice',
		children: [
			{
				title: nodeRepository.whisperApi.title,
				key: nodeRepository.whisperApi.id,
			},
		],
	},
];
