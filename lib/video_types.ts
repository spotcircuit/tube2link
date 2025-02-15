import { VideoType } from '@/types/openai';

export interface TutorialEnrichment {
  prerequisites: string[];
  keyLearnings: string[];
  steps: {
    title: string;
    description: string;
    timeStamp?: string;
  }[];
  technicalDetails: {
    tools: string[];
    versions: string[];
    platforms: string[];
  };
  resources: {
    url: string;
    description: string;
  }[];
}

export interface ReviewEnrichment {
  productDetails: {
    name: string;
    category: string;
    price?: string;
    specs?: Record<string, string>;
  };
  keyFeatures: {
    feature: string;
    rating: number;
    comments: string;
  }[];
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  comparisons: {
    product: string;
    differences: string[];
  }[];
  verdict: {
    rating: number;
    summary: string;
    recommendedFor: string[];
  };
}

export interface CommentaryEnrichment {
  keyMoments: {
    timestamp: string;
    title: string;
    description: string;
  }[];
  mainPoints: {
    point: string;
    evidence: string[];
  }[];
  analysis: {
    perspective: string;
    bias?: string;
    credibility: string;
  };
  engagement: {
    style: string;
    audience: string;
    effectiveness: string;
  };
}

export interface NewsEnrichment {
  summary: {
    headline: string;
    keyPoints: string[];
  };
  context: {
    background: string;
    relatedEvents: string[];
  };
  factCheck: {
    claims: {
      claim: string;
      verification: string;
      source: string;
    }[];
  };
  impact: {
    immediate: string[];
    longTerm: string[];
    affectedGroups: string[];
  };
  sources: {
    name: string;
    url?: string;
    credibility: string;
  }[];
}

export interface RecipeEnrichment {
  recipe: {
    name: string;
    servings: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    ingredients: {
      item: string;
      amount: string;
      notes?: string;
    }[];
    instructions: {
      step: string;
      details: string;
      timestamp?: string;
      tips?: string[];
    }[];
    nutrition?: {
      calories?: string;
      protein?: string;
      carbs?: string;
      fat?: string;
    };
  };
  tips: string[];
  substitutions?: {
    ingredient: string;
    alternatives: string[];
  }[];
  equipment: string[];
}

export interface LifestyleEnrichment {
  experience: {
    location?: string;
    duration?: string;
    cost?: string;
    rating: number;
  };
  highlights: {
    title: string;
    description: string;
    timestamp?: string;
  }[];
  tips: {
    tip: string;
    importance: 'must-know' | 'helpful' | 'optional';
  }[];
  recommendations: {
    item: string;
    why: string;
    where?: string;
    cost?: string;
  }[];
  preparation: {
    requirements: string[];
    bestTime?: string;
    warnings?: string[];
  };
}

export type VideoEnrichment = 
  | { type: VideoType; data: ReviewEnrichment }
  | { type: VideoType; data: TutorialEnrichment }
  | { type: VideoType; data: CommentaryEnrichment }
  | { type: VideoType; data: NewsEnrichment }
  | { type: VideoType; data: RecipeEnrichment }
  | { type: VideoType; data: LifestyleEnrichment };
