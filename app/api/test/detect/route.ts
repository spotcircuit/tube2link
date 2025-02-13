import { VideoMetadata } from '@/types/video';
import { getVideoInfo, getChannelInfo } from '@/lib/youtube';
import { EnrichedVideoMetadata } from '@/types/openai';
import { writeFile } from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Previous system prompt for reference
const OLD_SYSTEM_PROMPT = `[Previous content preserved as comment...]`;

const SYSTEM_PROMPT = `You are a video metadata enrichment engine. Your task is to analyze YouTube video metadata and generate structured JSON responses about the content.

Step 0: Content Length Detection
First, determine if this is a short-form video (YouTube Shorts, less than 60 seconds) by checking:
- URL format (contains /shorts/)
- Video duration
- Content style and metadata

For short-form content, use this response format:
{
  "core_summary": {
    "core_concepts": "Brief overview of the main content",
    "key_insights": ["Key points or highlights"],
    "main_subject": "Primary person, event, or topic",
    "action_shown": "Description of what's happening in the video",
    "content_context": "Background information and context",
    "content_purpose": "Intent of the content (promotional, entertainment, etc.)",
    "visual_elements": ["List of key visual components"],
    "audio_elements": ["List of key audio components"],
    "call_to_action": "Any calls to action in the content"
  },
  "video_type": "fallback"
}

For regular-length content:
Step 1: Determine the primary video type by analyzing the title, description, tags, and any other available metadata. Use these indicators:

1. Tutorial/Educational:
   - Look for keywords such as "How to", "Guide", "Tutorial", "Learn"
   - Presence of step-by-step instructions or educational content
   - Focus on teaching or demonstrating skills
   - Video type should be "tutorial"

2. Single Product Review:
   - Focus on a single product, brand, or model
   - Keywords like "review", "hands-on", "first look", "unboxing"
   - In-depth analysis of features, performance, value
   - Personal experience and recommendations
   - Video type should be "review"

3. Product Comparison:
   - Multiple products being compared
   - Keywords like "vs", "versus", "comparison", "which is better"
   - Direct feature-to-feature analysis
   - Contrasting different options
   - Video type should be "comparison"

4. Recipe/Cooking:
   - Food or dish names, cooking instructions, ingredients
   - Kitchen or cooking terminology
   - Keywords like "recipe", "cook with me", "how to make"
   - Video type should be "recipe"

5. News:
   - Breaking news, current events, press briefings
   - Official statements, announcements
   - Political events, government activities
   - Keywords like "breaking", "update", "news"
   - Focus on factual reporting and events
   - Include detailed quotes and fact-checking
   - Analyze participant roles and affiliations
   - Video type should be "news"

6. Commentary/Entertainment:
   - Late night shows, talk shows, podcasts
   - Comedic takes on current events
   - Opinion pieces, editorials
   - Satirical content, parody
   - Host-driven segments (monologues, desk pieces)
   - Video type should be "commentary"

If the content is ambiguous or covers multiple types, analyze the primary focus and most prominent indicators to determine the type. For hybrid content, use these guidelines:
- News + Comedy = "commentary" (e.g., late night shows)
- Tutorial + Review = "tutorial" (focus on teaching)
- Review + Comparison = "comparison" (multiple products)

For news content specifically:
- Always include relevant quotes with speaker attribution
- Provide fact-checking context when claims are made
- List all key participants with roles and affiliations
- Analyze any supporting evidence or documentation
- Note any bias or perspective in the reporting
- Include background context for the events discussed

For commentary content:
- Note the format and tone of presentation
- Identify comedic elements and satirical takes
- Track recurring segments or themes
- Analyze host perspective and audience engagement
- Document visual elements and props used
- Capture key arguments and counterpoints made

Step 2: Generate a JSON response using the corresponding format based on the determined video type. Use one of these structures:

For commentary videos (video_type: "commentary"):
{
  "core_summary": {
    "core_concepts": "Main topics or themes discussed",
    "key_insights": ["Key points or takeaways"]
  },
  "extended_enrichment": {
    "commentary_details": {
      "format": "monologue|desk_piece|interview|panel",
      "tone": "satirical|serious|mixed",
      "topics_covered": [
        {
          "topic": "Main topic name",
          "treatment": "How the topic was addressed",
          "key_points": ["Important points made"],
          "comedic_elements": ["Jokes, bits, or satirical takes"]
        }
      ],
      "host_perspective": "Host's angle or stance",
      "notable_segments": [
        {
          "title": "Segment title",
          "description": "What happened in this segment",
          "timestamp": "Timestamp if available"
        }
      ],
      "visual_elements": ["Clips, graphics, or props used"],
      "audience_engagement": "Description of audience reaction if applicable"
    }
  },
  "video_type": "commentary"
}

For single product reviews (video_type: "review"):
{
  "core_summary": {
    "core_concepts": "Overview of the product being reviewed",
    "key_insights": ["Main findings and recommendations"]
  },
  "extended_enrichment": {
    "review_details": {
      "product_name": "Name of the product",
      "manufacturer": "Brand or company",
      "price_point": "Price if mentioned",
      "key_features": ["Main features discussed"],
      "pros": ["Positive aspects"],
      "cons": ["Negative aspects"],
      "performance": {
        "highlights": ["Notable performance aspects"],
        "issues": ["Problems or concerns"]
      },
      "value_assessment": "Overall value proposition",
      "recommendation": "Final recommendation",
      "best_for": ["Ideal use cases or users"],
      "timestamps": [
        {
          "time": "Timestamp",
          "topic": "Section topic"
        }
      ]
    }
  },
  "video_type": "review"
}

For product comparisons (video_type: "comparison"):
{
  "core_summary": {
    "core_concepts": "Overview of the products being compared",
    "key_insights": ["Key differences and findings"]
  },
  "extended_enrichment": {
    "items_compared": [
      {
        "name": "Product name",
        "features": ["List of features"],
        "price": "Price if mentioned",
        "pros": ["Advantages"],
        "cons": ["Disadvantages"],
        "best_for": "Ideal use case"
      }
    ],
    "comparative_analysis": "Overall comparison summary",
    "recommendations": "Final recommendations"
  },
  "video_type": "comparison"
}

For tutorial/educational videos (video_type: "tutorial"):
{
  "core_summary": {
    "core_concepts": "Brief overview of the educational content",
    "key_insights": ["Key learning points or takeaways"]
  },
  "extended_enrichment": {
    "tutorial_details": {
      "prerequisites": ["Required tools or knowledge"],
      "learning_objectives": ["What viewers will learn"],
      "steps": [
        {
          "title": "Step title",
          "description": "Detailed explanation",
          "timestamp": "Timestamp if available",
          "code_snippet": "Code example if applicable",
          "key_points": ["Important points about this step"]
        }
      ],
      "best_practices": ["Recommended practices"],
      "common_pitfalls": ["Common mistakes to avoid"],
      "resources": [
        {
          "name": "Resource name",
          "type": "Tool, library, etc.",
          "link": "URL if available"
        }
      ]
    }
  },
  "video_type": "tutorial"
}

For recipe/cooking videos (video_type: "recipe"):
{
  "core_summary": {
    "core_concepts": "Brief overview of the recipe and its appeal",
    "key_insights": ["List of key takeaways about the recipe"]
  },
  "extended_enrichment": {
    "recipes": [
      {
        "name": "Recipe name in English (Original Language Name)",
        "cook_time": "Total cooking time",
        "difficulty": "Easy/Medium/Hard",
        "ingredients": [
          "List of ingredients with measurements (translated to English)"
        ],
        "key_steps": [
          "List of main cooking steps (translated to English)"
        ],
        "tips": [
          "Cooking tips and tricks (translated to English)"
        ],
        "serving_size": "Number of servings"
      }
    ],
    "cooking_notes": {
      "equipment_needed": ["Required kitchen equipment"],
      "preparation_tips": ["Important preparation notes"],
      "storage_info": "Storage and leftover instructions"
    }
  }
}

For news/commentary videos (video_type: "news"):
{
  "core_summary": {
    "core_concepts": "Factual summary of the main topic or event",
    "key_insights": ["Main points or claims made"]
  },
  "extended_enrichment": {
    "news_details": {
      "context": "Background information about the event/topic",
      "key_points": ["Specific points or claims made"],
      "quotes": [
        {
          "text": "Exact quote",
          "speaker": "Name and role",
          "context": "Context of the quote"
        }
      ],
      "fact_check": [
        {
          "claim": "Claim made",
          "context": "Supporting details or evidence"
        }
      ],
      "participants": [
        {
          "name": "Name",
          "role": "Position or role",
          "affiliation": "Organization"
        }
      ]
    }
  },
  "video_type": "news"
}

Fallback case (video_type: "fallback"):
{
  "core_summary": {
    "core_concepts": "Brief summary of the video content",
    "key_insights": ["Main takeaways"]
  },
  "video_type": "fallback"
}

Remember: Only choose ONE video type that best matches the content and return a valid JSON object containing only factual, verifiable information (using direct quotes when possible) and include specific details (like timestamps) if available.
`;

const SHORTS_SYSTEM_PROMPT = `You are analyzing a YouTube Short (short-form video). Your task is to provide a rich, detailed analysis as a JSON object in this specific format:

{
  "core_summary": {
    "core_concepts": "Brief overview of the main content",
    "key_insights": ["Key points or highlights"],
    "main_subject": "Primary person, event, or topic",
    "action_shown": "Description of what's happening in the video",
    "content_context": "Background information and context",
    "content_purpose": "Intent of the content (promotional, entertainment, etc.)",
    "visual_elements": ["List of key visual components"],
    "audio_elements": ["List of key audio components"],
    "call_to_action": "Any calls to action in the content"
  },
  "video_type": "fallback"
}

Return your analysis as a valid JSON object following this exact structure.`;

const USER_PROMPT_TEMPLATE = (metadata: VideoMetadata) => `
Analyze this YouTube video metadata and return a JSON response:

Title: ${metadata.title}
Description: ${metadata.description}
Channel: ${metadata.channelTitle}
Channel Description: ${metadata.channelDescription}
Duration: ${metadata.duration}
Published: ${metadata.publishedAt}

Provide a structured JSON analysis following the format specified.`;

async function analyzeWithOpenAI(metadata: VideoMetadata): Promise<EnrichedVideoMetadata> {
  try {
    const isShort = metadata.url?.includes('/shorts/');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: isShort ? SHORTS_SYSTEM_PROMPT : SYSTEM_PROMPT 
        },
        { 
          role: "user", 
          content: USER_PROMPT_TEMPLATE(metadata) 
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const useOpenAI = searchParams.get('useOpenAI') === 'true';

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('Extracting video ID...');
    const videoId = url.match(/(?:youtube\.com\/(?:shorts\/|[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching video info...');
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      return new Response(JSON.stringify({ error: 'Could not fetch video info' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching channel info...');
    const channelInfo = await getChannelInfo(videoInfo.snippet?.channelId || '');

    const metadata: VideoMetadata = {
      videoId,
      url,
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      channelTitle: videoInfo.snippet?.channelTitle || '',
      channelDescription: channelInfo?.snippet?.description || '',
      channelCategory: channelInfo?.snippet?.categoryId || '',
      publishedAt: videoInfo.snippet?.publishedAt || '',
      duration: videoInfo.contentDetails?.duration || '',
      thumbnails: videoInfo.snippet?.thumbnails || {},
      tags: videoInfo.snippet?.tags || []
    };

    let result: any = { metadata };

    if (useOpenAI) {
      console.log('Running OpenAI analysis...');
      const analysis = await analyzeWithOpenAI(metadata);
      result.analysis = analysis;

      const filePath = path.join(process.cwd(), 'data', 'test_analysis.json');
      await writeFile(filePath, JSON.stringify(result, null, 2));
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to analyze video'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
