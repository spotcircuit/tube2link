import { google } from 'googleapis';
import { getConfig } from './config';

const config = getConfig();
const youtube = google.youtube('v3');

export async function getVideoInfo(videoId: string) {
  try {
    const response = await youtube.videos.list({
      auth: config.youtubeApiKey,
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId]
    });

    return response.data.items?.[0];
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

// Add more YouTube API functions as needed...
