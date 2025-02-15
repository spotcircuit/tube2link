import { VideoMetadata } from '@/types/video';
import { ReviewDetails } from '@/types/openai';
import OpenAI from 'openai';
import { getOpenAIClient, getOpenAIModel } from '@/lib/openai';

export async function analyzeReview(metadata: VideoMetadata): Promise<ReviewDetails> {
  const openai = getOpenAIClient();

  const prompt = `
Analyze this product review video and extract key information:

Title: ${metadata.title ?? ''}
Description: ${metadata.description ?? ''}
Channel: ${metadata.channelTitle ?? ''}
Channel Description: ${metadata.channelDescription ?? ''}
Duration: ${metadata.duration ?? ''}
Published: ${metadata.publishedAt ?? ''}

Return a JSON object with:
1. product_name: Name of the product being reviewed
2. manufacturer: Product manufacturer (if mentioned)
3. price_point: Price mentioned in the video (if any)
4. key_features: List of main product features discussed
5. pros: List of positive points
6. cons: List of negative points or concerns
7. performance: Object with highlights and issues arrays
8. value_assessment: Overall value for money assessment
9. recommendation: Final recommendation
10. best_for: List of ideal use cases or user types
11. timestamps: Array of {time, topic} for key moments
12. overall_rating: Numeric rating (0-10) if given
13. best_suited_for: Target audience
14. comparison_products: Other products mentioned for comparison
`;

  try {
    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: 'You are a product review analyzer that extracts detailed information from video reviews. Return only a valid JSON object with the specified fields.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const message = completion.choices[0]?.message;
    if (!message?.content) {
      throw new Error('Failed to analyze review content');
    }

    const response = JSON.parse(message.content) as ReviewDetails;
    return response;
  } catch (error) {
    console.error('Error analyzing review content:', error);
    // Return a minimal valid ReviewDetails object
    return {
      product_name: metadata.title ?? 'Unknown Product',
      key_features: [],
      pros: [],
      cons: [],
      performance: {
        highlights: [],
        issues: []
      },
      value_assessment: 'Analysis failed',
      recommendation: 'Unable to provide recommendation',
      best_for: []
    };
  }
}
