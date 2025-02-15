import { VideoType } from '@/types/openai';

interface VideoData {
  title: string;
  description: string;
  transcript?: string;
  type: VideoType;
}

const PROMPT_TEMPLATES: Record<VideoType, string> = {
  product: `You are a product content analyzer. Analyze this product video and extract structured information about the product(s) being discussed.

Focus on:
1. Product details and specifications
2. Key features and benefits
3. Target audience and use cases
4. Price points and value proposition
5. Comparisons with similar products

Return the analysis in this JSON format:
{
  "product": {
    "name": "Full product name",
    "category": "Product category",
    "manufacturer": "Company name",
    "price": "Price if mentioned"
  },
  "features": [
    {
      "name": "Feature name",
      "description": "Detailed description",
      "benefits": ["List of benefits"],
      "limitations": ["Any limitations"]
    }
  ],
  "targetAudience": {
    "primaryUsers": ["Main user types"],
    "idealUseCase": "Best scenario for use",
    "notRecommendedFor": ["Scenarios where not ideal"]
  },
  "valueProposition": {
    "mainBenefits": ["Key benefits"],
    "priceToValue": "Assessment of price vs value",
    "alternatives": ["Competing products"]
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  review: `You are a product review analyzer. Extract detailed information about the product review, focusing on objective analysis and clear recommendations.

Return the analysis in this JSON format:
{
  "productInfo": {
    "name": "Product name",
    "manufacturer": "Company name",
    "category": "Product category",
    "price": "Price if mentioned"
  },
  "keyFeatures": [
    {
      "name": "Feature name",
      "description": "Feature details",
      "rating": "Rating if given (1-10)",
      "pros": ["Positive points"],
      "cons": ["Negative points"]
    }
  ],
  "overallRating": {
    "score": "Overall score if given (1-10)",
    "summary": "Brief rating summary"
  },
  "recommendations": {
    "bestFor": ["Ideal use cases"],
    "notFor": ["Use cases where not recommended"]
  },
  "verdict": "Final verdict"
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  comparison: `You are a product comparison analyzer. Extract detailed information about the products being compared, focusing on objective differences and clear recommendations.

Return the analysis in this JSON format:
{
  "products": [
    {
      "name": "Product name",
      "manufacturer": "Company name",
      "price": "Price if mentioned"
    }
  ],
  "comparisonPoints": [
    {
      "feature": "Feature being compared",
      "importance": "How important this feature is (1-10)",
      "comparison": "Detailed comparison",
      "winner": "Which product wins for this feature"
    }
  ],
  "winners": [
    {
      "category": "Category (e.g., Performance, Value)",
      "winner": "Winning product",
      "explanation": "Why this product wins"
    }
  ],
  "verdict": {
    "bestOverall": "Best overall product",
    "bestValue": "Best value product",
    "situationalRecommendations": [
      {
        "scenario": "Use case or situation",
        "recommendation": "Recommended product",
        "reason": "Why this product is best for this case"
      }
    ]
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  tutorial: `You are a tutorial content analyzer. Extract structured information about the educational content, focusing on clear steps and learning objectives.

Return the analysis in this JSON format:
{
  "prerequisites": ["Required knowledge or tools"],
  "learningObjectives": ["What will be learned"],
  "steps": [
    {
      "title": "Step title",
      "description": "Detailed description",
      "timestamp": "Time in video (MM:SS)",
      "keyPoints": ["Important points"]
    }
  ],
  "resources": [
    {
      "type": "Type of resource",
      "name": "Resource name",
      "link": "URL if provided"
    }
  ],
  "skillLevel": "Required skill level",
  "estimatedTime": "Time to complete"
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  news: `You are a news content analyzer. Extract structured information about the news content, focusing on facts, sources, and impact.

Return the analysis in this JSON format:
{
  "headline": "Main news headline",
  "summary": "Brief summary",
  "keyPoints": ["Main points"],
  "sources": [
    {
      "name": "Source name",
      "credibility": "Assessment of credibility",
      "link": "URL if provided"
    }
  ],
  "impact": {
    "immediate": ["Immediate effects"],
    "longTerm": ["Long-term implications"],
    "affectedGroups": ["Groups impacted"]
  },
  "factCheck": [
    {
      "claim": "Specific claim",
      "verification": "Fact check result",
      "source": "Verification source"
    }
  ]
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  commentary: `You are a commentary content analyzer. Extract structured information about the commentary, focusing on analysis, perspective, and key arguments.

Return the analysis in this JSON format:
{
  "topic": "Main topic",
  "perspective": {
    "viewpoint": "Main viewpoint",
    "bias": "Any potential bias",
    "expertise": "Speaker's expertise"
  },
  "arguments": [
    {
      "point": "Key argument",
      "evidence": ["Supporting evidence"],
      "counterpoints": ["Opposing views"]
    }
  ],
  "keyMoments": [
    {
      "timestamp": "Time in video (MM:SS)",
      "topic": "Topic discussed",
      "significance": "Why important"
    }
  ],
  "conclusions": ["Main takeaways"]
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  recipe: `You are a recipe content analyzer. Extract structured information about the recipe, focusing on ingredients, steps, and tips.

Return the analysis in this JSON format:
{
  "recipe": {
    "name": "Recipe name",
    "difficulty": "Skill level required",
    "servings": "Number of servings",
    "prepTime": "Preparation time",
    "cookTime": "Cooking time",
    "totalTime": "Total time"
  },
  "ingredients": [
    {
      "item": "Ingredient name",
      "amount": "Quantity",
      "notes": "Special instructions"
    }
  ],
  "steps": [
    {
      "number": "Step number",
      "instruction": "Detailed instruction",
      "timestamp": "Time in video (MM:SS)",
      "tips": ["Helpful tips"]
    }
  ],
  "equipment": ["Required tools"],
  "tips": ["General tips"],
  "nutrition": {
    "calories": "Calorie count",
    "servingSize": "Size per serving"
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`
};

export function generatePrompt(videoData: VideoData): string {
  const template = PROMPT_TEMPLATES[videoData.type];
  if (!template) {
    throw new Error(`No template found for video type: ${videoData.type}`);
  }

  return template
    .replace('{{title}}', videoData.title)
    .replace('{{description}}', videoData.description)
    .replace('{{transcript}}', videoData.transcript || '');
}
