import { OAuth2Client } from 'google-auth-library';
import { getConfig } from './config';

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
    ]
  });
}

export async function setTokens(tokens: any) {
  oauth2Client.setCredentials({
    ...tokens,
    expiry_date: Date.now() + (tokens.expires_in || 3600) * 1000
  });
}

export function getOAuth2Client() {
  return oauth2Client;
}

export async function getAccessToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}
