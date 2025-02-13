import { NextRequest, NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { VideoType } from '@/lib/video_types';
import { generatePrompt } from '@/lib/video_prompts';

// Helper to detect video type from metadata
function detectVideoType(metadata: any): Array<{ type: VideoType; confidence: number }> {
  const types: Array<{ type: VideoType; confidence: number }> = [];

  // Check title and description for type indicators
  const text = `${metadata.snippet?.title || ''} ${metadata.snippet?.description || ''}`.toLowerCase();

  // Tutorial detection
  if (
    text.includes('tutorial') ||
    text.includes('how to') ||
    text.includes('learn') ||
    text.includes('guide')
  ) {
    types.push({ type: 'tutorial', confidence: 0.8 });
  }

  // Review detection
  if (
    text.includes('review') ||
    text.includes('hands on') ||
    text.includes('unboxing') ||
    text.includes('vs')
  ) {
    types.push({ type: 'review', confidence: 0.8 });
  }

  // Commentary detection
  if (
    text.includes('thoughts on') ||
    text.includes('my take') ||
    text.includes('opinion') ||
    text.includes('reaction')
  ) {
    types.push({ type: 'commentary', confidence: 0.7 });
  }

  // News detection
  if (
    text.includes('news') ||
    text.includes('update') ||
    text.includes('announcement') ||
    text.includes('breaking')
  ) {
    types.push({ type: 'news', confidence: 0.8 });
  }

  // Lifestyle detection
  if (
    text.includes('vlog') ||
    text.includes('lifestyle') ||
    text.includes('day in the life') ||
    text.includes('experience')
  ) {
    types.push({ type: 'lifestyle', confidence: 0.7 });
  }

  // Sort by confidence
  return types.sort((a, b) => b.confidence - a.confidence);
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Extract video ID from URL
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get video info
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      return NextResponse.json({ error: 'Could not fetch video info' }, { status: 404 });
    }

    // Detect possible video types
    const detectedTypes = detectVideoType(videoInfo);

    // Generate prompt for most likely type
    const mostLikelyType = detectedTypes[0]?.type || 'tutorial';
    const prompt = generatePrompt({
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      type: mostLikelyType
    });

    return NextResponse.json({
      metadata: {
        title: videoInfo.snippet?.title,
        description: videoInfo.snippet?.description?.slice(0, 200) + '...',
        channelTitle: videoInfo.snippet?.channelTitle,
        publishedAt: videoInfo.snippet?.publishedAt,
        statistics: videoInfo.statistics
      },
      typeDetection: {
        possibleTypes: detectedTypes,
        mostLikelyType
      },
      prompt: {
        type: mostLikelyType,
        prompt
      }
    });

  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
