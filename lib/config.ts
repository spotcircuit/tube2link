import { z } from 'zod';

interface Config {
  youtubeApiKey: string;
  openaiApiKey: string;
  openaiOrganizationId: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  sessionSecret: string;
}

let config: Config | null = null;

export function getConfig(): Config {
  if (config) return config;

  config = {
    youtubeApiKey: process.env.NEXT_PUBLIC_YT_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    sessionSecret: process.env.SESSION_SECRET || ''
  };

  return config;
}

export const envSchema = z.object({
  // Required for YouTube API
  NEXT_PUBLIC_YT_API_KEY: z.string().min(1, 'YouTube API Key is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  GOOGLE_REDIRECT_URI: z.string().min(1, 'Google Redirect URI is required'),

  // Required for OpenAI API
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API Key is required'),
  OPENAI_ORGANIZATION_ID: z.string().min(1, 'OpenAI Organization ID is required'),

  // Required for session management
  SESSION_SECRET: z.string().min(1, 'Session Secret is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}
