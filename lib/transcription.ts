import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const execAsync = promisify(exec);

interface TranscriptionData {
  transcription: string;
  filepath: string;
}

async function writeTranscriptionToFile(videoId: string, title: string, transcription: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `${videoId}_${timestamp}.txt`;
  const filepath = join(process.cwd(), 'transcriptions', filename);

  const content = `Title: ${title}\nVideo ID: ${videoId}\nTranscribed at: ${new Date().toISOString()}\n\nTranscription:\n${transcription}`;
  await writeFile(filepath, content, 'utf-8');
  return filepath;
}

export async function transcribeYouTubeVideo(videoId: string): Promise<string | null> {
  try {
    // Get video details from YouTube API
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is missing');
    }

    const videoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    if (!videoResponse.data.items?.[0]) {
      console.log('Video not found:', videoId);
      return null;
    }

    const title = videoResponse.data.items[0].snippet.title;

    // Try to get transcript using youtube-transcript-api
    const transcript = await getTranscriptFast(videoId);
    if (!transcript) {
      console.log('No transcript available for video:', videoId);
      return null;
    }

    // Write transcription to file
    await writeTranscriptionToFile(videoId, title, transcript);
    return transcript;
  } catch (error: any) {
    console.error('Error getting transcription:', error.response?.data || error);
    return null;
  }
}

export async function getTranscriptFast(videoId: string): Promise<string | null> {
  try {
    // Call the Python script with the video ID
    const { stdout, stderr } = await execAsync(`python scripts/test-captions.py ${videoId}`);
    
    if (stderr) {
      console.error('Error getting transcript:', stderr);
      return null;
    }

    return stdout || null;
  } catch (error) {
    console.error('Error executing Python script:', error);
    return null;
  }
}

export async function findExistingTranscription(videoId: string): Promise<TranscriptionData | null> {
  // TODO: Implement transcription lookup
  return null;
}

export async function generateLinkedInPost(transcription: string, title: string, videoUrl: string): Promise<string> {
  // TODO: Implement post generation logic using the transcription and title
  // Return a dummy LinkedIn post for now
  return `LinkedIn post for ${title}:\n${transcription}`;
}

export { oauth2Client };