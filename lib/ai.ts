import 'openai/shims/node';
import { z } from 'zod';
import OpenAI from 'openai';
import { VideoData } from '@/types/video';
import { PostSettings } from '@/types/post';
import { VideoContext } from '@/lib/video_context';
import { getOpenAIClient } from './openai';
import { PreprocessedData } from './preprocessor';
import { getConfig } from './config';
import { getVideoType, VIDEO_CONTEXTS } from './video_context';
import * as path from 'path';
import * as fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type PostGenerationMode = keyof typeof POST_TEMPLATES;

const POST_TEMPLATES = {
  question: {
    name: 'Question-Based',
    structure: `
1. Open with an intriguing industry question
2. Share context from your experience
3. Present the video's perspective
4. Highlight key supporting evidence
5. Invite thoughtful responses
6. Include video URL
7. Add relevant hashtags`
  },
  story: {
    name: 'Story-Based',
    structure: `
1. Start with a relatable situation
2. Share the learning journey
3. Present key discoveries
4. Connect to broader principles
5. End with earned wisdom
6. Include video URL
7. Add relevant hashtags`
  },
  action: {
    name: 'Action-Oriented',
    structure: `
1. State the goal clearly
2. Explain why it matters now
3. Present concrete steps
4. Share a practical example
5. Call to action
6. Include video URL
7. Add relevant hashtags`
  },
  insight: {
    name: 'Insight-Based',
    structure: `
1. Lead with surprising data
2. Explain the significance
3. Reveal deeper understanding
4. Support with evidence
5. Challenge assumptions
6. Include video URL
7. Add relevant hashtags`
  },
  problem_solution: {
    name: 'Problem-Solution',
    structure: `
1. Identify the pain point clearly
2. Explain its impact
3. Present the solution approach
4. Share implementation details
5. Highlight the benefits
6. Include video URL
7. Add relevant hashtags`
  },
  comparison: {
    name: 'Comparison',
    structure: `
1. Introduce the approaches
2. Compare key aspects
3. Highlight innovations
4. Present evidence
5. Guide decision making
6. Include video URL
7. Add relevant hashtags`
  }
} as const;

function getToneLabel(tone: number): string {
  if (tone <= 0.33) return 'Casual';
  if (tone <= 0.66) return 'Balanced';
  return 'Formal';
}

export async function generatePrompt(data: VideoData, template: keyof typeof POST_TEMPLATES, settings: PostSettings): Promise<string> {
  const videoType = await getVideoType(data);
  const videoContext = VIDEO_CONTEXTS[videoType];
  const selectedTemplate = POST_TEMPLATES[template];

  // Ensure all data properties exist with defaults
  const {
    metadata = {
      title: 'No title available',
      channelTitle: 'No channel available',
      description: 'No description available',
      videoId: ''
    },
    gptQuickSummary = 'No summary available',
    patterns = {},
    semantic = {},
    roles = {}
  } = data;

  const topActions = semantic?.actions
    ?.sort((a, b) => b.importance - a.importance)
    .slice(0, 3)
    .map(a => `• ${a.content}`)
    .join('\n') || 'No key actions available';

  const topKeyPoints = patterns?.key_points
    ?.slice(0, 3)
    .map(p => `• ${p.content}`)
    .join('\n') || 'No key points available';

  const examples = patterns?.examples
    ?.map(e => `• ${e.content}`)
    .join('\n') || 'No examples available';

  const technicalDetails = roles?.developer
    ?.map(d => `• ${d.content}`)
    .join('\n') || 'No technical details available';

  const userContext = roles?.user
    ?.map(u => `• ${u.content}`)
    .join('\n') || 'No user context available';

  const prompt = `${videoContext.intro}

Create a LinkedIn post using the "${selectedTemplate.name}" format:

Title: ${metadata.title}
Channel: ${metadata.channelTitle}
Description: ${metadata.description}

Summary:
${gptQuickSummary}

Key Actions (Most Important):
${topActions}

Key Points:
${topKeyPoints}

Practical Examples:
${examples}

Technical Implementation:
${technicalDetails}

Target Audience Context:
${userContext}

Writing Style:
- Tone: ${getToneLabel(settings.tone)}
- Charm: ${settings.personality.charm}%
- Wit: ${settings.personality.wit}%
- Humor: ${settings.personality.humor}%
- Sarcasm: ${settings.personality.sarcasm}%

Post Structure (${selectedTemplate.name}):
${selectedTemplate.structure}

Content Focus (${videoType}):
${videoContext.format.join('\n')}

Additional Guidelines:
1. Keep it concise (1000-1300 characters)
2. Use line breaks effectively
3. Include 2-3 relevant hashtags
4. Maintain the specified tone and personality
5. Format for maximum engagement
6. End with the video link${metadata.videoId ? `\n\nVideo Link: https://youtu.be/${metadata.videoId}` : ''}`; 

  // Save the prompt to file
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  const promptPath = path.join(dataDir, `${data.metadata?.videoId || 'unknown'}_base_prompt.txt`);
  await fs.writeFile(promptPath, prompt, 'utf-8');
  console.log(` Base prompt saved to: ${promptPath}`);

  return prompt;
}

export async function generateLinkedInPost(
  data: VideoData,
  mode: PostGenerationMode,
  settings: PostSettings
): Promise<string> {
  console.log(' Preparing LinkedIn post prompt...');

  // First get the base prompt (same as generatePrompt)
  const basePrompt = await generatePrompt(data, mode, settings);
  
  // Check if we have enrichment data
  if (!data.patterns && !data.semantic && !data.roles) {
    console.log('No pattern/semantic/role data found, using base prompt');
    return basePrompt;
  }

  // Add enriched data to prompt
  const enrichedPrompt = `${basePrompt}

Additional Context:
${data.patterns?.key_points && data.patterns.key_points.length > 0 ? `
Key Points:
${data.patterns.key_points.map(p => `• ${p.content}`).join('\n')}` : ''}

${data.patterns?.examples && data.patterns.examples.length > 0 ? `
Examples:
${data.patterns.examples.map(e => `• ${e.content}`).join('\n')}` : ''}

${data.semantic?.actions && data.semantic.actions.length > 0 ? `
Important Actions:
${data.semantic.actions
  .filter(a => a.importance >= 0.7)
  .map(a => `• ${a.content}`)
  .join('\n')}` : ''}

${data.roles?.user && data.roles.user.length > 0 ? `
User Actions:
${data.roles.user.map(u => `• ${u.content}`).join('\n')}` : ''}

${data.roles?.developer && data.roles.developer.length > 0 ? `
Technical Notes:
${data.roles.developer.map(d => `• ${d.content}`).join('\n')}` : ''}

Please ensure:
1. The post is engaging and encourages discussion
2. Maintain a professional tone
3. Include a clear call to action
4. Keep the total length within LinkedIn's optimal range
5. Always include the video URL before any hashtags
6. Place relevant hashtags at the very end`;

  // Save the enriched prompt
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  const enrichedPath = path.join(dataDir, `${data.metadata?.videoId || 'unknown'}_enriched_prompt.txt`);
  await fs.writeFile(enrichedPath, enrichedPrompt, 'utf-8');
  console.log(` Enriched prompt saved to: ${enrichedPath}`);

  // Return the enriched prompt - don't make an API call
  return enrichedPrompt;
}

export function enrichPrompt(prompt: string, videoData: VideoData): string {
  const enrichedPrompt = prompt
    .replace('${title}', videoData.metadata?.title || '')
    .replace('${description}', videoData.metadata?.description || '')
    .replace('${channelTitle}', videoData.metadata?.channelTitle || '')
    .replace('${transcription}', videoData.transcription || '');

  return enrichedPrompt;
}

export async function formatDetailedAnalysis(preprocessedData: PreprocessedData): Promise<string> {
  console.log(' Formatting detailed analysis...');

  const formattedAnalysis = `# Detailed Analysis

Key Points:
${preprocessedData.patterns.key_points?.map(p => `- ${p.content}`).join('\n') || 'No key points found'}

Examples:
${preprocessedData.patterns.examples?.map(e => `- ${e.content}`).join('\n') || 'No examples found'}

Actions:
${preprocessedData.semantic.actions?.map(a => `- ${a.content} (Importance: ${a.importance})`).join('\n') || 'No actions found'}

User Context:
${preprocessedData.roles.user?.map(u => `- ${u.content}`).join('\n') || 'No user context found'}

Technical Notes:
${preprocessedData.roles.developer?.map(d => `- ${d.content}`).join('\n') || 'No technical notes found'}`;

  // Save to file
  const dataDir = path.join(process.cwd(), 'data', 'analysis');
  await fs.mkdir(dataDir, { recursive: true });
  const analysisPath = path.join(dataDir, 'detailed_analysis.txt');
  await fs.writeFile(analysisPath, formattedAnalysis, 'utf-8');
  console.log(` Detailed analysis saved to: ${analysisPath}`);

  return formattedAnalysis;
}
