import { google } from 'googleapis';
import { getConfig } from './config';
import { oauth2Client } from './auth';

const config = getConfig();
const youtube = google.youtube('v3');

export async function getVideoInfo(videoId: string) {
  const auth = config.authMode === 'oauth' ? oauth2Client : config.youtubeApiKey;

  try {
    const response = await youtube.videos.list({
      auth,
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
  const auth = config.authMode === 'oauth' ? oauth2Client : config.youtubeApiKey;

  try {
    const response = await youtube.captions.list({
      auth,
      part: ['snippet'],
      videoId
    });

    // Process captions...
    return response.data.items;
  } catch (error) {
    console.error('Error fetching video transcript:', error);
    throw error;
  }
}

// Add more YouTube API functions as needed...
