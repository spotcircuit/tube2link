export interface VideoMetadata {
  // Base Template (Core Metadata)
  videoId: string;
  url: string;  // Required since users input it at the start
  title: string;
  description: string;
  channelTitle: string;
  channelDescription: string;
  channelCategory: string;
  publishedAt: string;
  duration: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
  };
  tags?: string[];
  category: string;
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
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

// VideoData extends VideoMetadata to include isShort flag
export interface VideoData extends VideoMetadata {
  isShort?: boolean;
}
