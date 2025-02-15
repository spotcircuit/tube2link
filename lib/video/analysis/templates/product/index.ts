import { VideoMetadata } from '@/types/video';
import { getOpenAIClient } from '@/lib/openai';
import { VideoAnalysisResult } from '../../types';
import { PRODUCT_TEMPLATES, BASE_PRODUCT_TEMPLATE } from './templates';

const openai = getOpenAIClient();

interface AnalysisContext {
  primaryType: 'product';
  primaryConfidence: number;
  subType: 'single' | 'comparison';
  subConfidence: number;
}

export async function analyzeProductContent(
  metadata: VideoMetadata,
  context: AnalysisContext
): Promise<VideoAnalysisResult<any>> {
  // If we're very confident about the sub-type, use just that template
  if (context.subConfidence >= 0.8) {
    return analyzeSingleTemplate(metadata, context.subType);
  }

  // If we're somewhat confident it's a review/comparison (but not which one)
  // let OpenAI decide between those two
  if (context.subConfidence >= 0.4) {
    return analyzeDualTemplates(metadata);
  }

  // If we're not confident it's either type, use base template
  return analyzeBaseTemplate(metadata);
}

async function analyzeBaseTemplate(metadata: VideoMetadata) {
  const systemPrompt = `You are a video content analyzer. Analyze the video content and provide a JSON response based on the following template:

${BASE_PRODUCT_TEMPLATE.template}

Your response must be a valid JSON object matching the template structure.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      { 
        role: 'system', 
        content: systemPrompt 
      }, 
      {
        role: 'user',
        content: `Analyze this video and respond with a JSON object:\n${JSON.stringify(metadata, null, 2)}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const message = completion.choices[0]?.message;
  if (!message?.content) {
    throw new Error('Failed to get valid analysis content');
  }

  const analysisContent = message.content;
  if (typeof analysisContent !== 'string') {
    throw new Error('Failed to get valid analysis content');
  }

  try {
    const analysisResult = JSON.parse(analysisContent);
    return {
      type: BASE_PRODUCT_TEMPLATE.type,
      confidence: 1.0,
      data: analysisResult,
      reasoning: 'Using base template due to low confidence in specific type'
    };
  } catch (error) {
    console.error('Failed to parse base template analysis:', error);
    return {
      type: BASE_PRODUCT_TEMPLATE.type,
      confidence: 0.3,
      data: {
        title: metadata.title ?? 'Unknown Product',
        description: 'Analysis failed',
        key_points: ['Unable to analyze content'],
        recommendations: ['Please try again']
      },
      reasoning: 'Failed to parse analysis result'
    };
  }
}

async function analyzeSingleTemplate(metadata: VideoMetadata, type: 'single' | 'comparison') {
  const template = PRODUCT_TEMPLATES[type];
  
  const systemPrompt = `You are a video content analyzer. Analyze the video content and provide a JSON response based on the following template:

${template.template}

Your response must be a valid JSON object matching the template structure.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      { 
        role: 'system', 
        content: systemPrompt 
      }, 
      {
        role: 'user',
        content: `Analyze this video and respond with a JSON object:\n${JSON.stringify(metadata, null, 2)}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const message = completion.choices[0]?.message;
  if (!message?.content) {
    throw new Error('AI response missing valid content');
  }

  const content = message.content;
  if (typeof content !== 'string') {
    throw new Error('AI response missing valid content');
  }

  try {
    const result = JSON.parse(content);
    return {
      type: template.type,
      confidence: 1.0,
      data: result,
      reasoning: `Analyzed as ${type} based on high confidence detection`
    };
  } catch (error) {
    console.error('Failed to parse single template analysis:', error);
    return {
      type: template.type,
      confidence: 0.3,
      data: {
        title: metadata.title ?? 'Unknown Product',
        description: 'Analysis failed',
        key_points: ['Unable to analyze content'],
        recommendations: ['Please try again']
      },
      reasoning: 'Failed to parse analysis result'
    };
  }
}

async function analyzeDualTemplates(metadata: VideoMetadata) {
  const systemPrompt = `You are a video content analyzer. Analyze the video content and provide a JSON response based on the following templates:

SINGLE REVIEW:
${PRODUCT_TEMPLATES.single.template}

PRODUCT COMPARISON:
${PRODUCT_TEMPLATES.comparison.template}

OR if neither format fits well:

BASE FORMAT:
${BASE_PRODUCT_TEMPLATE.template}

Your response must be a valid JSON object matching one of the template structures.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      { 
        role: 'system', 
        content: systemPrompt 
      }, 
      {
        role: 'user',
        content: `Analyze this video and respond with a JSON object:\n${JSON.stringify(metadata, null, 2)}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const message = completion.choices[0]?.message;
  if (!message?.content) {
    throw new Error('Comparison analysis content invalid');
  }

  const comparisonContent = message.content;
  if (typeof comparisonContent !== 'string') {
    throw new Error('Comparison analysis content invalid');
  }

  try {
    const comparisonResult = JSON.parse(comparisonContent);
    return {
      type: comparisonResult.type,
      confidence: 1.0,
      data: comparisonResult,
      reasoning: 'Type determined by content analysis'
    };
  } catch (error) {
    console.error('Failed to parse dual templates analysis:', error);
    return {
      type: 'product',
      confidence: 0.3,
      data: {
        title: metadata.title ?? 'Unknown Product',
        description: 'Analysis failed',
        key_points: ['Unable to analyze content'],
        recommendations: ['Please try again']
      },
      reasoning: 'Failed to parse analysis result'
    };
  }
}
