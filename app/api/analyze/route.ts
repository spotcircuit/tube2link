import { NextResponse } from 'next/server';
import { analyzeVideo } from '@/lib/video/analysis';
import { VideoMetadata } from '@/types/video';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { metadata } = await request.json();

    // Run analysis
    const analysis = await analyzeVideo(metadata as VideoMetadata);

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
