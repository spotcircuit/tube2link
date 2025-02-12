import { z } from 'zod';

export type AuthMode = 'apikey';

interface Config {
  baseUrl: string;
  youtubeApiKey: string;
  openaiApiKey: string;
  openaiOrganizationId: string;
  sessionSecret: string;
}

let config: Config | null = null;

export function getConfig(): Config {
  if (config) return config;

  config = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    youtubeApiKey: process.env.NEXT_PUBLIC_YT_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID || '',
    sessionSecret: process.env.SESSION_SECRET || 'default-secret-key'
  };

  return config;
}

export const envSchema = z.object({
  // Required for YouTube API
  NEXT_PUBLIC_YT_API_KEY: z.string().min(1, 'YouTube API Key is required'),
  
  // Required for OpenAI API
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API Key is required'),
  OPENAI_ORGANIZATION_ID: z.string().min(1, 'OpenAI Organization ID is required'),

  // Optional environment variables
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  SESSION_SECRET: z.string().optional()
});

export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvConfig {
  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsedEnv.data;
}
