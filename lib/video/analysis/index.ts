import { VideoMetadata } from '@/types/video';
import { VideoType } from '@/types/openai';
import { detectVideoType } from './detection';
import { analyzeProductContent } from './templates/product';
import OpenAI from 'openai';
import { getOpenAIClient, getOpenAIModel } from '@/lib/openai';
import { analyzeComparison } from './templates/product/comparison';
import { analyzeReview } from './templates/review';

const openai = getOpenAIClient();

export async function analyzeVideoContent(metadata: VideoMetadata) {
  // First, detect the primary video type
  const detectionResult = await detectVideoType(metadata);
  const { type: primaryType, confidence: primaryConfidence, subType, subTypeConfidence } = detectionResult;

  // If we're not confident enough about the primary type, let OpenAI decide
  if (primaryConfidence < 0.8) {
    // Pass to OpenAI with multiple possible templates
    throw new Error('Low confidence handling not implemented yet');
  }

  // Route to specific analyzer based on confident type
  switch (primaryType) {
    case 'product':
      // For product content, detect if it's review or comparison
      const detection = {
        type: primaryType,
        confidence: primaryConfidence,
        subType: subType,
        subTypeConfidence: subTypeConfidence
      };

      // If no subtype or low confidence, use AI analysis
      if (!detection.subType || parseFloat(detection.subTypeConfidence || '0') < 80.0) {
        return {
          template: 'ai',
          analysis: await analyzeAmbiguousProduct(metadata)
        };
      }

      // Use specific template based on subtype
      if (detection.subType === 'comparison') {
        return {
          template: 'product_comparison',
          analysis: await analyzeComparison(metadata)
        };
      } else if (detection.subType === 'review') {
        return {
          template: 'product_review',
          analysis: await analyzeReview(metadata)
        };
      } else if (detection.subType === 'ambiguous') {
          return {
            template: 'ai',
            analysis: await analyzeAmbiguousProduct(metadata)
          };
      }

      // Fallback to AI analysis
      return {
        template: 'ai',
        analysis: await analyzeAmbiguousProduct(metadata)
      };

    // We'll add these as we implement them
    case 'tutorial':
    case 'news':
    case 'commentary':
    case 'recipe':
    default:
      throw new Error(`Content type ${primaryType} analysis not yet implemented`);
  }
}

async function analyzeAmbiguousProduct(metadata: VideoMetadata) {
  const systemPrompt = `You are analyzing a product-related YouTube video that could be either a review or comparison.
Your task is to:
1. Determine if this is primarily a review or comparison
2. Extract key product information
3. Identify main points and conclusions`;

  const userPrompt = `Analyze this video:
Title: ${metadata.title ?? ''}
Description: ${metadata.description ?? ''}
Duration: ${metadata.duration ?? ''}
Tags: ${metadata.tags?.join(', ') ?? 'None'}

Provide analysis in this JSON format:`;

  const template = `{
  "videoType": {
    "primary": "review or comparison",
    "confidence": "0.0 to 1.0",
    "reasoning": "Why you classified it this way"
  },
  "products": [
    {
      "name": "Product name",
      "type": "Product type/category",
      "keyPoints": ["Main points about this product"]
    }
  ],
  "analysis": {
    "mainPoints": ["Key observations"],
    "conclusions": ["Final thoughts"],
    "recommendations": ["Suggestions"]
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt + '\n\n' + template }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const message = completion.choices[0]?.message;
    if (!message?.content) {
      throw new Error('Failed to analyze ambiguous product content');
    }

    const response = JSON.parse(message.content) as {
      videoType: {
        primary: 'review' | 'comparison';
        confidence: number;
        reasoning: string;
      };
      products: Array<{
        name: string;
        type: string;
        keyPoints: string[];
      }>;
      analysis: {
        mainPoints: string[];
        conclusions: string[];
        recommendations: string[];
      };
    };

    return response;
  } catch (error) {
    console.error('Failed to parse ambiguous product analysis:', error);
    // Return a minimal valid response
    return {
      videoType: {
        primary: 'review',
        confidence: 0.3,
        reasoning: 'Analysis failed'
      },
      products: [{
        name: metadata.title ?? 'Unknown Product',
        type: 'Unknown',
        keyPoints: ['Analysis failed']
      }],
      analysis: {
        mainPoints: ['Analysis failed'],
        conclusions: ['Unable to analyze content'],
        recommendations: ['Please try again']
      }
    };
  }
}

export * from './detection';
export * from './templates';
export * from './types';
