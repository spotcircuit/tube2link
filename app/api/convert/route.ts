import { NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { VideoMetadata } from '@/types/video';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    console.log('Processing URL:', videoUrl);
    
    // Extract video ID from URL (including Shorts)
    let videoId: string | null = null;
    let isShort = false;

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
            isShort = true;
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
      console.error('Error extracting video ID:', error);
      throw new Error('Invalid YouTube URL or video ID');
    }

    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    // Get video info from YouTube API
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      throw new Error('Could not fetch video info from YouTube');
    }

    // Prepare metadata
    const metadata: VideoMetadata = {
      videoId,
      url: isShort 
        ? `https://www.youtube.com/shorts/${videoId}`
        : `https://www.youtube.com/watch?v=${videoId}`,
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      channelTitle: videoInfo.snippet?.channelTitle || '',
      channelDescription: videoInfo.snippet?.channelDescription || '',
      channelCategory: videoInfo.snippet?.categoryId || '',
      publishedAt: videoInfo.snippet?.publishedAt || '',
      duration: videoInfo.contentDetails?.duration || '',
      thumbnails: videoInfo.snippet?.thumbnails || {},
      tags: videoInfo.snippet?.tags || []
    };

    return NextResponse.json({
      status: 'success',
      videoId,
      isShort,
      metadata
    });

  } catch (error) {
    console.error('Error in convert endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
