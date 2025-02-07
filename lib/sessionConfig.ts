import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'youtube_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
