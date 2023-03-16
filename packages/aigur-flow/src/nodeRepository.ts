import { z } from 'zod';

import {
	inputSchema as audioClassificationInputSchema,
	name as audioClassification,
	outputSchema as audioClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/audioClassification';
import {
	inputSchema as automaticSpeechRecognitionInputSchema,
	name as automaticSpeechRecognition,
	outputSchema as automaticSpeechRecognitionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/automaticSpeechRecognition';
import {
	inputSchema as conversationalInputSchema,
	name as conversational,
	outputSchema as conversationalOutputSchema,
} from '@aigur/client/src/nodes/huggingface/conversational';
import {
	inputSchema as featureExtractionInputSchema,
	name as featureExtraction,
	outputSchema as featureExtractionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/featureExtraction';
import {
	inputSchema as fillMaskInputSchema,
	name as fillMask,
	outputSchema as fillMaskOutputSchema,
} from '@aigur/client/src/nodes/huggingface/fillMask';
import {
	inputSchema as imageClassificationInputSchema,
	name as imageClassification,
	outputSchema as imageClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/imageClassification';
import {
	inputSchema as imageSegmentationInputSchema,
	name as imageSegmentation,
	outputSchema as imageSegmentationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/imageSegmentation';
import {
	inputSchema as objectDetectionInputSchema,
	name as objectDetection,
	outputSchema as objectDetectionOutputSchema,
} from '@aigur/client/src/nodes/huggingface/objectDetection';
import {
	inputSchema as questionAnswerInputSchema,
	name as questionAnswer,
	outputSchema as questionAnswerOutputSchema,
} from '@aigur/client/src/nodes/huggingface/questionAnswer';
import {
	inputSchema as summarizationInputSchema,
	name as summarization,
	outputSchema as summarizationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/summarization';
import {
	inputSchema as tableQuestionAnswerInputSchema,
	name as tableQuestionAnswer,
	outputSchema as tableQuestionAnswerOutputSchema,
} from '@aigur/client/src/nodes/huggingface/tableQuestionAnswer';
import {
	inputSchema as textClassificationInputSchema,
	name as textClassification,
	outputSchema as textClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textClassification';
import {
	inputSchema as textGenerationInputSchema,
	name as textGeneration,
	outputSchema as textGenerationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textGeneration';
import {
	inputSchema as textToImageInputSchema,
	name as textToImage,
	outputSchema as textToImageOutputSchema,
} from '@aigur/client/src/nodes/huggingface/textToImage';
import {
	inputSchema as tokenClassificationInputSchema,
	name as tokenClassification,
	outputSchema as tokenClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/tokenClassification';
import {
	inputSchema as translationInputSchema,
	name as translation,
	outputSchema as translationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/translation';
import {
	inputSchema as zeroShotClassificationInputSchema,
	name as zeroShotClassification,
	outputSchema as zeroShotClassificationOutputSchema,
} from '@aigur/client/src/nodes/huggingface/zeroShotClassification';
import {
	inputSchema as googleImageInputSchema,
	name as googleImageLabeling,
	outputSchema as googleImageOutputSchema,
} from '@aigur/client/src/nodes/image/labeling/googleImageLabeling';
import { inputSchema as stabilityInputSchema } from '@aigur/client/src/nodes/image/textToImage/stability';
import {
	name as gpt3Prediction,
	outputSchema as gpt3OutputSchema,
	rawInputSchema as gpt3InputSchema,
} from '@aigur/client/src/nodes/text/prediction/gpt3';
import {
	inputSchema as gpt4InputSchema,
	name as gpt4Prediction,
	outputSchema as gpt4OutputSchema,
} from '@aigur/client/src/nodes/text/prediction/gpt4';
import {
	inputSchema as whisperInputSchema,
	name as whisperApi,
	outputSchema as whisperOutputSchema,
} from '@aigur/client/src/nodes/voice/transcribe/whisper/whisperapi';

import { NodeDefinition, NodeDefinitionType, ZodReadableStream } from './types';
import { upperFirst } from './utils/stringUtils';

export const inputCustomNode = createIO({
	type: 'input',
	title: 'Custom Input',
	input: z.object({}),
	subtype: 'custom',
});

export const inputTextNode = createIO({
	type: 'input',
	title: 'Text Input',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});

export const inputAudioNode = createIO({
	type: 'input',
	title: 'Audio Input',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});

export const outputCustomNode = createIO({
	type: 'output',
	title: 'Custom Output',
	input: z.object({}),
	subtype: 'custom',
});

export const outputTextNode = createIO({
	type: 'output',
	title: 'Text Output',
	input: z.object({ text: z.string() }),
	subtype: 'text',
});

export const outputAudioNode = createIO({
	type: 'output',
	title: 'Audio Output',
	input: z.object({ audio: z.string() }),
	subtype: 'audio',
});

export const outputImageNode = createIO({
	type: 'output',
	title: 'Image Output',
	input: z.object({ imageUrl: z.string() }),
	subtype: 'image',
});

export const gpt3PredictionNode = createNodeDefinition({
	action: gpt3Prediction,
	inputSchema: gpt3InputSchema,
	outputSchema: gpt3OutputSchema,
	title: 'GPT-3 Prediction',
	definitionLabel: 'GPT-3',
	type: 'provider',
});
export const gpt4PredictionNode = createNodeDefinition({
	action: gpt4Prediction,
	inputSchema: gpt4InputSchema,
	outputSchema: gpt4OutputSchema,
	title: 'GPT-4 Prediction',
	definitionLabel: 'GPT-4',
	type: 'provider',
});

export const whisperApiNode = createNodeDefinition({
	action: whisperApi,
	inputSchema: whisperInputSchema,
	outputSchema: whisperOutputSchema,
	title: 'Whisper',
	definitionLabel: 'Whisper',
	type: 'provider',
});

export const googleImageLabelingNode = createNodeDefinition({
	action: googleImageLabeling,
	inputSchema: googleImageInputSchema,
	outputSchema: googleImageOutputSchema,
	title: 'Google Image Labeling',
	definitionLabel: 'Google',
	type: 'provider',
});

export const stabilityTextToImageNode = createNodeDefinition({
	action: 'stabilityTextToImageAigur',
	inputSchema: stabilityInputSchema,
	outputSchema: z.object({ url: z.string() }),
	title: 'Stability Text to Image',
	definitionLabel: 'Stability',
	type: 'provider',
});

/// hugging face
export const translationNode = createNodeDefinition({
	action: translation,
	inputSchema: translationInputSchema,
	outputSchema: translationOutputSchema,
	title: 'Translation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});

export const audioClassificationNode = createNodeDefinition({
	action: audioClassification,
	inputSchema: audioClassificationInputSchema,
	outputSchema: audioClassificationOutputSchema,
	title: 'Audio Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const automaticSpeechRecognitionNode = createNodeDefinition({
	action: automaticSpeechRecognition,
	inputSchema: automaticSpeechRecognitionInputSchema,
	outputSchema: automaticSpeechRecognitionOutputSchema,
	title: 'Automatic Speech Recognition',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const conversationalNode = createNodeDefinition({
	action: conversational,
	inputSchema: conversationalInputSchema,
	outputSchema: conversationalOutputSchema,
	title: 'Conversational',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const featureExtractionNode = createNodeDefinition({
	action: featureExtraction,
	inputSchema: featureExtractionInputSchema,
	outputSchema: featureExtractionOutputSchema,
	title: 'Feature Extraction',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const fillMaskNode = createNodeDefinition({
	action: fillMask,
	inputSchema: fillMaskInputSchema,
	outputSchema: fillMaskOutputSchema,
	title: 'Fill Mask',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const imageClassificationNode = createNodeDefinition({
	action: imageClassification,
	inputSchema: imageClassificationInputSchema,
	outputSchema: imageClassificationOutputSchema,
	title: 'Image Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const imageSegmentationNode = createNodeDefinition({
	action: imageSegmentation,
	inputSchema: imageSegmentationInputSchema,
	outputSchema: imageSegmentationOutputSchema,
	title: 'Image Segmentation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const objectDetectionNode = createNodeDefinition({
	action: objectDetection,
	inputSchema: objectDetectionInputSchema,
	outputSchema: objectDetectionOutputSchema,
	title: 'Object Detection',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const questionAnswerNode = createNodeDefinition({
	action: questionAnswer,
	inputSchema: questionAnswerInputSchema,
	outputSchema: questionAnswerOutputSchema,
	title: 'Question Answer',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const summarizationNode = createNodeDefinition({
	action: summarization,
	inputSchema: summarizationInputSchema,
	outputSchema: summarizationOutputSchema,
	title: 'Summarization',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const tableQuestionAnswerNode = createNodeDefinition({
	action: tableQuestionAnswer,
	inputSchema: tableQuestionAnswerInputSchema,
	outputSchema: tableQuestionAnswerOutputSchema,
	title: 'Table Question Answer',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const textClassificationNode = createNodeDefinition({
	action: textClassification,
	inputSchema: textClassificationInputSchema,
	outputSchema: textClassificationOutputSchema,
	title: 'Text Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const textGenerationNode = createNodeDefinition({
	action: textGeneration,
	inputSchema: textGenerationInputSchema,
	outputSchema: textGenerationOutputSchema,
	title: 'Text Generation',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const textToImageNode = createNodeDefinition({
	action: textToImage,
	inputSchema: textToImageInputSchema,
	outputSchema: textToImageOutputSchema,
	title: 'Text to Image',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const tokenClassificationNode = createNodeDefinition({
	action: tokenClassification,
	inputSchema: tokenClassificationInputSchema,
	outputSchema: tokenClassificationOutputSchema,
	title: 'Token Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});
export const zeroShotClassificationNode = createNodeDefinition({
	action: zeroShotClassification,
	inputSchema: zeroShotClassificationInputSchema,
	outputSchema: zeroShotClassificationOutputSchema,
	title: 'Zero Shot Classification',
	definitionLabel: 'HuggingFace',
	type: 'provider',
});

export const nodeRepository = {
	/// input
	inputCustom: inputCustomNode,
	inputText: inputTextNode,
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

function createNodeDefinition(opts: {
	action: string;
	inputSchema: z.AnyZodObject;
	outputSchema: z.AnyZodObject | ZodReadableStream;
	title: string;
	type: NodeDefinitionType;
	definitionLabel: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: opts.action,
		definitionLabel: opts.definitionLabel,
		type: opts.type,
		schema: {
			input: opts.inputSchema,
			output: opts.outputSchema,
		},
	};
}

function createIO(opts: {
	title: string;
	type: 'input' | 'output';
	input: z.AnyZodObject;
	subtype?: string;
}): NodeDefinition {
	return {
		title: opts.title,
		id: `${opts.type}${upperFirst(opts.subtype)}`,
		type: `pipeline-${opts.type}`,
		subtype: opts.subtype,
		schema: {
			input: opts.input,
			output: opts.input,
		},
	};
}
