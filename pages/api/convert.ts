import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { decrypt } from '../../lib/security';
import { sessionOptions } from '../../lib/sessionConfig';
import { transcribeYouTubeVideo, generateLinkedInPost } from '../../lib/transcription';
import axios from 'axios';

interface VideoData {
  title: string;
  duration: string;
  thumbnail: string;
  transcription?: string;
  linkedInPost?: string;
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '00:00';

  const [_, hours, minutes, seconds] = match;
  const h = hours ? parseInt(hours) : 0;
  const m = minutes ? parseInt(minutes) : 0;
  const s = seconds ? parseInt(seconds) : 0;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);
  console.log('Session data:', { 
    hasToken: !!session.youtubeToken,
    hasRefreshToken: !!session.refreshToken 
  });

  try {
    const { videoUrl } = req.body;
    console.log('Processing video URL:', videoUrl);

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    console.log('Extracted video ID:', videoId);

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    if (!session.youtubeToken) {
      console.log('No YouTube token found in session');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=https://www.googleapis.com/auth/youtube.readonly` +
        `&access_type=offline`;
      return res.status(401).json({ error: 'Authentication required', authUrl });
    }

    const decryptedToken = await decrypt(session.youtubeToken);
    console.log('Token decrypted successfully:', !!decryptedToken);

    if (!decryptedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch video details from YouTube API
    console.log('Fetching video details from YouTube API...');
    const videoData = await getVideoDetails(videoId, decryptedToken);
    console.log('Video details:', videoData);

    // Start transcription
    console.log('Starting transcription...');
    const transcription = await transcribeYouTubeVideo(videoId);
    console.log('Transcription complete');

    // Generate LinkedIn post
    console.log('Generating LinkedIn post...');
    const linkedInPost = await generateLinkedInPost(transcription, videoData.title);
    console.log('LinkedIn post generated');

    // Add transcription and post to video data
    videoData.transcription = transcription;
    videoData.linkedInPost = linkedInPost;

    res.status(200).json({ videoData });
  } catch (error: any) {
    console.error('Convert error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Failed to process video',
      details: error.response?.data?.error?.message || error.message
    });
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function getVideoDetails(videoId: string, accessToken: string): Promise<VideoData> {
  try {
    console.log('Making YouTube API request...');
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('YouTube API response status:', response.status);

    const video = response.data.items[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      title: video.snippet.title,
      duration: formatDuration(video.contentDetails.duration),
      thumbnail: video.snippet.thumbnails.high.url,
    };
  } catch (error: any) {
    console.error('YouTube API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}
