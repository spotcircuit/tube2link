import { NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { VideoMetadata } from '@/types/video';
import { youtube_v3 } from 'googleapis';

export const dynamic = 'force-dynamic';

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
            const shortsPath = url.pathname.split('/shorts/')[1];
            if (shortsPath) {
              videoId = shortsPath.split('/')[0] || null;
              isShort = !!videoId;
            }
          } else if (url.hostname === 'youtu.be') {
            // Handle youtu.be URLs
            const path = url.pathname.slice(1);
            videoId = path || null;
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

    const { rawVideoData: video } = videoInfo;
    if (!video || !video.snippet) {
      throw new Error('Invalid video data received from YouTube');
    }

    // Prepare metadata
    const metadata: VideoMetadata = {
      videoId,
      url: videoUrl,
      title: video.snippet.title || '',
      channelTitle: video.snippet.channelTitle || '',
      description: video.snippet.description || '',
      channelDescription: '',  // We'll populate this later if needed
      channelCategory: video.snippet.categoryId || '',
      publishedAt: video.snippet.publishedAt || '',
      duration: video.contentDetails?.duration || '',
      category: video.snippet.categoryId || '',
      thumbnails: {
        ...(video.snippet.thumbnails?.default && {
          default: {
            url: video.snippet.thumbnails.default.url || '',
            width: video.snippet.thumbnails.default.width || 0,
            height: video.snippet.thumbnails.default.height || 0
          }
        }),
        ...(video.snippet.thumbnails?.high && {
          high: {
            url: video.snippet.thumbnails.high.url || '',
            width: video.snippet.thumbnails.high.width || 0,
            height: video.snippet.thumbnails.high.height || 0
          }
        }),
        ...(video.snippet.thumbnails?.maxres && {
          maxres: {
            url: video.snippet.thumbnails.maxres.url || '',
            width: video.snippet.thumbnails.maxres.width || 0,
            height: video.snippet.thumbnails.maxres.height || 0
          }
        }),
        ...(video.snippet.thumbnails?.medium && {
          medium: {
            url: video.snippet.thumbnails.medium.url || '',
            width: video.snippet.thumbnails.medium.width || 0,
            height: video.snippet.thumbnails.medium.height || 0
          }
        }),
        ...(video.snippet.thumbnails?.standard && {
          standard: {
            url: video.snippet.thumbnails.standard.url || '',
            width: video.snippet.thumbnails.standard.width || 0,
            height: video.snippet.thumbnails.standard.height || 0
          }
        })
      },
      metrics: {
        viewCount: parseInt(video.statistics?.viewCount || '0', 10),
        likeCount: parseInt(video.statistics?.likeCount || '0', 10),
        commentCount: parseInt(video.statistics?.commentCount || '0', 10)
      },
      tags: video.snippet.tags || [],
      isShort
    };

    return NextResponse.json({ 
      status: 'success', 
      metadata 
    });

  } catch (error) {
    console.error('Error processing video URL:', error);
    return NextResponse.json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { 
      status: 400 
    });
  }
}
