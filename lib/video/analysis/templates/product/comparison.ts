import { VideoMetadata } from '@/types/video';
import OpenAI from 'openai';
import { getOpenAIClient, getOpenAIModel } from '@/lib/openai';
import { ComparisonDetails } from '@/types/openai';
import { COMPARISON_TEMPLATE } from './comparison_template';

const openai = getOpenAIClient();

export async function analyzeComparison(metadata: VideoMetadata): Promise<ComparisonDetails> {
  const systemPrompt = COMPARISON_TEMPLATE.system + `\n\nImportant instructions:
1. For EACH product, list at least 3 key features
2. Rate EVERY feature on a 1-10 scale
3. For EACH feature, list both strengths (+) and weaknesses (-)
4. Be specific about feature differences between products
5. Make clear recommendations based on user type`;

  const userPrompt = COMPARISON_TEMPLATE.user
    .replace('{title}', metadata.title ?? '')
    .replace('{description}', metadata.description ?? '')
    .replace('{duration}', metadata.duration ?? '')
    .replace('{channel}', metadata.channelTitle ?? '')
    .replace('{tags}', metadata.tags?.join(', ') ?? 'None');

  try {
    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt + '\n\n' + COMPARISON_TEMPLATE.template }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const message = completion.choices[0]?.message;
    if (!message?.content) {
      throw new Error('Failed to analyze comparison content');
    }

    const response = JSON.parse(message.content) as ComparisonDetails;
    
    // Ensure required fields are present
    if (!response.items_compared || response.items_compared.length === 0) {
      response.items_compared = [{
        name: metadata.title ?? 'Unknown Product',
        features: ['Basic functionality'],
        pros: ['Standard features'],
        cons: ['Limited information available'],
        best_for: 'General use'
      }];
    }

    return response;
  } catch (error) {
    console.error('Error analyzing comparison content:', error);
    // Return a minimal valid ComparisonDetails object
    return {
      items_compared: [{
        name: metadata.title ?? 'Unknown Product',
        features: ['Basic functionality'],
        pros: ['Standard features'],
        cons: ['Limited information available'],
        best_for: 'General use'
      }],
      comparative_analysis: 'Analysis failed',
      recommendations: 'Unable to provide recommendations',
      products: [{
        name: metadata.title ?? 'Unknown Product',
        key_features: ['Basic functionality'],
        pros: ['Standard features'],
        cons: ['Limited information available']
      }],
      comparison_criteria: ['Basic functionality']
    };
  }
}
