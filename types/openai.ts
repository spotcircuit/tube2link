export interface VideoMetadata {
  title: string;
  channelTitle: string;
  description: string;
}

interface CoreSummary {
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

interface TutorialDetails {
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
}

interface ReviewDetails {
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
}

interface ComparisonDetails {
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
}

interface RecipeDetails {
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
}

interface NewsDetails {
  context: string;
  key_points: string[];
  quotes: Array<{
    text: string;
    speaker: string;
    context: string;
  }>;
  fact_check: Array<{
    claim: string;
    context: string;
  }>;
  participants: Array<{
    name: string;
    role: string;
    affiliation: string;
  }>;
}

interface CommentaryTopic {
  topic: string;
  treatment: string;
  key_points: string[];
  comedic_elements: string[];
}

interface NotableSegment {
  title: string;
  description: string;
  timestamp?: string;
}

interface CommentaryDetails {
  format: 'monologue' | 'desk_piece' | 'interview' | 'panel';
  tone: 'satirical' | 'serious' | 'mixed';
  topics_covered: CommentaryTopic[];
  host_perspective: string;
  notable_segments: NotableSegment[];
  visual_elements: string[];
  audience_engagement?: string;
}

interface TutorialEnrichment {
  tutorial_details: TutorialDetails;
}

interface ReviewEnrichment {
  review_details: ReviewDetails;
}

interface ComparisonEnrichment {
  items_compared: ComparisonDetails['items_compared'];
  comparative_analysis: string;
  recommendations: string;
}

interface RecipeEnrichment {
  recipes: RecipeDetails['recipes'];
  cooking_notes?: RecipeDetails['cooking_notes'];
}

interface NewsEnrichment {
  news_details: NewsDetails;
}

interface CommentaryEnrichment {
  commentary_details: CommentaryDetails;
}

export interface EnrichedVideoMetadata {
  core_summary: CoreSummary;
  extended_enrichment: TutorialEnrichment | ReviewEnrichment | ComparisonEnrichment | RecipeEnrichment | NewsEnrichment | CommentaryEnrichment;
  video_type: 'tutorial' | 'review' | 'comparison' | 'recipe' | 'news' | 'commentary';
}
