import { NextResponse } from 'next/server';
import { preprocessTranscript } from '@/lib/preprocessor';
import { getVideoType } from '@/lib/video_context';
import { formatDetailedAnalysis } from '@/lib/openai';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { videoData, processId } = await request.json();
    console.log('API received:', { videoData, processId });

    if (!videoData?.transcription) {
      return NextResponse.json({ error: 'No transcription provided' }, { status: 400 });
    }

    // Preprocess data using preprocessTranscript 
    const preprocessed = await preprocessTranscript(videoData.transcription, (step: string) => {
      console.log(`Processing: ${step}`);
    });
    console.log('Preprocessed data:', preprocessed);

    // Generate detailed analysis
    const detailedAnalysis = await formatDetailedAnalysis(preprocessed);
    console.log('Generated detailed analysis:', detailedAnalysis);

    // Detect video type
    const metadata = {
      videoId: videoData.id,
      title: videoData.title,
      channelTitle: videoData.channelTitle,
      description: videoData.description,
    };
    const videoType = getVideoType({ metadata });

    // Save preprocessed data to file
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    const preprocessedPath = path.join(dataDir, `${videoData.id}_preprocessed.json`);
    await fs.writeFile(preprocessedPath, JSON.stringify({
      metadata,
      videoType,
      patterns: preprocessed.patterns,
      semantic: preprocessed.semantic,
      roles: preprocessed.roles
    }, null, 2));

    const response = {
      preprocessed: {
        id: videoData.id,
        metadata,
        videoType,
        patterns: preprocessed.patterns,
        semantic: preprocessed.semantic,
        roles: preprocessed.roles
      },
      detailedAnalysis
    };
    console.log('Sending response:', response);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Preprocessing error:', error);
    return NextResponse.json(
      { error: 'Failed to preprocess video', details: error.message },
      { status: 500 }
    );
  }
}
