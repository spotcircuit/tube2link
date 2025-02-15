import { NextRequest, NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { VideoType } from '@/types/openai';
import { generatePrompt } from '@/lib/video_prompts';

// Helper to detect video type from metadata
function detectVideoType(title: string, description: string): VideoType {
  // Convert to lowercase for easier matching
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Look for review indicators
  if (
    lowerTitle.includes('review') ||
    lowerDesc.includes('review') ||
    lowerTitle.includes('hands on') ||
    lowerDesc.includes('hands on')
  ) {
    return 'review';
  }

  // Look for comparison indicators
  if (
    lowerTitle.includes('vs') ||
    lowerTitle.includes('versus') ||
    lowerDesc.includes('vs') ||
    lowerDesc.includes('versus') ||
    lowerTitle.includes('comparison') ||
    lowerDesc.includes('comparison')
  ) {
    return 'comparison';
  }

  // Look for tutorial indicators
  if (
    lowerTitle.includes('how to') ||
    lowerTitle.includes('tutorial') ||
    lowerTitle.includes('guide') ||
    lowerDesc.includes('how to') ||
    lowerDesc.includes('tutorial') ||
    lowerDesc.includes('guide')
  ) {
    return 'tutorial';
  }

  // Look for recipe indicators
  if (
    lowerTitle.includes('recipe') ||
    lowerTitle.includes('cooking') ||
    lowerTitle.includes('baking') ||
    lowerDesc.includes('recipe') ||
    lowerDesc.includes('cooking') ||
    lowerDesc.includes('baking')
  ) {
    return 'recipe';
  }

  // Look for news indicators
  if (
    lowerTitle.includes('news') ||
    lowerTitle.includes('announcement') ||
    lowerTitle.includes('update') ||
    lowerDesc.includes('news') ||
    lowerDesc.includes('announcement') ||
    lowerDesc.includes('update')
  ) {
    return 'news';
  }

  // Look for commentary indicators
  if (
    lowerTitle.includes('analysis') ||
    lowerTitle.includes('opinion') ||
    lowerTitle.includes('thoughts on') ||
    lowerDesc.includes('analysis') ||
    lowerDesc.includes('opinion') ||
    lowerDesc.includes('thoughts on')
  ) {
    return 'commentary';
  }

  // Default to product if no other type is detected
  return 'product';
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId parameter' }, { status: 400 });
  }

  try {
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo || !videoInfo.rawVideoData || !videoInfo.rawVideoData.snippet) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const videoType = detectVideoType(
      videoInfo.rawVideoData.snippet.title || '',
      videoInfo.rawVideoData.snippet.description || ''
    );

    const prompt = generatePrompt({
      title: videoInfo.rawVideoData.snippet.title || '',
      description: videoInfo.rawVideoData.snippet.description || '',
      type: videoType,
    });

    return NextResponse.json({
      type: videoType,
      prompt,
      videoInfo,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
