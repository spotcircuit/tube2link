import { VideoMetadata } from '@/types/video';
import { VideoType } from '@/types/openai';
import { getOpenAIClient, getOpenAIModel } from '@/lib/openai';

interface DetectionResult {
  type: VideoType;
  confidence: number;
  subType?: string;
  subTypeConfidence?: string;
}

export async function detectVideoType(metadata: VideoMetadata): Promise<DetectionResult> {
  const openai = getOpenAIClient();

  const prompt = `
Analyze this YouTube video metadata and determine its primary type and any relevant subtypes:

Title: ${metadata.title ?? ''}
Description: ${metadata.description ?? ''}
Channel: ${metadata.channelTitle ?? ''}
Channel Description: ${metadata.channelDescription ?? ''}
Duration: ${metadata.duration ?? ''}
Published: ${metadata.publishedAt ?? ''}

Return a JSON object with:
1. type: The primary video type (product, news, tutorial, recipe, commentary)
2. confidence: Confidence score for primary type (0-1)
3. subType: Optional subtype if applicable (e.g., review, comparison for product videos)
4. subTypeConfidence: Optional confidence score for subtype (0-1)
`;

  try {
    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: 'You are a video content analyzer that determines video types and subtypes. Respond only with a valid JSON object containing the requested fields.'
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
      throw new Error('Failed to detect video type');
    }

    const response = JSON.parse(message.content) as DetectionResult;
    return response;
  } catch (error) {
    console.error('Error detecting video type:', error);
    // Return a default result with low confidence
    return {
      type: 'product',
      confidence: 0.3
    };
  }
}
