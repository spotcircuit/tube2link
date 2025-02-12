export type VideoType = 'tutorial' | 'review' | 'commentary' | 'news' | 'lifestyle';

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
    description: string;
    significance: string;
  }[];
  mainPoints: {
    point: string;
    context: string;
  }[];
  culturalReferences: {
    reference: string;
    explanation: string;
  }[];
  audience: {
    primary: string[];
    interests: string[];
  };
  moodAndTone: {
    overall: string;
    contentWarnings?: string[];
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
  | { type: 'tutorial'; data: TutorialEnrichment }
  | { type: 'review'; data: ReviewEnrichment }
  | { type: 'commentary'; data: CommentaryEnrichment }
  | { type: 'news'; data: NewsEnrichment }
  | { type: 'lifestyle'; data: LifestyleEnrichment };
