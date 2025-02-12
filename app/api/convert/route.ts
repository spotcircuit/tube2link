import { NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { getTranscriptFast } from '@/lib/transcription';
import { getConfig } from '@/lib/config';

const config = getConfig();

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    console.log('Processing URL:', videoUrl);
    
    // Extract video ID from URL (including Shorts)
    let videoId: string | null = null;
    try {
      // Handle direct video IDs first
      if (!videoUrl.includes('http') && !videoUrl.includes('/')) {
        videoId = videoUrl.trim();
      } else {
        const url = new URL(videoUrl);
        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          if (url.pathname.includes('/shorts/')) {
            // Handle YouTube Shorts URL
            videoId = url.pathname.split('/shorts/')[1].split('/')[0];
            console.log('Detected YouTube Short:', videoId);
          } else if (url.hostname === 'youtu.be') {
            // Handle youtu.be URLs
            videoId = url.pathname.slice(1);
          } else {
            // Handle regular YouTube URL
            videoId = url.searchParams.get('v');
          }
        }
      }
    } catch (error) {
      console.error('URL parsing error:', error);
    }

    if (!videoId) {
      return NextResponse.json({ 
        error: 'Invalid YouTube URL', 
        details: `Could not extract video ID from URL: ${videoUrl}`
      }, { status: 400 });
    }

    console.log('Extracted video ID:', videoId);

    try {
      // Get video info first
      const videoInfo = await getVideoInfo(videoId);
      if (!videoInfo) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      // Get transcription
      const transcription = await getTranscriptFast(videoId);

      return NextResponse.json({
        transcription,
        videoInfo: {
          id: videoId,
          title: videoInfo.snippet?.title,
          description: videoInfo.snippet?.description,
          channelId: videoInfo.snippet?.channelId,
          channelTitle: videoInfo.snippet?.channelTitle,
          tags: videoInfo.snippet?.tags,
          duration: videoInfo.contentDetails?.duration
        }
      });
    } catch (error: any) {
      console.error('Error processing video:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to process video' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
