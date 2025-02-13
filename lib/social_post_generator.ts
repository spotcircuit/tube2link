import 'openai/shims/node';
import OpenAI from 'openai';
import { VideoData } from '@/types/video';
import { PostSettings } from '@/types/post';
import { PreprocessedData } from './preprocessor';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type PostGenerationMode = 'question' | 'insight' | 'howto' | 'story' | 'summary' | 'tips';

export type PostTemplate = {
  name: string;
  description: string;
  structure: string;
};

export const POST_TEMPLATES: Record<PostGenerationMode, PostTemplate> = {
  question: {
    name: 'Question-Based',
    description: 'Start with an engaging question to hook readers',
    structure: `1. Open with an intriguing question about what's happening
2. Share the video's unique perspective
3. Highlight interesting moments and reactions
4. Invite thoughtful responses about similar experiences
5. Add relevant hashtags`,
  },
  insight: {
    name: 'Key Insight',
    description: 'Focus on main takeaways and valuable insights',
    structure: `1. Start with a compelling observation from the video
2. Explain why it's interesting or surprising
3. Share specific moments and reactions
4. Connect to relatable experiences
5. Add relevant hashtags`,
  },
  howto: {
    name: 'How-To Guide',
    description: 'Step-by-step explanation of processes',
    structure: `1. Introduce what's being attempted in the video
2. Describe the approach taken
3. Share the results and reactions
4. Highlight any lessons learned
5. Add relevant hashtags`,
  },
  story: {
    name: 'Story Format',
    description: 'Narrative style with personal connection',
    structure: `1. Set up the situation shown in the video
2. Share the key moments and developments
3. Describe reactions and outcomes
4. End with a reflection or takeaway
5. Add relevant hashtags`,
  },
  summary: {
    name: 'Quick Summary',
    description: 'Concise overview of main points',
    structure: `1. Lead with the main event or action
2. List key moments and reactions
3. Share the outcome or conclusion
4. Add a brief reflection
5. Add relevant hashtags`,
  },
  tips: {
    name: 'Tips & Tricks',
    description: 'Practical advice and quick wins',
    structure: `1. Start with the main focus of the video
2. Share key observations and reactions
3. Point out interesting or unusual aspects
4. Suggest what others might learn from it
5. Add relevant hashtags`,
  }
};

function getToneLabel(tone: number): string {
  if (tone >= 0.8) return 'professional and authoritative';
  if (tone >= 0.5) return 'balanced and informative';
  return 'casual and approachable';
}

function getPostLengthParams(length: 'brief' | 'standard' | 'detailed'): { charRange: string, maxPoints: number } {
  switch (length) {
    case 'brief': return { charRange: '200-300', maxPoints: 3 };
    case 'detailed': return { charRange: '500-700', maxPoints: 7 };
    default: return { charRange: '300-500', maxPoints: 5 };
  }
}

async function generatePrompt(data: VideoData, template: PostGenerationMode, settings: PostSettings): Promise<string> {
  const tone = getToneLabel(settings.tone);
  const { charRange, maxPoints } = getPostLengthParams(settings.length);
  
  // Get video URL or use a placeholder
  const videoUrl = data.url || (data.videoId ? `https://www.youtube.com/watch?v=${data.videoId}` : '[Video URL will be added]');
  
  // Template-specific instructions
  const templateInstructions = {
    question: `Create a post that:
1. Opens with an intriguing question about the video's content
2. Describes what happens in the video
3. Explores interesting aspects and reactions
4. Invites discussion with a follow-up question`,
    insight: `Create a post that:
1. Leads with a key observation from the video
2. Explains what makes it interesting
3. Describes specific moments and reactions
4. Connects to broader experiences`,
    howto: `Create a post that:
1. Introduces what's being attempted
2. Describes the approach or process shown
3. Shares the results and reactions
4. Offers any lessons or takeaways`,
    story: `Create a post that:
1. Sets up the situation shown in the video
2. Narrates the key moments
3. Describes reactions and outcomes
4. Ends with a reflection`,
    summary: `Create a post that:
1. Leads with the main event/action
2. Lists key moments and reactions
3. Shares the outcome
4. Adds a brief reflection`,
    tips: `Create a post that:
1. Introduces what's happening in the video
2. Describes the interesting or unusual aspects
3. Shares specific reactions and responses
4. Notes any surprising or memorable moments
5. Focuses on observations, not advice`
  };

  return `Generate a ${tone} social media post about this video in ${charRange} characters.

Video Title: ${data.title}
Video Description: ${data.description}
Channel: ${data.channelTitle}
URL: ${videoUrl}

${templateInstructions[template]}

Guidelines:
- Keep the post between ${charRange} characters
- Focus on the ACTUAL content of this specific video
- Be specific about what happens, reactions, and outcomes
- For the Tips & Tricks template, focus on OBSERVATIONS from the video, not generic advice
${settings.useEmojis 
  ? '- Use relevant emojis to enhance key points (1-2 emojis per section)\n- Use emojis naturally, not excessively' 
  : '- Do not use any emojis in the content'}
- Add relevant hashtags at the end that match the video's content
- End the post with: "Watch here: ${videoUrl}"

Video Information:
Title: ${data.title || '[Title not available]'}
Channel: ${data.channelTitle || '[Channel not available]'}
Description: ${data.description || '[Description not available]'}
Duration: ${data.duration || '[Duration not available]'}
URL: ${videoUrl}
${data.tags ? `Tags: ${data.tags.join(', ')}` : ''}

Important: 
- Your post must be SPECIFICALLY about this video's content
- Do NOT generate generic advice or tips
- Use the actual events, reactions, and content from the video
- For Tips & Tricks posts, share observations about what happened, not general advice

Generate a compelling social media post following the template structure above.`;

  return prompt;
}

function formatContentToHtml(content: string): string {
  return content
    .split('\n')
    .map(line => {
      // Convert URLs to links
      line = line.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      // Convert hashtags to spans
      line = line.replace(
        /#(\w+)/g,
        '<span class="text-blue-500">#$1</span>'
      );
      
      return line;
    })
    .join('<br />');
}

export async function generateSocialPost(
  data: VideoData,
  mode: PostGenerationMode,
  settings: PostSettings
): Promise<any> {
  try {
    const prompt = await generatePrompt(data, mode, settings);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are a professional social media content writer. Return a JSON object with a 'post' field containing the social media post content.

Format the post with proper spacing using double line breaks (\\n\\n):
1. Start with an engaging hook or question
2. Add double line break after the hook
3. Add main content in 1-2 paragraphs
4. Add double line break after main content
5. Add engagement question or call to action
6. Add double line break before hashtags
7. Group related hashtags together on one line
8. Add double line break before the video link

Example format:
{
  "post": "Hook or question\\n\\nMain content paragraph 1\\n\\nMain content paragraph 2\\n\\nEngagement question\\n\\n#Tag1 #Tag2 #Tag3\\n#Tag4 #Tag5\\n\\nhttps://..."
}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: settings.length === 'detailed' ? 2500 : 2000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response;
  } catch (error) {
    console.error('Error generating social media post:', error);
    throw error;
  }
}
