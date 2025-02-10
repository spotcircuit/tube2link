export interface VideoMetadata {
  title: string;
  channelTitle: string;
  description: string;
  videoId: string;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnails?: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  tags?: string[];
  transcription?: string | null;
  preprocessed?: any;
  summary?: string;  // Summary of the video content
  gptQuickSummary?: string;  // 2-3 sentence overview from GPT
  detailedAnalysis?: string; // Formatted sections with key points, actions, etc
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
