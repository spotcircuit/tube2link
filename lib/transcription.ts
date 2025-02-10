import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { preprocessTranscript, PreprocessedData } from './preprocessor';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const execAsync = promisify(exec);

interface TranscriptionData {
  transcription: string;
  preprocessed?: PreprocessedData;
  filepath: string;
}

async function writeTranscriptionToFile(
  videoId: string, 
  title: string, 
  transcription: string, 
  preprocessed?: PreprocessedData
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `${videoId}_${timestamp}.txt`;
  const filepath = join(process.cwd(), 'transcriptions', filename);

  const content = {
    title,
    videoId,
    transcribedAt: new Date().toISOString(),
    transcription,
    preprocessed
  };

  await writeFile(filepath, JSON.stringify(content, null, 2), 'utf-8');
  return filepath;
}

export async function transcribeYouTubeVideo(videoId: string): Promise<TranscriptionData | null> {
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
      console.log('Could not get transcript for video:', videoId);
      return null;
    }

    // Preprocess the transcript
    console.log('Preprocessing transcript...');
    const preprocessed = await preprocessTranscript(transcript, (step: string) => {
      console.log(`Processing: ${step}`);
    });

    // Save to file
    const filepath = await writeTranscriptionToFile(videoId, title, transcript, preprocessed);

    return {
      transcription: transcript,
      preprocessed,
      filepath
    };

  } catch (error) {
    console.error('Error in transcribeYouTubeVideo:', error);
    return null;
  }
}

export async function getTranscriptFast(videoId: string): Promise<string | null> {
  try {
    // Use the youtube-transcript-api module directly
    const { YoutubeTranscript } = require('youtube-transcript');
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      console.error('No transcript available for video:', videoId);
      return null;
    }

    // Combine all text parts into one string
    const fullTranscript = transcriptItems
      .map((item: { text: string }) => item.text)
      .join(' ');

    return fullTranscript;
  } catch (error) {
    console.error('Error getting transcript:', error);
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