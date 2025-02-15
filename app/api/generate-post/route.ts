import { NextResponse } from 'next/server'
import { generateSocialPost } from '@/lib/social_post_generator'
import { VideoData } from '@/types/video'
import { PostSettings } from '@/types/post'
import { PostGenerationMode } from '@/types/post'

interface GeneratePostRequest {
  videoData: VideoData;
  template: PostGenerationMode;
  settings: PostSettings;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json() as GeneratePostRequest;
    const { videoData, template, settings } = body;

    // Type guard for required data
    if (!videoData?.url || !template || !settings?.tone) {
      return NextResponse.json(
        { error: 'Missing required data: videoData.url, template, or settings.tone' },
        { status: 400 }
      );
    }

    // Generate post content
    const content = await generateSocialPost(
      videoData,
      template,
      settings
    );

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
