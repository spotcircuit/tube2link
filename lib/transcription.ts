import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { preprocessTranscript, PreprocessedData } from './preprocessor';
import { google } from 'googleapis';
import { getConfig } from './config';

const config = getConfig();
const youtube = google.youtube('v3');

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
    const apiKey = config.youtubeApiKey;
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

    // Try to get transcript using youtube API
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
    const response = await youtube.captions.list({
      auth: config.youtubeApiKey,
      part: ['snippet'],
      videoId: videoId
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No captions found for this video');
    }

    // Find English captions, preferring manual over auto-generated
    const captions = response.data.items;
    let captionId = '';

    // First try to find manual English captions
    const manualEnglish = captions.find(
      caption => caption.snippet?.language === 'en' && !caption.snippet?.trackKind?.includes('ASR')
    );

    if (manualEnglish) {
      captionId = manualEnglish.id || '';
    } else {
      // Fall back to auto-generated English captions
      const autoEnglish = captions.find(
        caption => caption.snippet?.language === 'en'
      );
      if (autoEnglish) {
        captionId = autoEnglish.id || '';
      }
    }

    if (!captionId) {
      throw new Error('No English captions found');
    }

    // Download the actual transcript
    const transcript = await youtube.captions.download({
      auth: config.youtubeApiKey,
      id: captionId
    });

    if (!transcript.data) {
      throw new Error('Failed to download transcript');
    }

    // Convert the transcript data to text
    const text = transcript.data.toString();
    return text;

  } catch (error: any) {
    console.error('Error getting transcript:', error);
    throw new Error(`Failed to get transcript: ${error.message}`);
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