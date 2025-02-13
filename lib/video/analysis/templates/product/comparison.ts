import { VideoMetadata } from '@/types/video';
import { getOpenAIClient } from '@/lib/openai';
import { COMPARISON_TEMPLATE } from './comparison_template';

const openai = getOpenAIClient();

export async function analyzeComparison(metadata: VideoMetadata) {
  const systemPrompt = COMPARISON_TEMPLATE.system + `\n\nImportant instructions:
1. For EACH product, list at least 3 key features
2. Rate EVERY feature on a 1-10 scale
3. For EACH feature, list both strengths (+) and weaknesses (-)
4. Be specific about feature differences between products
5. Make clear recommendations based on user type`;

  const userPrompt = COMPARISON_TEMPLATE.user
    .replace('{title}', metadata.title || '')
    .replace('{description}', metadata.description || '')
    .replace('{duration}', metadata.duration || '')
    .replace('{channel}', metadata.channelTitle || '')
    .replace('{tags}', metadata.tags?.join(', ') || 'None');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt + '\n\n' + COMPARISON_TEMPLATE.template }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Validate key features
    if (result.products) {
      result.products = result.products.map(product => {
        if (!product.keyFeatures || product.keyFeatures.length === 0) {
          product.keyFeatures = [{
            name: 'Basic Features',
            rating: '7/10',
            description: 'Standard product features',
            strengths: ['+ Basic functionality'],
            weaknesses: ['- Limited information available']
          }];
        }
        return product;
      });
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Failed to analyze comparison:', error);
    return {
      success: false,
      error: 'Failed to analyze comparison'
    };
  }
}
