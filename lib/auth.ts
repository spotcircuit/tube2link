import { OAuth2Client } from 'google-auth-library';
import { getConfig } from './config';
import { NextResponse } from 'next/server';

const config = getConfig();

export const oauth2Client = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  config.googleRedirectUri
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    scope: [
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/cloud-platform'
    ],
    prompt: 'consent'  // Always show consent screen
  });
}

export async function setTokens(tokens: any) {
  // Set expiry date
  const credentials = {
    ...tokens,
    expiry_date: Date.now() + (tokens.expires_in || 3600) * 1000
  };

  // Set credentials in oauth2Client
  oauth2Client.setCredentials(credentials);

  // Create response with cookie
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set({
    name: 'oauth_tokens',
    value: JSON.stringify(credentials),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  });
  
  return response;
}

export function getOAuth2Client() {
  return oauth2Client;
}

export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}
