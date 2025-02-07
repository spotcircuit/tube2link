import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_YT_API_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  N8N_WEBHOOK_URL: z.string().url()
});

export type EnvConfig = z.infer<typeof envSchema>;
