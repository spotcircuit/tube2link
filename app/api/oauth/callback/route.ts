import { NextResponse } from 'next/server';
import { oauth2Client, setTokens } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  
  try {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/?error=oauth', url.origin));
    }

    if (!code) {
      console.error('No code provided');
      return NextResponse.redirect(new URL('/?error=no_code', url.origin));
    }

    console.log('Exchanging code for tokens...');
    // Exchange code for tokens with offline access
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens) {
      console.error('No tokens received');
      return NextResponse.redirect(new URL('/?error=no_tokens', url.origin));
    }

    // Set the tokens in the oauth2Client
    oauth2Client.setCredentials(tokens);

    // Store tokens in cookies
    await setTokens(tokens);

    return NextResponse.redirect(new URL('/', url.origin));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback', url.origin));
  }
}
