import { z } from 'zod';

export type AuthMode = 'oauth' | 'apikey';

interface Config {
  baseUrl: string;
  youtubeApiKey: string;
  openaiApiKey: string;
  openaiOrganizationId: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  sessionSecret: string;
  authMode: AuthMode;
}

let config: Config | null = null;

export function getConfig(): Config {
  if (config) return config;

  const authMode = (process.env.NEXT_PUBLIC_AUTH_MODE || 'apikey') as AuthMode;

  config = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    youtubeApiKey: process.env.NEXT_PUBLIC_YT_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    authMode
  };

  return config;
}

export const envSchema = z.object({
  // Required for YouTube API
  NEXT_PUBLIC_YT_API_KEY: z.string().min(1, 'YouTube API Key is required'),
  
  // Optional based on auth mode
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  SESSION_SECRET: z.string().optional(),

  // Required for OpenAI API
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API Key is required'),
  OPENAI_ORGANIZATION_ID: z.string().min(1, 'OpenAI Organization ID is required'),

  // Required for base URL
  NEXT_PUBLIC_BASE_URL: z.string().url('Base URL must be a valid URL'),

  // Auth mode
  NEXT_PUBLIC_AUTH_MODE: z.enum(['oauth', 'apikey']).default('apikey'),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvConfig {
  const config = {
    NEXT_PUBLIC_YT_API_KEY: process.env.NEXT_PUBLIC_YT_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ORGANIZATION_ID: process.env.OPENAI_ORGANIZATION_ID,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_AUTH_MODE: process.env.NEXT_PUBLIC_AUTH_MODE as AuthMode,
  };

  return envSchema.parse(config);
}
