// video_context.ts
export type VideoType = 'tutorial' | 'review' | 'unboxing' | 'taste_test' | 'informational';

export interface VideoContext {
  intro: string;
  format: string[];
}

export const VIDEO_CONTEXTS: Record<VideoType, VideoContext> = {
  tutorial: {
    intro: "You are writing a LinkedIn post about a detailed tutorial video. The post should be educational and highlight key learnings.",
    format: [
      "1. Opening with a practical challenge the tutorial solves",
      "2. Highlighting the main solution approach",
      "3. Sharing key technical insights",
      "4. Providing implementation tips",
      "5. Ending with results and benefits"
    ]
  },
  review: {
    intro: "You are writing a LinkedIn post about a product review video. The post should be analytical and highlight key findings.",
    format: [
      "1. Opening with the reviewed item's significance",
      "2. Highlighting standout features",
      "3. Sharing balanced pros/cons",
      "4. Providing practical use cases",
      "5. Ending with recommendations"
    ]
  },
  unboxing: {
    intro: "You are writing a LinkedIn post about an unboxing experience video. The post should capture excitement and first impressions.",
    format: [
      "1. Building anticipation about the product",
      "2. Highlighting packaging and presentation",
      "3. Sharing initial reactions",
      "4. Noting unique features",
      "5. Ending with early verdict"
    ]
  },
  taste_test: {
    intro: "You are writing a LinkedIn post about a food tasting video. The post should be descriptive and engaging.",
    format: [
      "1. Setting up the tasting experience",
      "2. Describing flavors and textures",
      "3. Comparing varieties",
      "4. Sharing surprising findings",
      "5. Ending with recommendations"
    ]
  },
  informational: {
    intro: "You are writing a LinkedIn post about an informative video. The post should be insightful and value-focused.",
    format: [
      "1. Opening with an intriguing fact",
      "2. Highlighting key discoveries",
      "3. Sharing practical applications",
      "4. Providing context",
      "5. Ending with takeaways"
    ]
  }
} as const;

export function getVideoType(data: any): VideoType {
  const title = data.metadata?.title || '';
  const description = data.metadata?.description || '';
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('tutorial') || text.includes('how to') || text.includes('guide')) {
    return 'tutorial';
  }
  if (text.includes('review') || text.includes('tested')) {
    return 'review';
  }
  if (text.includes('unboxing') || text.includes('first look')) {
    return 'unboxing';
  }
  if (text.includes('taste') || text.includes('food') || text.includes('eating')) {
    return 'taste_test';
  }
  
  // Default to informational
  return 'informational';
}
