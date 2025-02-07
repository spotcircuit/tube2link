import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';

export interface SessionData {
  youtubeToken?: string;
  refreshToken?: string;
}

declare module 'next' {
  interface NextApiRequest {
    session: SessionData;
  }
}

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'youtube_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function withSession(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, sessionOptions);
    (req as any).session = session;
    return handler(req, res);
  };
}
