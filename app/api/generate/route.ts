import { NextResponse } from 'next/server';
import { PostGenerationMode } from '@/types/post';
import { generatePrompt } from '@/lib/openai';
import { generateSocialPost } from '@/lib/social_post_generator';
import { VideoData } from '@/types/video';

export async function POST(request: Request) {
  try {
    const { data, mode, settings, preview } = await request.json();
    console.log('API received:', { data, mode, settings, preview });

    // Construct VideoData with required fields
    const videoData: VideoData = {
      videoId: data.id,
      url: data.url,
      title: data.title || '',
      description: data.description || '',
      channelTitle: data.channelTitle || '',
      summary: data.summary
    };

    if (preview) {
      // For preview, just generate and return the base prompt
      try {
        const prompt = await generatePrompt(videoData, mode, settings);
        if (typeof prompt !== 'string') {
          console.error('Prompt is not a string:', prompt);
          return NextResponse.json(
            { error: 'Generated prompt was not a string' },
            { status: 500 }
          );
        }
        return NextResponse.json({ prompt });
      } catch (error) {
        console.error('Error generating prompt:', error);
        return NextResponse.json(
          { error: 'Failed to generate prompt: ' + (error as Error).message },
          { status: 500 }
        );
      }
    } else {
      // For LinkedIn post, generate enriched prompt and start batch processing
      try {
        const prompt = await generateSocialPost(videoData, mode, settings);
        
        // Start batch processing
        const batchResponse = await fetch(new URL('/api/batch/start', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoData: {
              id: data.id,
              title: data.title,
              channelTitle: data.channelTitle
            },
            preprocessedData: {
              patterns: data.patterns || {},
              semantic: data.semantic || {},
              roles: data.roles || {}
            },
            mode,
            settings
          })
        });

        if (!batchResponse.ok) {
          console.error('Batch processing failed:', await batchResponse.text());
          return NextResponse.json({ 
            prompt,
            error: 'Failed to start batch processing'
          });
        }

        const batchResult = await batchResponse.json();
        
        return NextResponse.json({ 
          prompt,
          batchId: batchResult.batchId,
          status: batchResult.status,
          message: batchResult.message
        });
      } catch (error) {
        console.error('Error generating LinkedIn post:', error);
        return NextResponse.json(
          { error: 'Failed to generate LinkedIn post: ' + (error as Error).message },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
