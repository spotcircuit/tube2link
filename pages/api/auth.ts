import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/sessionConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession(req, res, sessionOptions);

  if (req.method === 'GET') {
    // Check if we have a valid token
    if (session.youtubeToken) {
      return res.status(200).json({ authenticated: true });
    }

    // If no token, return auth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=https://www.googleapis.com/auth/youtube.readonly` +
      `&access_type=offline`;

    return res.status(401).json({ error: 'Authentication required', authUrl });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
