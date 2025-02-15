export type VideoAnalysisPair = {
  type: string;
  template: string;
  signals: string[];  // Patterns that suggest this type
};

export type VideoAnalysisResult<T> = {
  type: string;
  confidence: number;
  data: T;
  reasoning: string;
};

// Review specific types
export type ReviewPair = {
  single: VideoAnalysisPair;
  comparison: VideoAnalysisPair;
};

// Tutorial specific types (for example)
export type TutorialPair = {
  howTo: VideoAnalysisPair;
  conceptual: VideoAnalysisPair;
};

// Can add more pairs for other video types
export type NewsPair = {
  breaking: VideoAnalysisPair;
  analysis: VideoAnalysisPair;
};

export type ProductType = 'comparison' | 'review';

export interface ProductDetectionResult {
  type: ProductType;
  confidence: number;
  signals: Array<{
    source: string;
    pattern: string;
    points: number;
  }>;
}

export interface ComparisonSignals {
  hasVsPattern: boolean;
  hasComparisonWords: boolean;
  hasMultipleProducts: boolean;
  hasFeatureComparison: boolean;
}

export interface ProductSignals {
  hasReviewWords: boolean;
  hasProductName: boolean;
  hasFeatureAnalysis: boolean;
  hasRatingWords: boolean;
}

export interface ComparisonItem {
  product: string;
  advantage: string;
  disadvantage: string;
}

export interface Recommendation {
  userType: string;
  recommendation: string;
  reasoning: string;
}

export interface ProductReviewAnalysis {
  metadata: {
    category: string;
    reviewType: string;
    targetAudience: string[];
    testingPeriod: string;
  };
  product: {
    name: string;
    brand: string;
    model: string;
    priceRange: string;
    releaseDate: string;
    specs: Array<{
      category: string;
      details: string[];
    }>;
  };
  testing: {
    methodology: string[];
    scenarios: Array<{
      name: string;
      description: string;
      results: string;
      score: string;
    }>;
    realWorldUse: string[];
  };
  features: Array<{
    name: string;
    description: string;
    performance: string;
    importance: number;
  }>;
  experience: {
    pros: string[];
    cons: string[];
    userFeedback: string[];
    highlights: string[];
    painPoints: string[];
    comparedTo: ComparisonItem[];
  };
  verdict: {
    summary: string;
    rating: number;
    recommendations: Recommendation[];
    alternatives: string[];
    pros: string[];
    cons: string[];
  };
}
