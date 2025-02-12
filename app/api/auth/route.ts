import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getConfig } from '@/lib/config';

export async function GET() {
  const config = getConfig();

  // If using API key mode, return authenticated immediately without any checks
  if (config.authMode === 'apikey') {
    return new NextResponse(JSON.stringify({ 
      authenticated: true,
      mode: 'apikey'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000' // Cache for 1 year since it's static
      }
    });
  }

  // OAuth mode
  const cookieStore = await cookies();
  const tokenCookie = await cookieStore.get('oauth_tokens');

  if (tokenCookie?.value) {
    try {
      const tokens = JSON.parse(tokenCookie.value);
      oauth2Client.setCredentials(tokens);
      return NextResponse.json({ 
        authenticated: true,
        mode: 'oauth'
      });
    } catch (error) {
      console.error('Invalid token format:', error);
      return NextResponse.json({ 
        error: 'Invalid authentication tokens',
        mode: 'oauth',
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
    mode: 'oauth',
    authUrl 
  }, { status: 401 });
}
