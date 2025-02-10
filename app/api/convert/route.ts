import { NextResponse } from 'next/server';
import axios from 'axios';
import { oauth2Client, getTranscriptFast } from '@/lib/transcription';
import { getConfig } from '@/lib/config';
import { cookies } from 'next/headers';
import { URL } from 'url';

interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  tags?: string[];
  transcription?: string | null;
}

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
          'https://www.googleapis.com/auth/youtube.download'
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

    const { videoUrl } = await request.json();
    console.log('Processing URL:', videoUrl);

    // Extract video ID from URL (including Shorts)
    let videoId: string | null = null;
    try {
      // Handle direct video IDs first
      if (!videoUrl.includes('http') && !videoUrl.includes('/')) {
        videoId = videoUrl.trim();
      } else {
        const url = new URL(videoUrl);
        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          if (url.pathname.includes('/shorts/')) {
            // Handle YouTube Shorts URL
            videoId = url.pathname.split('/shorts/')[1].split('/')[0];
            console.log('Detected YouTube Short:', videoId);
          } else if (url.hostname === 'youtu.be') {
            // Handle youtu.be URLs
            videoId = url.pathname.slice(1);
          } else {
            // Handle regular YouTube URL
            videoId = url.searchParams.get('v');
          }
        }
      }
    } catch (error) {
      console.error('URL parsing error:', error);
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
      const videoMetadata: VideoMetadata = {
        id: videoId,
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        channelTitle: videoDetails.snippet.channelTitle,
        thumbnails: videoDetails.snippet.thumbnails,
        tags: videoDetails.snippet.tags
      };

      // Get transcription
      try {
        console.log('Getting transcription for video:', videoId);
        const transcription = await getTranscriptFast(videoId);
        videoMetadata.transcription = transcription;
        
        if (!transcription) {
          return NextResponse.json({
            error: 'Transcription Failed',
            details: 'Failed to get transcription'
          }, { status: 500 });
        }
      } catch (error: any) {
        console.error('Transcription error:', error);
        return NextResponse.json({
          error: 'Transcription Failed',
          details: error.message
        }, { status: 400 });
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
