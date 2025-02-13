export type PostGenerationMode = 'question' | 'insight' | 'howto' | 'story' | 'summary' | 'tips';

export interface PostSettings {
  tone: number;
  length: 'brief' | 'standard' | 'detailed';
  personality: {
    charm: number;
    wit: number;
    humor: number;
    sarcasm: number;
  };
  useEmojis: boolean;
}

export interface PostTemplate {
  name: string;
  description: string;
  structure: string;
}
