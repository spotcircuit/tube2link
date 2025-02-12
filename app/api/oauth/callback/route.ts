import { NextResponse } from 'next/server';
import { oauth2Client, setTokens } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = url.origin;
  
  try {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/?error=oauth', baseUrl));
    }

    if (!code) {
      console.error('No code provided');
      return NextResponse.redirect(new URL('/?error=no_code', baseUrl));
    }

    console.log('Exchanging code for tokens...');
    
    try {
      // Exchange code for tokens with offline access
      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens) {
        console.error('No tokens received');
        return NextResponse.redirect(new URL('/?error=no_tokens', baseUrl));
      }

      // Set the tokens in cookies and oauth2Client
      await setTokens(tokens);

      console.log('OAuth flow completed successfully');
      return NextResponse.redirect(new URL('/', baseUrl));
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return NextResponse.redirect(new URL('/?error=token_exchange', baseUrl));
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback', baseUrl));
  }
}
