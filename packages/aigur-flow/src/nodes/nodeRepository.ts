import { whisperApiNode } from './tasks/whisperApiNode';
import { stabilityTextToImageNode } from './tasks/stabilityTextToImageNode';
import { gpt4PredictionNode } from './tasks/gpt4PredictionNode';
import { gpt3PredictionNode } from './tasks/gpt3PredictionNode';
import { googleTextToSpeechNode } from './tasks/googleTextToSpeechNode';
import { googleImageLabelingNode } from './tasks/googleImageLabelingNode';
import { outputTextNode } from './output/outputTextNode';
import { outputImageNode } from './output/outputImageNode';
import { outputCustomNode } from './output/outputCustomNode';
import { outputAudioNode } from './output/outputAudioNode';
import { inputTextNode } from './input/inputTextNode';
import { inputImageNode } from './input/inputImageNode';
import { inputCustomNode } from './input/inputCustomNode';
import { inputAudioNode } from './input/inputAudioNode';
import {
    audioClassificationNode, automaticSpeechRecognitionNode, conversationalNode,
    featureExtractionNode, fillMaskNode, imageClassificationNode, imageSegmentationNode,
    objectDetectionNode, questionAnswerNode, summarizationNode, tableQuestionAnswerNode,
    textClassificationNode, textGenerationNode, textToImageNode, tokenClassificationNode,
    translationNode, zeroShotClassificationNode
} from './huggingface';
import { NodeDefinition } from '../types';

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
	googleTextToSpeech: googleTextToSpeechNode,
	stabilityTextToImage: stabilityTextToImageNode,
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
