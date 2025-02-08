import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const tokenCookie = await cookieStore.get('oauth_tokens');

  if (tokenCookie?.value) {
    try {
      const tokens = JSON.parse(tokenCookie.value);
      oauth2Client.setCredentials(tokens);
      return NextResponse.json({ authenticated: true });
    } catch (error) {
      console.error('Invalid token format:', error);
      return NextResponse.json({ 
        error: 'Invalid authentication tokens',
        authUrl: oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/cloud-platform'
          ],
          prompt: 'consent',
          include_granted_scopes: true
        })
      }, { status: 401 });
    }
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/cloud-platform'
    ],
    prompt: 'consent',
    include_granted_scopes: true
  });

  return NextResponse.json({ 
    authenticated: false,
    authUrl 
  }, { status: 401 });
}
