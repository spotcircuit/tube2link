export interface VideoMetadata {
  title: string;
  channelTitle: string;
  description: string;
  videoId: string;
  youtubeCategory?: string;
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
  // Required base fields
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;

  // Optional metadata and enrichment
  metadata?: VideoMetadata;
  transcription?: string;
  tags?: string[];
  duration?: string;
  preprocessed?: any;

  // Thumbnails
  thumbnails?: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };

  // AI-generated content
  gptQuickSummary?: string;
}
