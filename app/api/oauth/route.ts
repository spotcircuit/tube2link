import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getConfig } from '@/lib/config';

const config = getConfig();

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

// Scopes we need for both YouTube and Speech-to-Text
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/cloud-platform'
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // Generate auth URL and redirect to Google
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true
    });

    return NextResponse.redirect(authUrl);
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens securely (you'll need to implement this)
    // For now, we'll just return them
    return NextResponse.json({ 
      success: true,
      tokens 
    });
  } catch (error: any) {
    console.error('OAuth error:', error);
    return NextResponse.json({ 
      error: 'Failed to authenticate',
      details: error.message 
    }, { status: 500 });
  }
}
