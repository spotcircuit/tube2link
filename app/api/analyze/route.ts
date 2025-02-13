import { NextResponse } from 'next/server';
import { analyzeVideo } from '@/lib/video/analysis';
import { VideoMetadata } from '@/types/video';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { metadata } = await request.json();

    // Run analysis
    const analysis = await analyzeVideo(metadata as VideoMetadata);

    // Save analysis to file if we have results
    if (analysis) {
      const savePath = path.join(process.cwd(), 'data', 'analysis', `video_analysis_${metadata.videoId}.json`);
      await writeFile(savePath, JSON.stringify({
        metadata,
        analysis
      }, null, 2));
    }

    return NextResponse.json({
      status: 'success',
      analysis
    });

  } catch (error) {
    console.error('Error in analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
