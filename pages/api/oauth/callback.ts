import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/sessionConfig';
import { encrypt } from '../../../lib/security';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getIronSession(req, res, sessionOptions);
  console.log('Session before token storage:', {
    hasToken: !!session.youtubeToken,
    hasRefreshToken: !!session.refreshToken
  });

  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('Exchanging code for tokens...');
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    console.log('Token response received:', {
      hasAccessToken: !!tokenResponse.data.access_token,
      hasRefreshToken: !!tokenResponse.data.refresh_token
    });

    const { access_token, refresh_token } = tokenResponse.data;
    
    // Encrypt and store tokens in session
    session.youtubeToken = await encrypt(access_token);
    if (refresh_token) {
      session.refreshToken = await encrypt(refresh_token);
    }
    await session.save();

    console.log('Session after token storage:', {
      hasToken: !!session.youtubeToken,
      hasRefreshToken: !!session.refreshToken
    });

    // Redirect back to convert page
    res.redirect('/convert');
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Authentication failed',
      details: error.response?.data?.error?.message || error.message
    });
  }
}
