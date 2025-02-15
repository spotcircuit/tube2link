export type PostGenerationMode = 'question' | 'insight' | 'howto' | 'story' | 'summary' | 'reaction' | 'tips';

export type PersonalityTrait = 'charm' | 'wit' | 'humor' | 'sarcasm';

export interface PostSettings {
  tone: number;
  length: 'brief' | 'standard' | 'detailed';
  personality: {
    [key in PersonalityTrait]: number;
  };
  useEmojis: boolean;
}

export interface PostTemplate {
  name: string;
  description: string;
  structure: string;
}
