import { VideoType } from './video_types';

interface VideoData {
  title: string;
  description: string;
  transcript?: string;
  type: VideoType;
}

const PROMPT_TEMPLATES: Record<VideoType, string> = {
  tutorial: `You are a specialized video content analyzer. Analyze this educational video and extract structured information following these STRICT requirements:

1. Prerequisites MUST be a non-empty list
2. Key Learnings MUST be a non-empty list
3. Steps MUST include at least one item, each with:
   - A clear, specific title
   - A detailed description
   - Optional timestamp in MM:SS format (e.g., "05:30")
4. Technical details should list all tools, versions, and platforms mentioned
5. Resources should include valid URLs if mentioned

Provide the response in this EXACT JSON format:
{
  "prerequisites": [
    "Basic JavaScript knowledge",
    "Node.js installed"
  ],
  "keyLearnings": [
    "How to set up a React project",
    "Understanding component lifecycle"
  ],
  "steps": [
    {
      "title": "Install Dependencies",
      "description": "Run npm install to set up project dependencies",
      "timeStamp": "01:30"
    }
  ],
  "technicalDetails": {
    "tools": ["VS Code", "npm"],
    "versions": ["Node.js v18", "React 18.2"],
    "platforms": ["Windows", "MacOS"]
  },
  "resources": [
    {
      "url": "https://reactjs.org",
      "description": "Official React documentation"
    }
  ]
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  review: `You are a specialized video content analyzer. Analyze this review video and extract structured information following these STRICT requirements:

1. Product Details MUST include name and category
2. Key Features MUST include at least one item with:
   - Feature name
   - Rating (1-5 only)
   - Detailed comments
3. Pros and Cons MUST each have at least one item
4. Verdict MUST include:
   - Rating (1-10 only)
   - Clear summary
   - Target audience recommendations

Provide the response in this EXACT JSON format:
{
  "productDetails": {
    "name": "iPhone 15 Pro",
    "category": "Smartphone",
    "price": "$999",
    "specs": {
      "screen": "6.1-inch OLED",
      "processor": "A17 Pro"
    }
  },
  "keyFeatures": [
    {
      "feature": "Camera System",
      "rating": 5,
      "comments": "Exceptional low-light performance with 48MP main sensor"
    }
  ],
  "prosAndCons": {
    "pros": ["Excellent performance", "Great battery life"],
    "cons": ["Expensive", "Limited customization"]
  },
  "comparisons": [
    {
      "product": "Samsung S23",
      "differences": ["Different OS", "Different camera approach"]
    }
  ],
  "verdict": {
    "rating": 9,
    "summary": "Best iPhone yet with significant camera improvements",
    "recommendedFor": ["Photography enthusiasts", "Power users"]
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  commentary: `You are a specialized video content analyzer. Analyze this commentary/entertainment video and extract structured information following these STRICT requirements:

1. Key Moments MUST include timestamps in MM:SS format when available
2. Main Points MUST have at least one item with point and context
3. Audience section MUST specify primary target groups and interests
4. Mood and Tone MUST include overall tone description

Provide the response in this EXACT JSON format:
{
  "keyMoments": [
    {
      "timestamp": "02:15",
      "description": "First major argument presented",
      "significance": "Sets up the main theme of the video"
    }
  ],
  "mainPoints": [
    {
      "point": "Social media impact on society",
      "context": "Discussion of recent studies and trends"
    }
  ],
  "culturalReferences": [
    {
      "reference": "1984 by George Orwell",
      "explanation": "Used to draw parallels with current privacy concerns"
    }
  ],
  "audience": {
    "primary": ["Tech-savvy adults", "Social media users"],
    "interests": ["Technology", "Social issues"]
  },
  "moodAndTone": {
    "overall": "Critical but humorous",
    "contentWarnings": ["Discussion of privacy concerns"]
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  news: `You are a specialized video content analyzer. Analyze this news video and extract structured information following these STRICT requirements:

1. Summary MUST include headline and key points
2. Context MUST provide background information
3. Fact Check MUST include source for each claim
4. Impact MUST identify affected groups
5. Sources MUST include at least one credible source

Provide the response in this EXACT JSON format:
{
  "summary": {
    "headline": "Major Tech Company Announces AI Breakthrough",
    "keyPoints": ["New AI model developed", "Potential applications in healthcare"]
  },
  "context": {
    "background": "Part of ongoing AI developments in healthcare sector",
    "relatedEvents": ["Previous healthcare AI announcements"]
  },
  "factCheck": {
    "claims": [
      {
        "claim": "First AI model to achieve this accuracy",
        "verification": "Partially accurate",
        "source": "AI Research Journal"
      }
    ]
  },
  "impact": {
    "immediate": ["Healthcare diagnosis improvements"],
    "longTerm": ["Potential job market changes"],
    "affectedGroups": ["Healthcare workers", "Patients"]
  },
  "sources": [
    {
      "name": "AI Research Journal",
      "url": "https://example.com/journal",
      "credibility": "Peer-reviewed academic journal"
    }
  ]
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,

  lifestyle: `You are a specialized video content analyzer. Analyze this lifestyle video and extract structured information following these STRICT requirements:

1. Experience MUST include a rating (1-5 only)
2. Highlights MUST include at least one item with title and description
3. Tips MUST specify importance level (must-know, helpful, or optional only)
4. Recommendations MUST include why for each item
5. Preparation MUST list requirements if any are mentioned

Provide the response in this EXACT JSON format:
{
  "experience": {
    "location": "Tokyo, Japan",
    "duration": "2 weeks",
    "cost": "$3000",
    "rating": 5
  },
  "highlights": [
    {
      "title": "Street Food Tour",
      "description": "Exploring local markets and street vendors",
      "timestamp": "05:30"
    }
  ],
  "tips": [
    {
      "tip": "Get a rail pass before arriving",
      "importance": "must-know"
    }
  ],
  "recommendations": [
    {
      "item": "Specific ramen shop",
      "why": "Best quality-price ratio",
      "where": "Shibuya district",
      "cost": "$10-15 per bowl"
    }
  ],
  "preparation": {
    "requirements": ["Valid passport", "Rail pass"],
    "bestTime": "Spring (March-May)",
    "warnings": ["Book accommodations early"]
  }
}

Title: {{title}}
Description: {{description}}
Transcript: {{transcript}}`,
};

export function generatePrompt(videoData: VideoData): string {
  const template = PROMPT_TEMPLATES[videoData.type];
  return template
    .replace('{{title}}', videoData.title)
    .replace('{{description}}', videoData.description)
    .replace('{{transcript}}', videoData.transcript || 'No transcript available');
}
