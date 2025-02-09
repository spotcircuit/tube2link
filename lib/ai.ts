import { z } from 'zod';
import { getOpenAIClient } from './openai';

export type PostGenerationMode = 'summary' | 'story' | 'value' | 'question' | 'action';

interface VideoData {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  tags?: string[];
  transcription: string;
}

interface PostSettings {
  tone: number;
  personality: {
    charm: number;
    wit: number;
    humor: number;
    sarcasm: number;
  };
  length: 'brief' | 'standard' | 'detailed';
}

const PROMPT_TEMPLATES = {
  summary: `You are a professional content creator specializing in LinkedIn posts. Create a concise, engaging summary of this YouTube video that highlights the key insights.

Video Title: {title}
Channel: {channel}
Description: {description}
Tags: {tags}
Transcription:
{transcription}

Guidelines:
1. Start with a compelling hook
2. Extract 3-5 key insights or takeaways
3. Include relevant statistics or data points if available
4. End with a thought-provoking question or call-to-action
5. Add appropriate hashtags based on the content
6. Keep the total length between 1000-1300 characters
7. Format for LinkedIn's style (use line breaks effectively)
8. Include the YouTube video link at the end

Video Link: https://youtu.be/{videoId}`,

  story: `You are a storytelling expert. Transform this YouTube video content into a narrative-driven LinkedIn post that engages and resonates with readers.

Video Title: {title}
Channel: {channel}
Description: {description}
Tags: {tags}
Transcription:
{transcription}

Guidelines:
1. Structure the post as a story:
   - Hook with an intriguing opening
   - Build tension or interest
   - Share main insights through narrative
   - End with resolution and reflection
2. Use storytelling elements (scene-setting, emotion, conflict/resolution)
3. Keep the story relevant to professional context
4. Include key learnings naturally in the narrative
5. End with a personal reflection or lesson
6. Keep the total length between 1000-1300 characters
7. Include the video link

Video Link: https://youtu.be/{videoId}`,

  value: `You are a value-focused content strategist. Create a LinkedIn post that emphasizes the practical value and key benefits from this YouTube video.

Video Title: {title}
Channel: {channel}
Description: {description}
Tags: {tags}
Transcription:
{transcription}

Guidelines:
1. Start with the primary value proposition
2. Structure the content as:
   - Main benefit or insight
   - 3 supporting points with examples
   - Practical applications
   - Real-world relevance
3. Focus on what readers will gain
4. Include actionable takeaways
5. Add relevant professional context
6. Keep the total length between 1000-1300 characters
7. End with the video link

Video Link: https://youtu.be/{videoId}`,

  question: `You are an engagement specialist. Create a thought-provoking LinkedIn post that uses questions to drive discussion about this YouTube video.

Video Title: {title}
Channel: {channel}
Description: {description}
Tags: {tags}
Transcription:
{transcription}

Guidelines:
1. Open with an engaging question
2. Structure the content as:
   - Initial thought-provoking question
   - Context from the video
   - Supporting points with mini-questions
   - Discussion prompts
   - Final reflection question
3. Use questions to frame key points
4. Encourage reader interaction
5. Balance questions with insights
6. Keep the total length between 1000-1300 characters
7. End with the video link

Video Link: https://youtu.be/{videoId}`,

  action: `You are a CTA specialist. Create a LinkedIn post that builds toward clear, compelling calls-to-action based on this YouTube video.

Video Title: {title}
Channel: {channel}
Description: {description}
Tags: {tags}
Transcription:
{transcription}

Guidelines:
1. Structure for action:
   - Hook with a problem or opportunity
   - Build urgency through video insights
   - Present clear next steps
   - Overcome potential objections
   - Strong final CTA
2. Include mini-CTAs throughout
3. Make actions specific and achievable
4. Add social proof or benefits
5. Create urgency naturally
6. Keep the total length between 1000-1300 characters
7. End with the video link

Video Link: https://youtu.be/{videoId}`
};

function generatePrompt(videoData: VideoData, mode: PostGenerationMode, settings: PostSettings): string {
  // Build the base prompt from the template
  let prompt = PROMPT_TEMPLATES[mode]
    .replace('{title}', videoData.title)
    .replace('{channel}', videoData.channelTitle)
    .replace('{description}', videoData.description || 'No description available')
    .replace('{tags}', videoData.tags?.join(', ') || 'No tags')
    .replace('{transcription}', videoData.transcription || 'No transcription available')
    .replace('{videoId}', videoData.id);

  // Add tone guidance based on settings
  let toneGuidance = '';
  if (settings.tone <= 33) {
    toneGuidance = 'Keep the tone conversational and friendly, like talking to a friend.';
  } else if (settings.tone <= 66) {
    toneGuidance = 'Use a balanced tone that mixes professionalism with approachability.';
  } else {
    toneGuidance = 'Maintain a formal and professional tone throughout.';
  }

  // Add personality guidance
  const { charm, wit, humor, sarcasm } = settings.personality;
  let personalityGuidance = '\n\nPersonality Guidelines:';
  
  if (charm > 50) {
    personalityGuidance += '\n- Add warmth and charm to engage readers';
  }
  if (wit > 50) {
    personalityGuidance += '\n- Include clever observations and insights';
  }
  if (humor > 50) {
    personalityGuidance += '\n- Add light, appropriate humor';
  }
  if (sarcasm > 50) {
    personalityGuidance += '\n- Include subtle irony where appropriate';
  }

  // Add length guidance
  let lengthGuidance = '';
  switch (settings.length) {
    case 'brief':
      lengthGuidance = 'Keep the post concise and focused, around 100-200 words.';
      break;
    case 'standard':
      lengthGuidance = 'Write a medium-length post of about 200-400 words.';
      break;
    case 'detailed':
      lengthGuidance = 'Create a comprehensive post of 400-600 words.';
      break;
  }

  // Combine all guidance
  prompt += `\n\nTone: ${toneGuidance}`;
  prompt += personalityGuidance;
  prompt += `\n\nLength: ${lengthGuidance}`;

  return prompt;
}

export async function generateLinkedInPost(videoData: VideoData, mode: PostGenerationMode, settings: PostSettings): Promise<string> {
  console.log('\n=== Starting LinkedIn Post Generation ===');
  
  if (typeof window !== 'undefined') {
    console.error('Attempted to call generateLinkedInPost on client-side');
    throw new Error('OpenAI client can only be used server-side');
  }

  console.log('Getting OpenAI client...');
  const openai = getOpenAIClient();
  console.log('Successfully got OpenAI client');

  const prompt = generatePrompt(videoData, mode, settings);
  console.log('Generated prompt:', { length: prompt.length });

  try {
    console.log('Making OpenAI API request with:', {
      model: 'gpt-3.5-turbo',
      promptLength: prompt.length,
      temperature: 0.7,
      maxTokens: 1000
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional LinkedIn content creator who specializes in creating engaging, high-quality posts from video content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('Successfully received OpenAI response:', {
      hasContent: !!completion.choices[0]?.message?.content,
      contentLength: completion.choices[0]?.message?.content?.length
    });

    console.log('=== Finished LinkedIn Post Generation ===\n');
    return completion.choices[0]?.message?.content || 'Failed to generate content';
  } catch (error: any) {
    console.error('OpenAI API error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      param: error.param,
      status: error.status,
      details: error.response?.data || error.toString()
    });
    throw error;
  }
}
