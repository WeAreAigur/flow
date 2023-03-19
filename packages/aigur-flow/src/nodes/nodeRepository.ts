import { NodeDefinition } from '../types';
import {
	audioClassificationNode,
	automaticSpeechRecognitionNode,
	conversationalNode,
	featureExtractionNode,
	fillMaskNode,
	imageClassificationNode,
	imageSegmentationNode,
	objectDetectionNode,
	questionAnswerNode,
	summarizationNode,
	tableQuestionAnswerNode,
	textClassificationNode,
	textGenerationNode,
	textToImageNode,
	tokenClassificationNode,
	translationNode,
	zeroShotClassificationNode,
} from './huggingface';
import { inputAudioNode } from './input/inputAudioNode';
import { inputCustomNode } from './input/inputCustomNode';
import { inputImageNode } from './input/inputImageNode';
import { inputTextNode } from './input/inputTextNode';
import { outputAudioNode } from './output/outputAudioNode';
import { outputCustomNode } from './output/outputCustomNode';
import { outputImageNode } from './output/outputImageNode';
import { outputTextNode } from './output/outputTextNode';
import { googleImageLabelingNode } from './tasks/googleImageLabelingNode';
import { gpt3PredictionNode } from './tasks/gpt3PredictionNode';
import { gpt4PredictionNode } from './tasks/gpt4PredictionNode';
import { stabilityTextToImageNode } from './tasks/stabilityTextToImageNode';
import { whisperApiNode } from './tasks/whisperApiNode';

export const nodeRepository = {
	/// input
	inputCustom: inputCustomNode,
	inputText: inputTextNode,
	inputImage: inputImageNode,
	inputAudio: inputAudioNode,
	/// output
	outputCustom: outputCustomNode,
	outputText: outputTextNode,
	outputAudio: outputAudioNode,
	outputImage: outputImageNode,
	/// nodes
	gpt3Prediction: gpt3PredictionNode,
	gpt4Prediction: gpt4PredictionNode,
	whisperApi: whisperApiNode,
	googleImageLabeling: googleImageLabelingNode,
	stabilityTextToImageAigur: stabilityTextToImageNode,
	/// huggingface
	translation: translationNode,
	audioClassification: audioClassificationNode,
	automaticSpeechRecognition: automaticSpeechRecognitionNode,
	conversational: conversationalNode,
	featureExtraction: featureExtractionNode,
	fillMask: fillMaskNode,
	imageClassification: imageClassificationNode,
	imageSegmentation: imageSegmentationNode,
	objectDetection: objectDetectionNode,
	questionAnswer: questionAnswerNode,
	summarization: summarizationNode,
	tableQuestionAnswer: tableQuestionAnswerNode,
	textClassification: textClassificationNode,
	textGeneration: textGenerationNode,
	textToImage: textToImageNode,
	tokenClassification: tokenClassificationNode,
	zeroShotClassification: zeroShotClassificationNode,
} as const satisfies Record<string, NodeDefinition>;
