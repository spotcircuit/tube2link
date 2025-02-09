import { NextResponse } from 'next/server';
import { generateLinkedInPost } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { videoData, mode, settings } = await request.json();
    
    console.log('API route received request:', {
      hasVideoData: !!videoData,
      videoFields: videoData ? Object.keys(videoData) : [],
      mode,
      hasSettings: !!settings
    });

    // Ensure all required fields are present
    if (!videoData?.id || !videoData?.title || !videoData?.channelTitle) {
      console.log('Missing required video data fields:', {
        hasId: !!videoData?.id,
        hasTitle: !!videoData?.title,
        hasChannelTitle: !!videoData?.channelTitle
      });
      return NextResponse.json({
        error: 'Missing required video data',
        details: 'Video ID, title, and channel title are required'
      }, { status: 400 });
    }

    if (!mode) {
      console.log('Missing mode in request');
      return NextResponse.json({
        error: 'Missing mode',
        details: 'Template mode is required'
      }, { status: 400 });
    }

    console.log('Generating LinkedIn post with:', {
      videoId: videoData.id,
      mode,
      settingsKeys: settings ? Object.keys(settings) : []
    });

    const content = await generateLinkedInPost(videoData, mode, settings);
    console.log('Successfully generated content');
    
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Generation error:', {
      message: error.message,
      stack: error.stack,
      details: error.details || error.toString()
    });

    // Handle specific OpenAI errors
    if (error.message?.includes('API key')) {
      return NextResponse.json({
        error: 'OpenAI API configuration error',
        details: 'There was an issue with the OpenAI API key. Please check the server configuration.'
      }, { status: 500 });
    }

    return NextResponse.json({
      error: 'Failed to generate content',
      details: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
