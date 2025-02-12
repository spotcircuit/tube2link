import 'openai/shims/node';
import { z } from 'zod';
import OpenAI from 'openai';
import { VideoData } from '@/types/video';
import { PostSettings } from '@/types/post';
import { PreprocessedData } from './preprocessor';
import { getConfig } from './config';
import { getVideoType, VIDEO_CONTEXTS } from './video_context';
import { detectVideoType } from './video_detection';
import { generatePrompt } from './video_prompts';
import { validateEnrichment, repairEnrichment } from './video_validation';
import { VideoType } from './video_types';
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

function getPostLengthParams(length: 'brief' | 'standard' | 'detailed'): { charRange: string, maxPoints: number } {
  switch (length) {
    case 'brief':
      return { charRange: '700-1000', maxPoints: 2 };
    case 'standard':
      return { charRange: '1300-1700', maxPoints: 3 };
    case 'detailed':
      return { charRange: '1700-2000', maxPoints: 5 };
  }
}

export async function generatePrompt(data: VideoData, template: keyof typeof POST_TEMPLATES, settings: PostSettings): Promise<string> {
  const videoType = await getVideoType(data);
  const videoContext = VIDEO_CONTEXTS[videoType];
  const selectedTemplate = POST_TEMPLATES[template];
  const lengthParams = getPostLengthParams(settings.length);

  // Ensure all data properties exist with defaults
  const {
    title = 'No title available',
    channelTitle = 'No channel available',
    description = 'No description available',
    summary = {
      summary: 'No summary available',
      analysis: {
        core_concepts: {
          key_points: [],
          insights: []
        },
        practical_application: {
          code_examples: [],
          implementation_steps: []
        },
        technical_details: {
          considerations: [],
          limitations: []
        }
      }
    }
  } = data;

  const topActions = summary.analysis?.core_concepts?.key_points
    ?.sort((a, b) => b.importance - a.importance)
    .slice(0, lengthParams.maxPoints)
    .map(a => `• ${a.content}`)
    .join('\n') || 'No key actions available';

  const topKeyPoints = summary.analysis?.core_concepts?.insights
    ?.slice(0, lengthParams.maxPoints)
    .map(p => `• ${p.content}`)
    .join('\n') || 'No key points available';

  const examples = summary.analysis?.practical_application?.code_examples
    ?.slice(0, lengthParams.maxPoints)
    .map(e => `• ${e.content}`)
    .join('\n') || 'No examples available';

  const technicalDetails = summary.analysis?.technical_details?.considerations
    ?.slice(0, lengthParams.maxPoints)
    .map(d => `• ${d.content}`)
    .join('\n') || 'No technical details available';

  const userContext = summary.analysis?.practical_application?.implementation_steps
    ?.slice(0, lengthParams.maxPoints)
    .map(u => `• ${u.content}`)
    .join('\n') || 'No user context available';

  const prompt = `${videoContext.intro}

Create a ${settings.length.toUpperCase()} LinkedIn post using the "${selectedTemplate.name}" format:

Title: ${title}
Channel: ${channelTitle}
Description: ${description}

Summary:
${summary.summary}

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
1. Keep it within ${lengthParams.charRange} characters (${settings.length} format)
2. Use line breaks effectively
3. Include ${settings.length === 'brief' ? '2-3' : '3-5'} relevant hashtags
4. Maintain the specified tone and personality
5. Format for maximum engagement
6. End with the video link${data.metadata?.videoId ? `\n\nVideo Link: https://youtu.be/${data.metadata.videoId}` : ''}`; 

  // Save the prompt to file
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  const promptPath = path.join(dataDir, `${data.metadata?.videoId || 'unknown'}_base_prompt.txt`);
  await fs.writeFile(promptPath, prompt, 'utf-8');

  return prompt;
}

// Format plain text content into HTML with proper styling
function formatContentToHtml(content: string): string {
  if (!content) return '';
  
  // Normalize line endings and clean up extra spaces
  content = content.replace(/\r\n/g, '\n')
                  .replace(/\n{3,}/g, '\n\n')
                  .trim();
  
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  // Process each paragraph
  const formattedParagraphs = paragraphs.map(p => {
    let text = p.trim();
    
    // Escape HTML special characters
    text = text.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] || char));
    
    // Convert URLs to links (after escaping)
    text = text.replace(
      /(https?:\/\/[^\s<>]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600">$1</a>'
    );
    
    // Style hashtags (after escaping)
    text = text.replace(
      /#[\w\u0590-\u05ff]+/g,
      match => `<span class="text-purple-500 font-semibold">${match}</span>`
    );
    
    // Handle single line breaks within paragraphs
    text = text.replace(/\n/g, '<br />');
    
    return `<p class="mb-4">${text}</p>`;
  });
  
  return formattedParagraphs.join('\n');
}

export async function generateLinkedInPost(
  data: VideoData,
  mode: PostGenerationMode,
  settings: PostSettings
): Promise<string> {
  try {
    const prompt = await generatePrompt(data, mode, settings);
    const lengthParams = getPostLengthParams(settings.length);
    
    const finalPrompt = `Create an engaging ${settings.length.toUpperCase()} LinkedIn post about this video.
Focus on providing value while maintaining readability and staying within ${lengthParams.charRange} characters.

Use this information:
${prompt}

Please ensure:
1. The post is engaging and encourages discussion
2. Maintain a professional tone while being accessible
3. Include a clear call to action
4. Keep the total length within ${lengthParams.charRange} characters
5. Always include the video URL before any hashtags
6. Place ${settings.length === 'brief' ? '2-3' : '3-5'} relevant hashtags at the very end
7. Highlight the most impactful insights and practical applications`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",  // Use consistent model
      messages: [
        {
          role: "system",
          content: "You are a professional content writer specializing in technical content for LinkedIn."
        },
        {
          role: "user",
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: settings.length === 'detailed' ? 2500 : 2000
    });

    const rawContent = completion.choices[0].message.content || '';
    return formatContentToHtml(rawContent);
  } catch (error) {
    console.error('Error generating LinkedIn post:', error);
    throw error;
  }
}

export async function generateSummary(transcript: string): Promise<{ summary: string, analysis: any }> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",  // Use consistent model
      messages: [
        {
          role: "system",
          content: `Analyze this video transcript and provide TWO sections:

1. SUMMARY (2-3 sentences):
   Provide a concise but informative summary that captures:
   - The main topic and purpose of the video
   - The key technique or methodology demonstrated
   - The practical value for the target audience

2. ANALYSIS (in JSON format):
   {
     "core_concepts": {
       "key_points": [  // ALWAYS provide at least 3 key points
         { 
           "content": "Specific, actionable concept that was demonstrated or explained",
           "importance": "core" | "key" | "supporting"  // Use these exact labels
         }
       ],
       "insights": [  // ALWAYS provide at least 3 insights
         {
           "content": "Valuable learning or strategic insight derived from the demonstration",
           "importance": "critical" | "valuable" | "helpful"  // Use these exact labels
         }
       ]
     },
     "practical_application": {
       "code_examples": [  // ALWAYS provide at least 3 code examples when code is discussed
         {
           "content": "Complete, runnable code snippet (not just API calls)",
           "description": "Brief explanation of what this code does",
           "importance": "primary" | "alternative" | "advanced",  // Use these exact labels
           "language": "language_name"
         }
       ],
       "implementation_steps": [  // Provide ALL necessary steps for complete implementation
         {
           "content": "Detailed, specific step with exact commands or settings",
           "importance": "required" | "recommended" | "optional",  // Use these exact labels
           "prerequisites": ["Specific tools/accounts/settings needed for this step"],
           "estimated_time": "5-10 minutes",  // Add time estimates
           "order": 1  // Add step order for clarity
         }
       ]
     },
     "technical_details": {
       "requirements": [  // ALWAYS provide at least 2 requirements
         {
           "content": "Specific tool, library, or resource needed",
           "type": "dependency|configuration|environment|account",
           "installation": "Exact installation command or setup step if applicable"
         }
       ],
       "considerations": [  // ALWAYS provide at least 2 considerations
         {
           "content": "Specific action or best practice to follow",
           "category": "performance|security|scalability|maintenance|legal",
           "recommendation": "Exact steps to implement this consideration"
         }
       ],
       "limitations": [  // ALWAYS provide at least 3 limitations
         {
           "content": "Specific limitation or constraint to be aware of",
           "severity": "critical" | "significant" | "minor",  // Use these exact labels
           "workaround": "Specific steps to mitigate this limitation if available"
         }
       ]
     }
   }

Important Guidelines:
- ALWAYS provide the minimum number of items specified for each section:
  * At least 3 key points
  * At least 3 insights
  * At least 3 code examples (when code is discussed)
  * ALL necessary implementation steps (no minimum/maximum - be comprehensive)
  * At least 2 requirements
  * At least 2 considerations
  * At least 3 limitations
- Implementation steps must be exhaustive and cover the entire process
- Each step must include:
  * Clear, specific instructions
  * Required prerequisites
  * Estimated time
  * Step order number
  * Any commands or configurations needed
- Focus on concrete, actionable information
- Include specific commands, configurations, and settings
- Highlight unique approaches and gotchas

Format your response exactly as:
SUMMARY:
[Your 2-3 sentence summary here]

ANALYSIS:
[Your JSON analysis here]`
        },
        {
          role: "user",
          content: `Analyze this video transcript and provide a detailed summary with key points:\n\n${transcript}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const fullResponse = completion.choices[0].message.content || '';
    
    // Split response into summary and analysis
    const summaryMatch = fullResponse.match(/SUMMARY:\n([\s\S]*?)\n\nANALYSIS:/);
    const analysisMatch = fullResponse.match(/ANALYSIS:\n([\s\S]*)/);
    
    const summary = summaryMatch ? summaryMatch[1].trim() : 'No summary available';
    let analysis = {};
    
    try {
      analysis = analysisMatch ? JSON.parse(analysisMatch[1].trim()) : {};
    } catch (e) {
      console.error('Failed to parse analysis JSON:', e);
      analysis = {
        core_concepts: {
          key_points: [],
          insights: []
        }
      };
    }

    return { summary, analysis };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
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
  await fs.writeFile(analysisPath, formattedAnalysis);

  return formattedAnalysis;
}
