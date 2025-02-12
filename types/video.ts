export interface VideoMetadata {
  title: string;
  channelTitle: string;
  description: string;
  videoId: string;
}

interface VideoSummary {
  summary: string;
  analysis: {
    core_concepts: {
      key_points: Array<{
        content: string;
        importance: number;
      }>;
      insights: Array<{
        content: string;
        importance: number;
      }>;
    };
    practical_application: {
      code_examples: Array<{
        content: string;
        importance: number;
        language: string;
      }>;
      implementation_steps: Array<{
        content: string;
        importance: number;
        prerequisites: string[];
      }>;
    };
    technical_details: {
      requirements: Array<{
        content: string;
        type: string;
      }>;
      considerations: Array<{
        content: string;
        category: string;
      }>;
      limitations: Array<{
        content: string;
        severity: string;
      }>;
    };
  };
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  tags?: string[];
  duration?: string;
  thumbnails?: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
  transcription?: string;
  summary?: VideoSummary;
  preprocessed?: any;
  metadata?: VideoMetadata;
  patterns?: {
    key_points?: Array<{ content: string }>;
    examples?: Array<{ content: string }>;
  };
  semantic?: {
    actions?: Array<{ content: string; importance: number }>;
  };
  roles?: {
    user?: Array<{ content: string; matched_patterns: string[] }>;
    developer?: Array<{ content: string; matched_patterns: string[] }>;
  };
}
