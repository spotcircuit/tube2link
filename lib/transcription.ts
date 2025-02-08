import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { SpeechClient } from '@google-cloud/speech';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
  }
});

export async function findExistingTranscription(videoId: string): Promise<{ transcription: string; filepath: string } | null> {
  // Dummy implementation: assume no existing transcription
  // Return null to indicate that no transcription exists
  return null;
}

async function downloadAndConvertAudio(videoId: string): Promise<string> {
  const tempDir = tmpdir();
  const audioPath = join(tempDir, `${videoId}.wav`);

  try {
    // Download audio using ytdl
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const audioStream = ytdl(videoUrl, { quality: 'highestaudio' });

    // Convert to WAV using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(audioStream)
        .toFormat('wav')
        .on('end', resolve)
        .on('error', reject)
        .save(audioPath);
    });

    return audioPath;
  } catch (error) {
    console.error('Error downloading/converting audio:', error);
    throw error;
  }
}

async function transcribeAudioWithSpeechToText(audioPath: string): Promise<string> {
  try {
    // Read the audio file
    const audioBytes = await readFile(audioPath);

    const audio = {
      content: audioBytes.toString('base64'),
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      model: 'latest_long',
      useEnhanced: true
    };

    const request = {
      audio: audio,
      config: config,
    };

    console.log('Starting Speech-to-Text transcription...');
    const [response] = await speechClient.recognize(request);
    console.log('Speech-to-Text transcription completed:', {
      resultsCount: response.results?.length,
      hasTranscript: !!response.results?.[0]?.alternatives?.[0]?.transcript
    });

    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join('\n');

    return transcription || '';
  } finally {
    // Clean up the temporary audio file
    try {
      await unlink(audioPath);
    } catch (error) {
      console.error('Error cleaning up audio file:', error);
    }
  }
}

async function writeTranscriptionToFile(videoId: string, title: string, transcription: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `${videoId}_${timestamp}.txt`;
  const filepath = join(process.cwd(), 'transcriptions', filename);

  const content = `Title: ${title}\nVideo ID: ${videoId}\nTranscribed at: ${new Date().toISOString()}\n\nTranscription:\n${transcription}`;
  await writeFile(filepath, content, 'utf-8');
  return filepath;
}

export async function transcribeYouTubeVideo(videoId: string, useSpeechToText: boolean): Promise<string | null> {
  try {
    // Get video details including captions
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is missing');
    }

    // First check if captions are available
    const videoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`
    );

    if (!videoResponse.data.items?.[0]) {
      console.log('Video not found:', videoId);
      return null;
    }

    const videoDetails = videoResponse.data.items[0];
    const hasCaption = videoDetails.contentDetails.caption === 'true';
    const title = videoDetails.snippet.title;

    if (!hasCaption && !useSpeechToText) {
      console.log('No captions available for video:', videoId);
      return null;
    }

    let transcription: string | null = null;

    // If no captions and Speech-to-Text is enabled, use that instead
    if (!hasCaption && useSpeechToText) {
      console.log('Using Speech-to-Text for video:', videoId);
      try {
        const audioPath = await downloadAndConvertAudio(videoId);
        transcription = await transcribeAudioWithSpeechToText(audioPath);
      } catch (error) {
        console.error('Speech-to-Text transcription failed:', error);
        return null;
      }
    } else {
      // Get available caption tracks
      const captionsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${(await oauth2Client.getAccessToken()).token}`
          }
        }
      );

      if (!captionsResponse.data.items?.length) {
        console.log('No caption tracks found for video:', videoId);
        return null;
      }

      // Prefer English captions, fall back to first available
      const captionTrack = captionsResponse.data.items.find(
        (track: any) => track.snippet.language === 'en'
      ) || captionsResponse.data.items[0];

      // Get the transcript using the YouTube Data API
      const transcriptResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}?tfmt=srt&key=${apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${(await oauth2Client.getAccessToken()).token}`
          }
        }
      );

      transcription = transcriptResponse.data;
    }

    // Write transcription to file if we got one
    if (transcription) {
      await writeTranscriptionToFile(videoId, title, transcription);
    }

    return transcription;
  } catch (error: any) {
    console.error('Error getting captions:', error.response?.data || error);
    if (error.response?.status === 403) {
      console.error('Permission denied. Make sure you have the correct OAuth scopes.');
    }
    return null;
  }
}

export async function generateLinkedInPost(transcription: string, title: string, videoUrl: string): Promise<string> {
  // TODO: Implement post generation logic using the transcription and title
  // Return a dummy LinkedIn post for now
  return `LinkedIn post for ${title}:\n${transcription}`;
}

export { oauth2Client };