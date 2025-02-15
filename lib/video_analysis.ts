import OpenAI from 'openai';
import { VideoMetadata } from '@/types/video';
import { VideoType } from '@/types/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ReviewTemplate {
  type: 'single' | 'comparison';
  template: string;
}

interface VideoTypeTemplate {
  type: VideoType;
  template: string;
}

const REVIEW_TEMPLATES: Record<'single' | 'comparison', ReviewTemplate> = {
  single: {
    type: 'single',
    template: `{
  "productInfo": {
    "name": "Product name",
    "manufacturer": "Company name",
    "category": "Product category",
    "price": "Price if mentioned"
  },
  "keyFeatures": [
    {
      "name": "Feature name",
      "description": "Feature details",
      "rating": "Rating if given (1-10)",
      "pros": ["Positive points"],
      "cons": ["Negative points"]
    }
  ],
  "overallRating": {
    "score": "Overall score if given (1-10)",
    "summary": "Brief rating summary"
  },
  "recommendations": {
    "bestFor": ["Ideal use cases"],
    "notFor": ["Use cases where not recommended"]
  },
  "verdict": "Final verdict"
}`
  },
  comparison: {
    type: 'comparison',
    template: `{
  "products": [
    {
      "name": "Product name",
      "manufacturer": "Company name",
      "price": "Price if mentioned"
    }
  ],
  "comparisonPoints": [
    {
      "feature": "Feature being compared",
      "importance": "How important this feature is (1-10)",
      "comparison": "Detailed comparison",
      "winner": "Which product wins for this feature"
    }
  ],
  "winners": [
    {
      "category": "Category (e.g., Performance, Value)",
      "winner": "Winning product",
      "explanation": "Why this product wins"
    }
  ],
  "verdict": {
    "bestOverall": "Best overall product",
    "bestValue": "Best value product",
    "situationalRecommendations": [
      {
        "scenario": "Use case or situation",
        "recommendation": "Recommended product",
        "reason": "Why this product is best for this case"
      }
    ]
  }
}`
  }
};

const TYPE_TEMPLATES: Record<VideoType, string> = {
  'product': '',
  'review': '',
  'comparison': '',
  'tutorial': '',
  'news': '',
  'commentary': '',
  'recipe': ''
};

// Helper to get the appropriate template based on detected type
function getEnrichmentTemplate(type: VideoType, confidence: number): string {
  if (confidence <= 0.7) return '';
  return TYPE_TEMPLATES[type] || '';
}

async function analyzeReviewContent(metadata: VideoMetadata, reviewType: 'single' | 'comparison', confidence: number) {
  const systemPrompt = `You are analyzing a YouTube ${reviewType === 'single' ? 'product review' : 'comparison'} video.
The video metadata will be provided, and you should extract structured information about the ${reviewType === 'single' ? 'product being reviewed' : 'products being compared'}.
Focus on objective information and clear comparisons. If certain information is not available, use null or omit those fields.`;

  const userPrompt = `Analyze this ${reviewType} video and provide structured information:

Title: ${metadata.title ?? ''}
Description: ${metadata.description ?? ''}
Duration: ${metadata.duration ?? ''}
Tags: ${metadata.tags?.join(', ') ?? 'None'}
Category: ${metadata.category ?? 'Unknown'}

${confidence <= 0.8 ? "Note: The video type is not certain, so please verify if this is actually a " + reviewType + " video first." : ""}

Provide the analysis in the following JSON structure:`;

  const template = REVIEW_TEMPLATES[reviewType].template;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt + template }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const message = completion.choices[0]?.message;
  if (!message?.content) {
    throw new Error('Failed to get valid analysis content');
  }

  try {
    return JSON.parse(message.content);
  } catch (error) {
    console.error('Failed to parse review analysis:', error);
    return {
      type: reviewType,
      confidence: 0.3,
      analysis: {
        title: metadata.title ?? 'Unknown Product',
        description: 'Analysis failed',
        key_points: ['Unable to analyze content'],
        recommendations: ['Please try again']
      }
    };
  }
}

export async function analyzeVideoContent(metadata: VideoMetadata): Promise<[VideoType, number]> {
  const systemPrompt = `You are a video content analyzer. Your task is to:
1. Determine the primary type of video content
2. Look for specific signals in the title, description, and metadata
3. Provide a confidence score for your classification
4. Extract key content signals that support your classification

Return your analysis as a JSON object with this structure:
{
  "type": {
    "primary": "One of: product, review, comparison, tutorial, news, commentary, recipe",
    "confidence": "0.0 to 1.0 score",
    "reasoning": "Why you classified it this way"
  },
  "content_signals": {
    "title_indicators": [
      {
        "pattern": "What was matched",
        "type": "What this indicates",
        "confidence": "0.0 to 1.0"
      }
    ],
    "description_indicators": [
      {
        "pattern": "What was matched",
        "type": "What this indicates",
        "confidence": "0.0 to 1.0"
      }
    ]
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze this video metadata:
Title: ${metadata.title ?? ''}
Channel: ${metadata.channelTitle ?? ''}
Description: ${metadata.description ?? ''}
Tags: ${metadata.tags?.join(', ') ?? 'None'}
Category: ${metadata.category ?? 'Unknown'}

Determine the type of content and provide your analysis in the specified JSON format.`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    const message = completion.choices[0]?.message;
    if (!message?.content) {
      throw new Error('Failed to get valid analysis content');
    }

    try {
      const response = JSON.parse(message.content) as {
        type: {
          primary: VideoType;
          confidence: number;
          reasoning: string;
        };
        content_signals: {
          title_indicators: Array<{
            pattern: string;
            type: string;
            confidence: number;
          }>;
        };
      };

      const videoType = response.type.primary;
      const confidence = response.type.confidence;

      // If we have high confidence, get enrichment data
      const enrichmentTemplate = getEnrichmentTemplate(videoType, confidence);
      if (enrichmentTemplate) {
        const enrichmentCompletion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a video content analyzer specializing in ${videoType} content.
Analyze this video and provide enriched details following this template:
${enrichmentTemplate}

Return your analysis as a JSON object.
Important: Return ONLY the JSON structure specified. No additional text.`
            },
            {
              role: "user",
              content: `Analyze this video metadata:
Title: ${metadata.title ?? ''}
Channel: ${metadata.channelTitle ?? ''}
Description: ${metadata.description ?? ''}
Duration: ${metadata.duration ?? ''}
Category: ${metadata.category ?? 'None'}

Provide your detailed analysis in the specified JSON format.`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
          max_tokens: 2000
        });

        const enrichmentMessage = enrichmentCompletion.choices[0]?.message;
        if (enrichmentMessage?.content) {
          try {
            const enrichmentData = JSON.parse(enrichmentMessage.content);
            console.log(`${videoType} enrichment data:`, enrichmentData);
          } catch (e) {
            console.error(`Invalid ${videoType} enrichment data:`, e);
          }
        }
      }

      // Analyze review content if video type is review
      if (videoType === 'review' && response.content_signals.title_indicators?.[0]) {
        const reviewType = response.content_signals.title_indicators[0].pattern.includes('vs') ? 'comparison' : 'single';
        const reviewData = await analyzeReviewContent(metadata, reviewType, confidence);
        console.log('Review data:', reviewData);
      }

      return [videoType, confidence];
    } catch (error) {
      console.error('Failed to parse video analysis:', error);
      return ['tutorial', 0.6]; // Safe fallback
    }
  } catch (error) {
    console.error('Error analyzing video content:', error);
    return ['tutorial', 0.6]; // Safe fallback
  }
}
