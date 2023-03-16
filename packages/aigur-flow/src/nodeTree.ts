import { TreeData } from './NodeBank';
import { nodeRepository } from './nodeRepository';

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
		title: 'HuggingFace',
		key: 'huggingFace',
		children: [
			{
				title: 'Text',
				key: 'text',
				children: [
					{
						title: nodeRepository.translation.title,
						key: nodeRepository.translation.id,
					},
					{
						title: nodeRepository.conversational.title,
						key: nodeRepository.conversational.id,
					},
					{
						title: nodeRepository.featureExtraction.title,
						key: nodeRepository.featureExtraction.id,
					},
					{
						title: nodeRepository.fillMask.title,
						key: nodeRepository.fillMask.id,
					},
					{
						title: nodeRepository.questionAnswer.title,
						key: nodeRepository.questionAnswer.id,
					},
					{
						title: nodeRepository.summarization.title,
						key: nodeRepository.summarization.id,
					},
					{
						title: nodeRepository.tableQuestionAnswer.title,
						key: nodeRepository.tableQuestionAnswer.id,
					},
					{
						title: nodeRepository.textClassification.title,
						key: nodeRepository.textClassification.id,
					},
					{
						title: nodeRepository.textGeneration.title,
						key: nodeRepository.textGeneration.id,
					},
					{
						title: nodeRepository.textToImage.title,
						key: nodeRepository.textToImage.id,
					},
					{
						title: nodeRepository.tokenClassification.title,
						key: nodeRepository.tokenClassification.id,
					},
					{
						title: nodeRepository.zeroShotClassification.title,
						key: nodeRepository.zeroShotClassification.id,
					},
				],
			},
			{
				title: 'Audio',
				key: 'audio',
				children: [
					{
						title: nodeRepository.audioClassification.title,
						key: nodeRepository.audioClassification.id,
					},
					{
						title: nodeRepository.automaticSpeechRecognition.title,
						key: nodeRepository.automaticSpeechRecognition.id,
					},
				],
			},
			{
				title: 'Image',
				key: 'image',
				children: [
					{
						title: nodeRepository.imageClassification.title,
						key: nodeRepository.imageClassification.id,
					},
					{
						title: nodeRepository.imageSegmentation.title,
						key: nodeRepository.imageSegmentation.id,
					},
					{
						title: nodeRepository.objectDetection.title,
						key: nodeRepository.objectDetection.id,
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
