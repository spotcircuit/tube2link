import { z } from 'zod';

export const envSchema = z.object({
  // Required for YouTube API
  NEXT_PUBLIC_YT_API_KEY: z.string().min(1, 'YouTube API Key is required'),

  // Required for OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  GOOGLE_REDIRECT_URI: z.string().url('Invalid redirect URI'),

  // Required for Google Cloud Speech-to-Text
  GOOGLE_PROJECT_ID: z.string().min(1, 'Google Project ID is required'),
  GOOGLE_CLIENT_EMAIL: z.string().email('Invalid service account email'),
  GOOGLE_PRIVATE_KEY: z.string().min(1, 'Google Private Key is required'),

  // Optional configurations
  N8N_WEBHOOK_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  KMS_KEY_ID: z.string().optional(),
  AWS_REGION: z.string().optional(),
  CLOUD_PROVIDER: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvConfig {
  try {
    const config = envSchema.parse({
      NEXT_PUBLIC_YT_API_KEY: process.env.NEXT_PUBLIC_YT_API_KEY,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
      SESSION_SECRET: process.env.SESSION_SECRET,
      KMS_KEY_ID: process.env.KMS_KEY_ID,
      AWS_REGION: process.env.AWS_REGION,
      CLOUD_PROVIDER: process.env.CLOUD_PROVIDER,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    });

    return config;
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
}

// Get validated config
export function getConfig(): EnvConfig {
  return validateEnv();
}
