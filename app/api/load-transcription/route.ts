import { NextResponse } from 'next/server';
import { findExistingTranscription } from '@/lib/transcription';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const existingTranscription = await findExistingTranscription(videoId);
    
    if (!existingTranscription) {
      return NextResponse.json({ 
        error: 'No existing transcription found',
        needsTranscription: true 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      transcription: existingTranscription.transcription,
      filepath: existingTranscription.filepath
    });
  } catch (error: any) {
    console.error('Error loading transcription:', error);
    return NextResponse.json({ 
      error: 'Failed to load transcription',
      details: error.message 
    }, { status: 500 });
  }
}
