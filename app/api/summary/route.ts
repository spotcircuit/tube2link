import { NextResponse } from 'next/server';
import { generateSummary } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { videoData } = await request.json();
    console.log('API received:', { videoData });

    if (!videoData?.transcription) {
      return NextResponse.json({ error: 'No transcription provided' }, { status: 400 });
    }

    // Generate summary using GPT-3.5
    const summary = await generateSummary(videoData.transcription);
    console.log('Generated summary:', summary);

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error.message },
      { status: 500 }
    );
  }
}
