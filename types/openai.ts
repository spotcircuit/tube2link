export interface VideoMetadata {
  title: string;
  channelTitle: string;
  description: string;
  url: string;
}

export interface CoreSummary {
  core_concepts: string;
  key_insights: string[];
  main_subject?: string;
  action_shown?: string;
  content_context?: string;
  content_purpose?: string;
  visual_elements?: string[];
  audio_elements?: string[];
  call_to_action?: string;
}

export interface Recipe {
  name: string;
  cook_time?: string;
  difficulty?: string;
  ingredients: string[];
  key_steps: string[];
  tips?: string[];
  serving_size?: string;
}

export interface ExtendedEnrichment {
  recipes?: Recipe[];
  news_details?: NewsDetails;
  review_details?: ReviewDetails;
  comparison_details?: ComparisonDetails;
  tutorial_details?: TutorialDetails;
  recipe_details?: RecipeDetails;
  commentary_details?: CommentaryDetails;
  cooking_notes?: {
    equipment_needed?: string[];
    preparation_tips?: string[];
    storage_info?: string;
  };
}

export interface EnrichedVideoMetadata {
  core_summary: CoreSummary;
  video_type: VideoType;
  url: string;
  videoTitle?: string;
  videoDescription?: string;
  channelName?: string;
  videoId?: string;
  channelDescription?: string;
  channelCategory?: string;
  publishedAt?: string;
  duration?: string;
  thumbnails?: {
    default?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
  };
  category?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  extended_enrichment?: ExtendedEnrichment;
}

export type VideoType = 'product' | 'news' | 'tutorial' | 'recipe' | 'commentary' | 'comparison' | 'review';

export interface NewsDetails {
  headline?: string;
  key_points?: string[];
  sources?: string[];
  expert_opinions?: string[];
  related_topics?: string[];
  impact_assessment?: string;
  context?: string;
  quotes?: Array<{
    text: string;
    speaker: string;
    context?: string;
  }>;
  fact_check?: Array<{
    claim: string;
    context: string;
  }>;
  participants?: Array<{
    name: string;
    role: string;
    affiliation?: string;
  }>;
  analysis?: string;
}

export interface ReviewDetails {
  product_name: string;
  manufacturer?: string;
  price_point?: string;
  key_features: string[];
  pros: string[];
  cons: string[];
  performance: {
    highlights: string[];
    issues: string[];
  };
  value_assessment: string;
  recommendation: string;
  best_for: string[];
  timestamps?: Array<{
    time: string;
    topic: string;
  }>;
  overall_rating?: number;
  best_suited_for?: string[];
  comparison_products?: string[];
}

export interface ComparisonDetails {
  items_compared: Array<{
    name: string;
    features: string[];
    price?: string;
    pros: string[];
    cons: string[];
    best_for: string;
  }>;
  comparative_analysis: string;
  recommendations: string;
  products: {
    name: string;
    key_features: string[];
    pros: string[];
    cons: string[];
    rating?: number;
  }[];
  comparison_criteria: string[];
  winner?: string;
}

export interface TutorialDetails {
  prerequisites?: string[];
  learning_objectives: string[];
  steps: Array<{
    title: string;
    description: string;
    timestamp?: string;
    code_snippet?: string;
    key_points?: string[];
  }>;
  best_practices?: string[];
  common_pitfalls?: string[];
  resources?: Array<{
    name: string;
    type: string;
    link?: string;
  }>;
  topic: string;
  tools_required?: string[];
  skill_level?: string;
  estimated_time?: string;
}

export interface RecipeDetails {
  recipes: Array<{
    name: string;
    cook_time?: string;
    difficulty?: string;
    ingredients?: string[];
    key_steps?: string[];
    tips?: string[];
    serving_size?: string;
  }>;
  cooking_notes?: {
    equipment_needed?: string[];
    preparation_tips?: string[];
    storage_info?: string;
  };
  dish_name: string;
  cuisine_type?: string;
  ingredients: string[];
  steps: {
    description: string;
    timestamp?: string;
  }[];
  prep_time?: string;
  cook_time?: string;
  difficulty?: string;
  serving_size?: string;
}

export interface CommentaryDetails {
  format: 'monologue' | 'desk_piece' | 'interview' | 'panel';
  tone: 'satirical' | 'serious' | 'mixed';
  topics_covered: Array<{
    topic: string;
    treatment: string;
    key_points: string[];
    comedic_elements: string[];
  }>;
  host_perspective: string;
  notable_segments: Array<{
    title: string;
    description: string;
    timestamp?: string;
  }>;
  visual_elements: string[];
  audience_engagement?: string;
  topic: string;
  key_points: string[];
  expert_credentials?: string;
  supporting_evidence?: string[];
  counter_arguments?: string[];
  conclusions?: string[];
}
