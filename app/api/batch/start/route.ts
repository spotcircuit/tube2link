import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { getConfig } from '@/lib/config';
import { VideoData } from '@/types/video';
import { PostSettings } from '@/types/post';
import { PostGenerationMode } from '@/lib/openai';
import { PreprocessedData } from '@/lib/preprocessor';
import * as path from 'path';
import * as fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { videoData, preprocessedData, mode, settings } = await request.json();
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // Generate batch ID
    const batchId = `batch_${Date.now()}_${videoData.id}`;
    
    // Save the base prompt
    const basePromptPath = path.join(dataDir, `${videoData.id}_base_prompt.txt`);
    const enrichedPromptPath = path.join(dataDir, `${videoData.id}_enriched_prompt.txt`);

    // Generate base prompt
    const basePrompt = `Title: ${videoData.title}
Channel: ${videoData.channelTitle}
Mode: ${mode}
Settings: ${JSON.stringify(settings, null, 2)}

Preprocessed Data:
${JSON.stringify(preprocessedData, null, 2)}`;

    await fs.writeFile(basePromptPath, basePrompt, 'utf-8');
    console.log(`Base prompt saved to: ${basePromptPath}`);

    // Generate enriched prompt
    const enrichedPrompt = `Generate a LinkedIn post based on the following video content:

REQUIRED LENGTH: ${settings.length === 'brief' ? '150-200' : settings.length === 'standard' ? '200-300' : '300-500'} words (excluding URL and hashtags)

Video Title: ${videoData.title}
Channel: ${videoData.channelTitle}
Video URL: https://youtube.com/watch?v=${videoData.id}

Key Points:
${preprocessedData.patterns?.key_points?.map((p: any) => `- ${p.content}`).join('\n') || 'No key points available'}

Examples:
${preprocessedData.patterns?.examples?.map((e: any) => `- ${e.content}`).join('\n') || 'No examples available'}

Technical Details:
${preprocessedData.roles?.developer?.map((d: any) => `- ${d.content}`).join('\n') || 'No technical details available'}

Target Audience:
${preprocessedData.roles?.user?.map((u: any) => `- ${u.content}`).join('\n') || 'No target audience information available'}

Important Actions:
${preprocessedData.semantic?.actions?.filter((a: any) => a.importance > 0.5).map((a: any) => `- ${a.content}`).join('\n') || 'No important actions available'}

Problems Addressed:
${preprocessedData.semantic?.problems?.filter((p: any) => p.importance > 0.5).map((p: any) => `- ${p.content}`).join('\n') || 'No problems addressed available'}

Writing Style:
- Professional and engaging
- Highlight technical insights
- Include practical takeaways
- Use appropriate emojis for tech content
- Include the video URL (https://youtube.com/watch?v=${videoData.id}) as a plain URL before hashtags, not as a markdown link
- Include 2-3 relevant hashtags at the very end

IMPORTANT: The post must be ${settings.length === 'brief' ? '150-200' : settings.length === 'standard' ? '200-300' : '300-500'} words long (excluding URL and hashtags). Count your words carefully.`;

    await fs.writeFile(enrichedPromptPath, enrichedPrompt, 'utf-8');
    console.log(`Enriched prompt saved to: ${enrichedPromptPath}`);

    // Initialize OpenAI client
    const openai = getOpenAIClient();
    console.log('Initialized OpenAI client');

    let batchResults = [];

    // Single batch call
    console.log('Processing single batch');

    // Generate post
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn content creator. Generate a concise, engaging LinkedIn post based on the provided context and guidelines. IMPORTANT: You must strictly adhere to the specified word count range. Count your words carefully and ensure the post (excluding URL and hashtags) falls within the target length.`
        },
        {
          role: "user",
          content: enrichedPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: settings.length === 'brief' ? 300 : settings.length === 'standard' ? 450 : 750
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content generated from OpenAI');
    }

    const generatedPost = completion.choices[0].message.content;
    batchResults.push(generatedPost);

    // Save result
    const batchResultPath = path.join(dataDir, `${videoData.id}_batch_result.txt`);
    await fs.writeFile(batchResultPath, generatedPost, 'utf-8');
    console.log(`Result saved to: ${batchResultPath}`);
    
    // Save batch metadata
    const batchMetadataPath = path.join(dataDir, `${videoData.id}_batch_metadata.json`);
    await fs.writeFile(batchMetadataPath, JSON.stringify({
      batchId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      model: 'gpt-4o-mini-2024-07-18',
      inputFile: enrichedPromptPath,
      outputFile: batchResultPath,
      totalBatches: 1,
      estimatedTokens: enrichedPrompt.length / 4 // Rough estimate
    }, null, 2), 'utf-8');
    console.log(`Batch metadata saved to: ${batchMetadataPath}`);

    return NextResponse.json({
      batchId,
      status: 'completed',
      message: 'Successfully processed batch'
    });

  } catch (error: any) {
    console.error('Error in batch processing:', error?.message || error);
    
    return NextResponse.json(
      { error: error?.message || 'Failed to process batch' },
      { status: 500 }
    );
  }
}
