import { VideoType } from './video_types';
import { VideoMetadata } from '@/types/video';

const PATTERNS = {
  tutorial: {
    high: /how to|tutorial|learn|guide|step by step/i,
    medium: /explained|basics|beginners|tutorial|course/i,
    low: /tips|tricks|lesson|understand/i
  },
  review: {
    high: /review|unboxing|vs|compared|worth it/i,
    medium: /pros|cons|better than|should you buy/i,
    low: /experience with|thoughts on|testing/i
  },
  commentary: {
    high: /reaction|funny|comedy|playing|gameplay/i,
    medium: /highlights|moments|entertainment/i,
    low: /thoughts|opinion|takes|reacting/i
  },
  news: {
    high: /news|breaking|analysis|report/i,
    medium: /latest|update|situation|development/i,
    low: /current|today|coverage|story/i
  },
  lifestyle: {
    high: /vlog|experience|travel|food|day in/i,
    medium: /life|journey|adventure|trying/i,
    low: /routine|daily|lifestyle|living/i
  }
} as const;

// Common channel keywords that indicate video type
const CHANNEL_PATTERNS = {
  tutorial: /how to|tutorials|education|learning|academy|school|university/i,
  review: /reviews|tech|gadgets|consumer|testing/i,
  commentary: /gaming|comedy|entertainment|reactions|plays/i,
  news: /news|politics|current events|updates|coverage/i,
  lifestyle: /vlog|life|living|daily|routine|travel/i
} as const;

const YOUTUBE_CATEGORY_SCORES: Record<string, Partial<Record<VideoType, number>>> = {
  'Education': { tutorial: 2 },
  'Entertainment': { commentary: 2 },
  'News & Politics': { news: 2 },
  'Howto & Style': { tutorial: 2, lifestyle: 1 },
  'Science & Technology': { tutorial: 1, news: 1 },
  'Gaming': { commentary: 2, review: 1 },
  'People & Blogs': { lifestyle: 2, commentary: 1 },
  'Film & Animation': { review: 1, commentary: 1 },
  'Comedy': { commentary: 2 },
  'Sports': { commentary: 1, lifestyle: 1 }
};

export function detectVideoType(metadata: VideoMetadata): VideoType {
  const scores: Record<VideoType, number> = {
    tutorial: 0,
    review: 0,
    commentary: 0,
    news: 0,
    lifestyle: 0
  };

  // Combine title and description for pattern matching
  const text = `${metadata.title || ''} ${metadata.description || ''}`.toLowerCase();

  // Score based on content patterns
  Object.entries(PATTERNS).forEach(([type, patterns]) => {
    if (patterns.high.test(text)) scores[type as VideoType] += 3;
    if (patterns.medium.test(text)) scores[type as VideoType] += 2;
    if (patterns.low.test(text)) scores[type as VideoType] += 1;
  });

  // Score based on channel name
  if (metadata.channelTitle) {
    const channelTitle = metadata.channelTitle.toLowerCase();
    Object.entries(CHANNEL_PATTERNS).forEach(([type, pattern]) => {
      if (pattern.test(channelTitle)) {
        scores[type as VideoType] += 2;
      }
    });
  }

  // Consider YouTube category if available
  const category = metadata.youtubeCategory;
  if (category && category in YOUTUBE_CATEGORY_SCORES) {
    const categoryScores = YOUTUBE_CATEGORY_SCORES[category];
    Object.entries(categoryScores).forEach(([type, score]) => {
      scores[type as VideoType] += score;
    });
  }

  // Find the type with the highest score
  const result = Object.entries(scores)
    .reduce<{ type: VideoType; score: number }>(
      (max, [type, score]) =>
        score > max.score ? { type: type as VideoType, score } : max,
      { type: 'commentary', score: 0 }
    );

  return result.type;
}

export function getTypeDescription(type: VideoType): string {
  switch (type) {
    case 'tutorial':
      return 'Educational content focused on teaching specific skills or knowledge';
    case 'review':
      return 'Detailed analysis and evaluation of products, services, or media';
    case 'commentary':
      return 'Personal opinions, reactions, or entertainment content';
    case 'news':
      return 'Current events, factual reporting, and analysis';
    case 'lifestyle':
      return 'Personal experiences, recommendations, and day-in-the-life content';
  }
}
