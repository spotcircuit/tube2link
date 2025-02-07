import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream';
const streamPipeline = promisify(pipeline);

// Initialize Google Cloud clients
const storage = new Storage();
const speech = new SpeechClient();
const bucket = storage.bucket(process.env.STORAGE_BUCKET || '');

export async function transcribeYouTubeVideo(videoId: string): Promise<string> {
  try {
    // Download audio from YouTube
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const audioStream = ytdl(videoUrl, { 
      quality: 'lowest', 
      filter: 'audioonly' 
    });

    // Convert to mono FLAC format (required by Google Speech-to-Text)
    const flacStream = ffmpeg(audioStream)
      .toFormat('flac')
      .audioChannels(1)
      .audioFrequency(16000)
      .pipe();

    // Upload to Google Cloud Storage
    const filename = `${videoId}-${Date.now()}.flac`;
    const file = bucket.file(filename);
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/flac'
      }
    });

    await streamPipeline(flacStream, writeStream);

    // Create Speech-to-Text request
    const [operation] = await speech.longRunningRecognize({
      audio: {
        uri: `gs://${bucket.name}/${filename}`
      },
      config: {
        encoding: 'FLAC',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'video',
        useEnhanced: true
      },
    });

    // Wait for transcription to complete
    const [response] = await operation.promise();

    // Delete the audio file
    await file.delete();

    // Combine all transcriptions
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(' ');

    return transcription || '';
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function generateLinkedInPost(transcription: string, title: string): Promise<string> {
  // Split transcription into chunks if it's too long
  const chunks = splitIntoChunks(transcription, 4000);
  
  // Extract key points from each chunk
  const keyPoints = await Promise.all(chunks.map(async chunk => {
    try {
      // Use Google Cloud Natural Language API to extract key points
      // This is a placeholder - implement actual extraction logic
      return chunk.split('.').slice(0, 3).join('.');
    } catch (error) {
      console.error('Error extracting key points:', error);
      return '';
    }
  }));

  // Combine key points into a LinkedIn post
  const post = `🎥 Just watched: "${title}"

🔍 Key Takeaways:
${keyPoints.map(point => `• ${point}`).join('\n')}

Watch the full video: https://youtu.be/${videoId}

#ContentCreation #Learning #ProfessionalDevelopment`;

  return post;
}

function splitIntoChunks(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  text.split('.').forEach(sentence => {
    if ((currentChunk + sentence).length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '.';
    }
  });

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
