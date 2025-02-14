import 'openai/shims/node';
import 'openai/shims/node'; // Added OpenAI Node.js shim import
import OpenAI from 'openai';

// Initialize OpenAI client (server-side only)
let openaiClient: OpenAI | null = null;

function debugEnv(prefix: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const orgId = process.env.OPENAI_ORGANIZATION_ID;
  
  console.log(`[${prefix}] Environment state:`, {
    NODE_ENV: process.env.NODE_ENV,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    apiKeyStart: apiKey?.substring(0, 10),
    apiKeyEnd: apiKey?.substring(apiKey?.length - 10),
    fullApiKey: apiKey, // Temporary for debugging
    hasOrgId: !!orgId,
    orgIdStart: orgId?.substring(0, 10),
    envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
  });
}

export function getOpenAIModel(): string {
  const model = process.env.OPENAI_MODEL;
  if (!model) {
    console.warn('OPENAI_MODEL not set in environment, using default model');
    return 'gpt-4o-mini-2024-07-18';
  }
  return model;
}

export function getOpenAIClient(): OpenAI {
  console.log('\n=== Starting OpenAI Client Initialization ===');
  
  if (typeof window !== 'undefined') {
    console.log('Attempted to initialize OpenAI client on client-side');
    throw new Error('OpenAI client can only be initialized server-side');
  }

  debugEnv('INIT');

  // Get environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  const orgId = process.env.OPENAI_ORGANIZATION_ID;

  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in environment');
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  if (!openaiClient) {
    try {
      console.log('Creating new OpenAI client instance...');
      debugEnv('PRE-CREATE');
      
      openaiClient = new OpenAI({
        apiKey: apiKey,
        organization: orgId
      });

      console.log('OpenAI client created successfully');
      debugEnv('POST-CREATE');
    } catch (error) {
      console.error('Error creating OpenAI client:', error);
      throw error;
    }
  } else {
    console.log('Using existing OpenAI client instance');
  }

  console.log('=== Finished OpenAI Client Initialization ===\n');
  return openaiClient;
}

export enum PostGenerationMode {
  LinkedIn = 'linkedin',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Instagram = 'instagram'
}

export async function generatePrompt(data: any, mode: PostGenerationMode, settings: any): Promise<string> {
  // Implementation
  return '';
}

export async function generateLinkedInPost(data: any, mode: PostGenerationMode, settings: any): Promise<string> {
  // Implementation
  return '';
}

export async function formatDetailedAnalysis(data: any): Promise<string> {
  // Implementation
  return '';
}
