import { NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { getTranscriptFast } from '@/lib/transcription';
import { getConfig } from '@/lib/config';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const config = getConfig();

async function ensureDirectory(dir: string) {
  try {
    await writeFile(join(dir, '.gitkeep'), '', { flag: 'wx' });
  } catch (error: any) {
    // Directory likely exists, ignore error
    if (error.code !== 'EEXIST') {
      console.error('Error creating directory:', error);
    }
  }
}

async function saveMetadataToFile(videoId: string, data: any, type: 'meta' | 'analysis') {
  try {
    const dataDir = join(process.cwd(), 'data');
    await ensureDirectory(dataDir);

    const filename = `video_${type}_${videoId}.json`;
    const filepath = join(dataDir, filename);

    // Ensure we're not truncating any data
    const jsonString = JSON.stringify(data, null, 2);
    await writeFile(filepath, jsonString, 'utf8');
    console.log(`Saved ${type} data to:`, filepath);
    return filepath;
  } catch (error) {
    console.error(`Error saving ${type} data:`, error);
    throw error;
  }
}

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

    // Get video info first
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      return NextResponse.json({ 
        error: 'Video not found',
        details: `Could not fetch video info for ID: ${videoId}`
      }, { status: 404 });
    }

    // Try to get transcript, but don't fail if unavailable
    let transcript: string | null = null;
    try {
      transcript = await getTranscriptFast(videoId);
    } catch (error) {
      console.log('Transcript unavailable:', error.message);
      // Continue processing without transcript
    }

    // Process video metadata
    const metadata = {
      videoId,
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      channelTitle: videoInfo.snippet?.channelTitle || '',
      channelId: videoInfo.snippet?.channelId || '',
      publishedAt: videoInfo.snippet?.publishedAt || '',
      thumbnails: {
        default: videoInfo.snippet?.thumbnails?.default || null,
        medium: videoInfo.snippet?.thumbnails?.medium || null,
        high: videoInfo.snippet?.thumbnails?.high || null,
        standard: videoInfo.snippet?.thumbnails?.standard || null,
        maxres: videoInfo.snippet?.thumbnails?.maxres || null
      },
      statistics: {
        viewCount: parseInt(videoInfo.statistics?.viewCount || '0', 10),
        likeCount: parseInt(videoInfo.statistics?.likeCount || '0', 10),
        commentCount: parseInt(videoInfo.statistics?.commentCount || '0', 10),
        favoriteCount: parseInt(videoInfo.statistics?.favoriteCount || '0', 10)
      },
      contentDetails: {
        duration: videoInfo.contentDetails?.duration || '',
        dimension: videoInfo.contentDetails?.dimension || '',
        definition: videoInfo.contentDetails?.definition || '',
        caption: videoInfo.contentDetails?.caption || '',
        licensedContent: videoInfo.contentDetails?.licensedContent || false,
        projection: videoInfo.contentDetails?.projection || '',
        regionRestriction: videoInfo.contentDetails?.regionRestriction || null
      },
      status: {
        privacyStatus: videoInfo.status?.privacyStatus || '',
        uploadStatus: videoInfo.status?.uploadStatus || '',
        embeddable: videoInfo.status?.embeddable || false,
        publicStatsViewable: videoInfo.status?.publicStatsViewable || false,
        madeForKids: videoInfo.status?.madeForKids || false
      },
      tags: videoInfo.snippet?.tags || [],
      category: videoInfo.snippet?.categoryId || '',
      defaultLanguage: videoInfo.snippet?.defaultLanguage,
      defaultAudioLanguage: videoInfo.snippet?.defaultAudioLanguage,
      liveBroadcastContent: videoInfo.snippet?.liveBroadcastContent || 'none',
      localized: videoInfo.snippet?.localized || null,
      transcript: transcript || undefined,
      hasTranscript: !!transcript,
      processedAt: new Date().toISOString(),
      url: `https://www.youtube.com/watch?v=${videoId}`
    };

    // Save metadata to file
    const metaFilePath = await saveMetadataToFile(videoId, metadata, 'meta');

    // Initial analysis data
    const analysisData = {
      metadata: {
        videoId,
        title: metadata.title,
        description: metadata.description,
        channelTitle: metadata.channelTitle,
        publishedAt: metadata.publishedAt,
        url: metadata.url,
        statistics: metadata.statistics,
        hasTranscript: metadata.hasTranscript,
        thumbnails: {
          default: metadata.thumbnails.default?.url,
          high: metadata.thumbnails.high?.url,
          maxres: metadata.thumbnails.maxres?.url
        }
      },
      analysis: {
        type: null, // Will be determined by AI
        confidence: null,
        processedAt: new Date().toISOString(),
        topics: [],
        keyPoints: [],
        suggestedPrompts: []
      }
    };

    // Save initial analysis to file
    const analysisFilePath = await saveMetadataToFile(videoId, analysisData, 'analysis');

    return NextResponse.json({
      success: true,
      metadata,
      files: {
        metadata: metaFilePath,
        analysis: analysisFilePath
      }
    });

  } catch (error: any) {
    console.error('Error processing video:', error);
    return NextResponse.json({ 
      error: 'Failed to process video', 
      details: error.message 
    }, { status: 500 });
  }
}
