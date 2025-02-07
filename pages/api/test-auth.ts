import { NextApiRequest, NextApiResponse } from 'next';
import { withSession } from '../../lib/session';
import { decrypt } from '../../lib/security';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.session.youtubeToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = await decrypt(req.session.youtubeToken);
    res.status(200).json({ token });
  } catch (error: any) {
    console.error('Test auth error:', error);
    res.status(500).json({ 
      error: 'Test authentication failed',
      details: error.response?.data || error.message
    });
  }
});
