import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/config';
import { getOpenAIClient } from '@/lib/openai';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Direct environment variable
    const directKey = process.env.OPENAI_API_KEY;
    
    // 2. Config service
    const config = getConfig();
    
    // 3. Try to initialize OpenAI client
    const openai = getOpenAIClient();

    return NextResponse.json({
      directAccess: {
        hasKey: !!directKey,
        keyLength: directKey?.length,
        keyStart: directKey?.substring(0, 10),
        keyEnd: directKey?.substring(directKey?.length - 10),
      },
      configService: {
        hasKey: !!config.openaiApiKey,
        keyLength: config.openaiApiKey?.length,
        keyStart: config.openaiApiKey?.substring(0, 10),
        keyEnd: config.openaiApiKey?.substring(config.openaiApiKey?.length - 10),
      },
      openaiClientCreated: !!openai,
      envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
