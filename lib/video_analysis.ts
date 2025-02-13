import OpenAI from 'openai';
import { VideoMetadata } from '@/types/video';
import { VideoType } from './video_types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Base template for initial type detection
const BASE_TEMPLATE = `
1. BASE ANALYSIS:
{
  "type": {
    "primary": "one_of_tutorial_review_commentary_news_lifestyle",
    "confidence": 0.0 to 1.0,
    "reasoning": "Brief explanation of why this type was chosen"
  },
  "content_signals": {
    "title_indicators": [
      {
        "pattern": "Specific word or phrase found",
        "strength": "strong|medium|weak"
      }
    ],
    "description_indicators": [
      {
        "pattern": "Specific phrase or structure found",
        "strength": "strong|medium|weak"
      }
    ]
  }
}`;

// Type-specific enrichment templates
const TYPE_TEMPLATES = {
  review: `
2. REVIEW ENRICHMENT:
{
  "productDetails": {
    "name": "Full product name",
    "category": "Product category",
    "price": "Price if mentioned",
    "specs": {
      "key": "value",
      "specification": "details"
    }
  },
  "keyFeatures": [
    {
      "feature": "Specific feature name",
      "rating": 0.0 to 5.0,
      "comments": "Detailed analysis of the feature"
    }
  ],
  "prosAndCons": {
    "pros": [
      "Clear benefit or advantage",
      "Another positive point"
    ],
    "cons": [
      "Specific drawback or limitation",
      "Another negative point"
    ]
  },
  "comparisons": [
    {
      "product": "Competing product name",
      "differences": [
        "Specific difference or comparison point",
        "Another comparison detail"
      ]
    }
  ],
  "verdict": {
    "rating": 0.0 to 5.0,
    "summary": "Final verdict summary",
    "recommendedFor": [
      "Specific user group or use case",
      "Another recommendation"
    ]
  }
}`
} as const;

// Review-specific templates
const REVIEW_TEMPLATES = {
  single: `
2. SINGLE PRODUCT REVIEW ANALYSIS:
{
  "productDetails": {
    "name": "Full product name",
    "category": "Product category",
    "price": "Price if mentioned",
    "specs": {
      "key specifications": "with values"
    }
  },
  "keyFeatures": [
    {
      "feature": "Feature name",
      "rating": 0.0 to 5.0,
      "comments": "Detailed analysis of the feature"
    }
  ],
  "prosAndCons": {
    "pros": [
      "Key advantage 1",
      "Key advantage 2"
    ],
    "cons": [
      "Key disadvantage 1",
      "Key disadvantage 2"
    ]
  },
  "verdict": {
    "rating": 0.0 to 5.0,
    "summary": "Overall assessment",
    "recommendedFor": [
      "Specific use case or user type"
    ]
  }
}`,

  comparison: `
2. PRODUCT COMPARISON ANALYSIS:
{
  "comparisonContext": {
    "category": "Product category",
    "criteria": [
      "Key comparison criteria"
    ],
    "priceRange": "Price range covered"
  },
  "products": [
    {
      "name": "Product name",
      "price": "Product price",
      "keyFeatures": [
        {
          "feature": "Feature name",
          "rating": 0.0 to 5.0,
          "notes": "Comparison notes"
        }
      ]
    }
  ],
  "headToHead": [
    {
      "criterion": "Comparison criterion",
      "winner": "Winning product name",
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

Title: ${metadata.title}
Description: ${metadata.description}
Duration: ${metadata.duration}
Tags: ${metadata.tags?.join(', ') || 'None'}
Category: ${metadata.category || 'Unknown'}

${confidence <= 0.8 ? "Note: The video type is not certain, so please verify if this is actually a " + reviewType + " video first." : ""}

Provide the analysis in the following JSON structure:`;

  const template = REVIEW_TEMPLATES[reviewType];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt + template }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

export async function analyzeVideoContent(metadata: VideoMetadata): Promise<[VideoType, number]> {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${metadata.videoId}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are a video content analyzer specializing in product reviews and technical content.
Analyze this video and provide a structured analysis following these templates:
${BASE_TEMPLATE}

Video URL: ${videoUrl}
Important: Return ONLY the JSON structure(s) specified. No additional text.`
        },
        {
          role: "user",
          content: `Analyze this video metadata:
Title: ${metadata.title}
Channel: ${metadata.channelTitle}
Description: ${metadata.description}
Tags: ${metadata.tags?.join(', ') || 'None'}
Category: ${metadata.category || 'None'}

Provide your analysis in the specified JSON format.`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    const videoType = response.type.primary as VideoType;
    const confidence = response.type.confidence;

    // If we have high confidence, get enrichment data
    const enrichmentTemplate = getEnrichmentTemplate(videoType, confidence);
    if (enrichmentTemplate) {
      const enrichmentCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `You are a video content analyzer specializing in ${videoType} content.
Analyze this video and provide enriched details following this template:
${enrichmentTemplate}

Video URL: ${videoUrl}
Important: Return ONLY the JSON structure specified. No additional text.`
          },
          {
            role: "user",
            content: `Analyze this video metadata:
Title: ${metadata.title}
Channel: ${metadata.channelTitle}
Description: ${metadata.description}
Tags: ${metadata.tags?.join(', ') || 'None'}
Category: ${metadata.category || 'None'}

Provide your detailed analysis in the specified JSON format.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      try {
        const enrichmentData = JSON.parse(enrichmentCompletion.choices[0].message.content || '{}');
        // Store enrichment data for later use
        console.log(`${videoType} enrichment data:`, enrichmentData);
      } catch (e) {
        console.error(`Invalid ${videoType} enrichment data:`, e);
      }
    }

    // Analyze review content if video type is review
    if (videoType === 'review') {
      const reviewType = response.content_signals.title_indicators[0].pattern.includes('vs') ? 'comparison' : 'single';
      const reviewData = await analyzeReviewContent(metadata, reviewType, confidence);
      console.log('Review data:', reviewData);
    }

    return [videoType, confidence];
  } catch (error) {
    console.error('Error analyzing video content:', error);
    return ['tutorial' as VideoType, 0.6]; // Safe fallback
  }
}
