import { NextResponse } from 'next/server';
import axios from 'axios';
import { transcribeYouTubeVideo, generateLinkedInPost, oauth2Client } from '@/lib/transcription';
import { getConfig } from '@/lib/config';
import { cookies } from 'next/headers';
import { URL } from 'url';

export async function POST(request: Request) {
  try {
    const config = getConfig();
    const cookieStore = await cookies();

    // Get stored tokens
    console.log('Checking for stored tokens...');
    const storedTokens = await cookieStore.get('oauth_tokens');
    console.log('Stored tokens:', storedTokens ? 'present' : 'missing');

    if (!storedTokens?.value) {
      console.log('No tokens found, redirecting to OAuth...');
      // Redirect to OAuth flow
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/youtube.force-ssl',
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/youtube.download',
          'https://www.googleapis.com/auth/cloud-platform'
        ],
        include_granted_scopes: true
      });

      return NextResponse.json({ 
        needsAuth: true,
        authUrl 
      }, { status: 401 });
    }

    // Parse and set tokens
    console.log('Setting tokens in OAuth client...');
    const tokens = JSON.parse(storedTokens.value);
    console.log('Token info:', {
      access_token: tokens.access_token ? 'present' : 'missing',
      refresh_token: tokens.refresh_token ? 'present' : 'missing',
      expiry_date: tokens.expiry_date
    });
    oauth2Client.setCredentials(tokens);

    const { videoUrl, getDetailsOnly = false, useSpeechToText = false, forceTranscribe = false } = await request.json();
    console.log('Processing URL:', videoUrl, 'Force Transcribe:', forceTranscribe);

    // Extract video ID from URL (including Shorts)
    let videoId: string | null = null;
    try {
      const url = new URL(videoUrl);
      if (url.pathname.includes('/shorts/')) {
        // Handle YouTube Shorts URL
        videoId = url.pathname.split('/shorts/')[1].split('/')[0];
        console.log('Detected YouTube Short:', videoId);
      } else {
        // Handle regular YouTube URL
        videoId = url.searchParams.get('v') || url.pathname.split('/').pop() || null;
      }
    } catch (error) {
      // Handle direct video IDs
      videoId = videoUrl.trim();
    }

    if (!videoId) {
      return NextResponse.json({ 
        error: 'Invalid YouTube URL', 
        details: `Could not extract video ID from URL: ${videoUrl}`
      }, { status: 400 });
    }

    console.log('Extracted video ID:', videoId);

    // Get video details from YouTube API
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
    console.log('YouTube API Key check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length,
      key: apiKey?.substring(0, 5) + '...'
    });

    if (!apiKey) {
      return NextResponse.json({
        error: 'Configuration Error',
        details: 'YouTube API key is missing. Please check your environment variables.'
      }, { status: 500 });
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`);
      console.log('YouTube API response:', response.data);

      if (!response.data.items?.length) {
        return NextResponse.json({ 
          error: 'Video not found',
          details: `No video found with ID: ${videoId}`
        }, { status: 404 });
      }

      const videoDetails = response.data.items[0];
      
      // Log description content
      console.log('Video Description:', {
        hasDescription: !!videoDetails.snippet.description,
        length: videoDetails.snippet.description?.length,
        content: videoDetails.snippet.description,
        rawSnippet: videoDetails.snippet
      });
      
      // Keep original structure from YouTube API
      const videoMetadata = {
        id: videoId,
        snippet: videoDetails.snippet,
        contentDetails: videoDetails.contentDetails,
        statistics: videoDetails.statistics,
        transcription: null // Will be set later if requested
      };

      // If only getting details, return early
      if (getDetailsOnly) {
        return NextResponse.json(videoMetadata);
      }

      // Generate new transcription if requested
      if (forceTranscribe) {
        videoMetadata.transcription = await transcribeYouTubeVideo(videoId, useSpeechToText);
        if (!videoMetadata.transcription) {
          // Check if captions are available
          const hasCaption = videoMetadata.contentDetails.caption === 'true';
          if (!hasCaption && !useSpeechToText) {
            return NextResponse.json({
              error: 'Transcription Failed',
              details: 'No captions available. Enable Speech-to-Text to transcribe the audio.',
              needsSpeechToText: true
            }, { status: 400 });
          }
          return NextResponse.json({
            error: 'Transcription Failed',
            details: 'Failed to transcribe video. Please try again.'
          }, { status: 400 });
        }
      }

      return NextResponse.json(videoMetadata);
    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json({ 
        error: 'API Error',
        details: error.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json({ 
      error: 'Failed to process video',
      details: error.message 
    }, { status: 500 });
  }
}
