import { google, youtube_v3 } from 'googleapis';
import { getConfig } from './config';
import { VideoMetadata } from '@/types/video';

const config = getConfig();
const youtube = google.youtube('v3');

export async function getVideoInfo(videoId: string): Promise<{ videoMetadata: VideoMetadata | null; rawVideoData: youtube_v3.Schema$Video | null } | null> {
  try {
    const response = await youtube.videos.list({
      auth: config.youtubeApiKey,
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId]
    });

    const videoInfo = response.data.items?.[0];

    if (!videoInfo) {
      return null;
    }

    // Map YouTube thumbnail format to our VideoData format
    const thumbnails = videoInfo.snippet?.thumbnails ? {
      default: videoInfo.snippet.thumbnails.default ? {
        url: videoInfo.snippet.thumbnails.default.url ?? undefined,
        width: videoInfo.snippet.thumbnails.default.width ?? undefined,
        height: videoInfo.snippet.thumbnails.default.height ?? undefined
      } : undefined,
      high: videoInfo.snippet.thumbnails.high ? {
        url: videoInfo.snippet.thumbnails.high.url ?? undefined,
        width: videoInfo.snippet.thumbnails.high.width ?? undefined,
        height: videoInfo.snippet.thumbnails.high.height ?? undefined
      } : undefined,
      maxres: videoInfo.snippet.thumbnails.maxres ? {
        url: videoInfo.snippet.thumbnails.maxres.url ?? undefined,
        width: videoInfo.snippet.thumbnails.maxres.width ?? undefined,
        height: videoInfo.snippet.thumbnails.maxres.height ?? undefined
      } : undefined,
      medium: videoInfo.snippet.thumbnails.medium ? {
        url: videoInfo.snippet.thumbnails.medium.url ?? undefined,
        width: videoInfo.snippet.thumbnails.medium.width ?? undefined,
        height: videoInfo.snippet.thumbnails.medium.height ?? undefined
      } : undefined,
      standard: videoInfo.snippet.thumbnails.standard ? {
        url: videoInfo.snippet.thumbnails.standard.url ?? undefined,
        width: videoInfo.snippet.thumbnails.standard.width ?? undefined,
        height: videoInfo.snippet.thumbnails.standard.height ?? undefined
      } : undefined
    } : undefined;

    const videoMetadata: VideoMetadata = {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: videoInfo.snippet?.title ?? '',
      description: videoInfo.snippet?.description ?? '',
      channelTitle: videoInfo.snippet?.channelTitle ?? '',
      publishedAt: videoInfo.snippet?.publishedAt ?? undefined,
      duration: videoInfo.contentDetails?.duration ?? undefined,
      thumbnails: thumbnails || undefined,
      tags: videoInfo.snippet?.tags ?? undefined,
      metrics: {
        viewCount: videoInfo.statistics?.viewCount ? Number(videoInfo.statistics.viewCount) : undefined,
        likeCount: videoInfo.statistics?.likeCount ? Number(videoInfo.statistics.likeCount) : undefined,
        commentCount: videoInfo.statistics?.commentCount ? Number(videoInfo.statistics.commentCount) : undefined
      }
    };

    return { videoMetadata, rawVideoData: videoInfo };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

export async function getVideoTranscript(videoId: string) {
  try {
    const response = await youtube.captions.list({
      auth: config.youtubeApiKey,
      part: ['snippet'],
      videoId
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    // Find English captions
    const englishCaption = response.data.items.find(
      item => item.snippet?.language === 'en'
    );

    if (!englishCaption) {
      return null;
    }

    return englishCaption;
  } catch (error) {
    console.error('Error fetching video transcript:', error);
    throw error;
  }
}

export async function getChannelInfo(channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items?.[0];
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw error;
  }
}
