import 'openai/shims/node';
import OpenAI from 'openai';
import { VideoData } from '@/types/video';
import { PostSettings, PostGenerationMode } from '@/types/post';
import { PreprocessedData } from './preprocessor';
import { getOpenAIClient, getOpenAIModel } from '@/lib/openai';

const openai = getOpenAIClient();

interface PostTemplate {
  name: string;
  description: string;
  structure: string;
}

export const POST_TEMPLATES: Record<PostGenerationMode, PostTemplate> = {
  question: {
    name: 'Question-Based',
    description: 'Start with an engaging question to hook readers',
    structure: `
      1. Start with a thought-provoking question about the video content
      2. Share 2-3 key insights from the video
      3. Add a call-to-action to watch the video
      4. Include relevant hashtags
    `
  },
  insight: {
    name: 'Key Insight',
    description: 'Focus on main takeaways and valuable insights',
    structure: `
      1. Start with the most impactful insight from the video
      2. Explain why this insight matters
      3. Share how viewers can apply this insight
      4. Include relevant hashtags
    `
  },
  howto: {
    name: 'How-To Guide',
    description: 'Step-by-step explanation of processes',
    structure: `
      1. Introduce what will be learned from the video
      2. List 2-3 key steps or methods shown
      3. Highlight the end result or outcome
      4. Include relevant hashtags
    `
  },
  story: {
    name: 'Story Format',
    description: 'Narrative style with personal connection',
    structure: `
      1. Start with an engaging hook from the video
      2. Share the journey or transformation shown
      3. Connect with the viewer's own experience
      4. Include relevant hashtags
    `
  },
  summary: {
    name: 'Summary',
    description: 'Concise overview of the video content',
    structure: `
      1. Brief introduction of the video topic
      2. 2-3 main points covered
      3. Quick conclusion or key takeaway
      4. Include relevant hashtags
    `
  },
  reaction: {
    name: 'Reaction',
    description: 'Share your reaction and thoughts',
    structure: `
      1. Start with your initial reaction to the video
      2. Highlight what stood out most to you
      3. Share why others should watch it
      4. Include relevant hashtags
    `
  },
  tips: {
    name: 'Tips & Tricks',
    description: 'Share key learnings and takeaways',
    structure: `
      1. Start with "Here's what I learned from this video:"
      2. List 3-4 key tips or insights
      3. Add your perspective on the most valuable tip
      4. Include relevant hashtags
    `
  }
};

function getToneLabel(tone: number): string {
  // Convert tone from 0-100 scale to 0-1 scale
  const normalizedTone = tone / 100;
  
  if (normalizedTone <= 0.33) return 'Casual';
  if (normalizedTone <= 0.66) return 'Balanced';
  return 'Professional';
}

function getPostLengthParams(length: 'brief' | 'standard' | 'detailed'): { wordRange: string, maxPoints: number } {
  switch (length) {
    case 'brief': return { wordRange: '50-100', maxPoints: 2 };
    case 'detailed': return { wordRange: '200-300', maxPoints: 4 };
    default: return { wordRange: '100-200', maxPoints: 3 };
  }
}

async function generatePrompt(data: VideoData, template: PostGenerationMode, settings: PostSettings): Promise<string> {
  const selectedTemplate = POST_TEMPLATES[template];
  if (!selectedTemplate) {
    throw new Error(`Invalid template mode: ${template}`);
  }

  const { wordRange, maxPoints } = getPostLengthParams(settings.length || 'standard');
  // Convert tone from 0-100 scale to 0-1 scale for the API
  const normalizedTone = typeof settings.tone === 'number' ? settings.tone / 100 : 0.5;
  const toneLabel = getToneLabel(typeof settings.tone === 'number' ? settings.tone : 50);
  const videoUrl = data.url || (data.videoId ? `https://www.youtube.com/watch?v=${data.videoId}` : '[Video URL will be added]');

  // Calculate personality traits influence
  const dominantTraits = Object.entries(settings.personality)
    .filter(([_, value]) => value > 0.5)
    .map(([trait]) => trait)
    .join(', ');

  // Base video information
  const videoInfo = `
Video Information:
Title: ${data.title ?? '[Title not available]'}
Channel: ${data.channelTitle ?? '[Channel not available]'}
Description: ${data.description ?? '[Description not available]'}
Duration: ${data.duration ?? '[Duration not available]'}
URL: ${videoUrl}
${data.tags ? `Tags: ${data.tags.join(', ')}` : ''}`;

  // Template-specific instructions
  let templateInstructions = '';
  switch (template) {
    case 'question':
      templateInstructions = `
Create an engaging question-based post that sparks curiosity.
- Start with a thought-provoking question that makes viewers want to know more
- Focus on an intriguing aspect or surprising element from the video
- Use the question to highlight the value viewers will get
- Make the question relatable to the viewer's interests or needs
- Follow up with key points that hint at the answer
- Create a sense of curiosity that drives viewers to watch
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;

    case 'story':
      templateInstructions = `
Create a narrative-style post that tells a compelling story about this video.
- Focus on the journey, transformation, or experience shown
- Use storytelling elements (setup, progression, resolution)
- Make an emotional connection with the viewer
- Share relatable moments or experiences
- Write in a more personal, conversational tone
- Help viewers see themselves in the story
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;

    case 'summary':
      templateInstructions = `
Create a concise, factual summary that captures the essence of this video.
- Focus on the main points and key information
- Be objective and informative in your overview
- Highlight the most important facts and takeaways
- Keep it clear and straightforward
- Maintain a balanced, informative tone
- Emphasize what viewers will learn or discover
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;

    case 'howto':
      templateInstructions = `
Create a practical guide that showcases the instructional value of this video.
- Focus on the specific steps or methods demonstrated
- Be clear and actionable in your description
- Include important details for each key step
- Highlight any tools, requirements, or prerequisites
- Emphasize the end result or what viewers will achieve
- Make it practical and easy to understand
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;

    case 'insight':
      templateInstructions = `
Share the most valuable insights and discoveries from this video.
- Focus on the "aha moments" or key learnings
- Explain why these insights are valuable or important
- Connect insights to practical applications
- Share the deeper meaning or implications
- Help viewers understand the unique value
- Make it thought-provoking and meaningful
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;

    case 'reaction':
      templateInstructions = `
Create an authentic reaction post that captures your response to this video.
- Share genuine reactions and impressions
- Focus on what surprised, impressed, or moved you
- Highlight standout moments or elements
- Express why others should care or watch
- Keep it personal yet relatable
- Build excitement or interest in the content
Writing style: ${toneLabel}, ${dominantTraits ? `emphasizing ${dominantTraits}` : 'balanced personality'}`;
      break;
  }

  const prompt = `Generate a social media post about this video in ${wordRange} words.

${selectedTemplate.structure}

${templateInstructions}

Post Settings:
- Tone: ${toneLabel}
${dominantTraits ? `- Personality: Emphasize ${dominantTraits}` : '- Personality: Balanced approach'}
- Length: ${wordRange} words
${settings.useEmojis ? '- Include relevant emojis for emphasis' : '- Avoid using emojis'}

${videoInfo}

Important: 
- Your post must be SPECIFICALLY about this video's content
- Use the actual events, reactions, and content from the video
- Follow the template structure above
- Make this post unique and engaging
- Add relevant hashtags at the end
- End with: "Watch here: ${videoUrl}"
- IMPORTANT: The post must be ${wordRange} words long (not counting hashtags and URL)

Generate a compelling social media post following these instructions.`;

  return prompt;
}

interface FormattedPost {
  mainContent: string;
  hashtags: string[];
  url: string;
}

interface PostParagraph {
  content: string;
  hasEmoji: boolean;
}

class PostFormatter {
  private static readonly URL_PATTERN = /Watch here: (https?:\/\/[^\s]+)$/;
  private static readonly HASHTAG_PATTERN = /#[^\s#]+/g;
  private static readonly SENTENCE_PATTERN = /[.!?] /;
  private static readonly MIN_SENTENCES_PER_PARA = 1;
  private static readonly MAX_SENTENCES_PER_PARA = 3;

  /**
   * Extracts URL, hashtags, and main content from the post
   */
  private static parsePost(content: string): FormattedPost {
    if (!content?.trim()) {
      throw new Error('Post content cannot be empty');
    }

    // Extract URL
    const urlMatch = content.match(this.URL_PATTERN);
    const url = urlMatch?.[1] ?? '';
    const contentWithoutUrl = content.replace(this.URL_PATTERN, '').trim();

    // Extract hashtags
    const hashtags: string[] = [];
    const mainContent = contentWithoutUrl.replace(this.HASHTAG_PATTERN, (match) => {
      hashtags.push(match);
      return '';
    }).trim();

    return {
      mainContent,
      hashtags,
      url
    };
  }

  /**
   * Splits text into sentences and ensures each has proper punctuation
   */
  private static formatSentences(text: string): string[] {
    return text
      .split(this.SENTENCE_PATTERN)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.endsWith('.') || s.endsWith('!') || s.endsWith('?') ? s : s + '.');
  }

  /**
   * Checks if a string contains an emoji
   */
  private static hasEmoji(text: string): boolean {
    const emojiPattern = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    return emojiPattern.test(text);
  }

  /**
   * Groups sentences into paragraphs with emoji awareness
   */
  private static createParagraphs(sentences: string[]): PostParagraph[] {
    const paragraphs: PostParagraph[] = [];
    let currentParagraph: string[] = [];

    sentences.forEach((sentence, index) => {
      currentParagraph.push(sentence);

      const isLastSentence = index === sentences.length - 1;
      const reachedMaxSentences = currentParagraph.length >= this.MAX_SENTENCES_PER_PARA;
      const hasMinSentences = currentParagraph.length >= this.MIN_SENTENCES_PER_PARA;

      if ((isLastSentence || reachedMaxSentences) && hasMinSentences) {
        const content = currentParagraph.join(' ');
        paragraphs.push({
          content,
          hasEmoji: this.hasEmoji(content)
        });
        currentParagraph = [];
      }
    });

    return paragraphs;
  }

  /**
   * Formats the post with proper HTML structure
   */
  public static format(content: string): string {
    try {
      const { mainContent, hashtags, url } = this.parsePost(content);
      const sentences = this.formatSentences(mainContent);
      const paragraphs = this.createParagraphs(sentences);

      const parts: string[] = [];

      // Format main content paragraphs with proper styling
      const formattedParagraphs = paragraphs.map((para, index) => {
        let paraContent = para.content;
        if (!para.hasEmoji) {
          const defaultEmojis = ['🌯', '🔥', '✨', '🚀', '💫'];
          paraContent = `${defaultEmojis[index % defaultEmojis.length]} ${paraContent}`;
        }
        return `<p style="margin-bottom: 1.5em; font-size: 1.1em; line-height: 1.5;">${paraContent}</p>`;
      });
      parts.push(formattedParagraphs.join('\n'));

      // Add hashtags with styling
      if (hashtags.length > 0) {
        const hashtagsHtml = hashtags
          .map(tag => `<span style="color: #1da1f2;">${tag}</span>`)
          .join(' ');
        parts.push(`<p style="margin-top: 1.5em; margin-bottom: 1.5em; color: #536471;">${hashtagsHtml}</p>`);
      }

      // Add URL with styling
      if (url) {
        parts.push(`<p style="margin-top: 1.5em; font-weight: 500;">Watch here: <a href="${url}" style="color: #1da1f2; text-decoration: none;">${url}</a></p>`);
      }

      return parts.join('\n');
    } catch (error) {
      console.error('Error formatting post:', error);
      return content; // Return original content if formatting fails
    }
  }
}

export async function generateSocialPost(
  data: VideoData,
  mode: PostGenerationMode,
  settings: PostSettings
): Promise<{ content: string; html: string }> {
  if (!data || !mode || !settings) {
    throw new Error('Missing required parameters: data, mode, or settings');
  }

  const prompt = await generatePrompt(data, mode, settings);
  const model = getOpenAIModel();

  // Calculate personality influence
  const dominantTraits = Object.entries(settings.personality)
    .filter(([_, value]) => value > 0.5)
    .map(([trait, value]) => ({ trait, value }));

  // Adjust temperature based on personality traits
  const baseTemp = 0.7;
  const personalityBoost = dominantTraits.reduce((acc, { value }) => acc + (value - 0.5) * 0.3, 0);
  const temperature = Math.min(1, Math.max(0.5, baseTemp + personalityBoost));

  // Build system message based on personality
  let systemContent = "You are a social media expert who creates engaging, authentic posts about YouTube videos. ";
  
  if (dominantTraits.length > 0) {
    systemContent += "Your writing style is ";
    dominantTraits.forEach(({ trait, value }, index) => {
      const intensity = value >= 0.8 ? "extremely " : value >= 0.6 ? "very " : "";
      if (index > 0) {
        systemContent += index === dominantTraits.length - 1 ? " and " : ", ";
      }
      switch (trait) {
        case 'sarcasm':
          systemContent += intensity + "sarcastic and witty";
          break;
        case 'humor':
          systemContent += intensity + "humorous and playful";
          break;
        case 'wit':
          systemContent += intensity + "clever and sharp";
          break;
        case 'charm':
          systemContent += intensity + "charming and engaging";
          break;
      }
    });
    systemContent += ". ";
  }

  systemContent += "You focus on the actual content of each video and adapt your tone to match the requested style.";

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemContent
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature,
    max_tokens: 500,
    presence_penalty: 0.3,
    frequency_penalty: 0.3
  });

  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Failed to generate post content');
  }

  // Format the content
  const formattedContent = PostFormatter.format(rawContent);
  
  // Convert newlines to <br> for HTML display
  const html = formattedContent.replace(/\n/g, '<br>');

  return {
    content: formattedContent,
    html
  };
}
