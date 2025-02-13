import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getVideoMetadata } from '../lib/youtube';
import { generateTypeVerificationPrompt, generateAnalysisPrompt } from '../lib/video_prompts';
import { VideoType } from '../types/video';

// Helper to get initial type confidence scores
function getInitialTypeScores(metadata: any): Array<{ type: VideoType; score: number }> {
  const scores: Array<{ type: VideoType; score: number }> = [];
  
  // Look for tutorial indicators
  if (
    metadata.title?.toLowerCase().includes('tutorial') ||
    metadata.title?.toLowerCase().includes('how to') ||
    metadata.description?.toLowerCase().includes('in this tutorial')
  ) {
    scores.push({ type: 'tutorial', score: 0.8 });
  }

  // Look for educational content indicators
  if (
    metadata.title?.toLowerCase().includes('learn') ||
    metadata.title?.toLowerCase().includes('explained') ||
    metadata.description?.toLowerCase().includes('in this lesson')
  ) {
    scores.push({ type: 'educational', score: 0.7 });
  }

  // Look for review indicators
  if (
    metadata.title?.toLowerCase().includes('review') ||
    metadata.description?.toLowerCase().includes('pros and cons')
  ) {
    scores.push({ type: 'review', score: 0.8 });
  }

  // Look for demo indicators
  if (
    metadata.title?.toLowerCase().includes('demo') ||
    metadata.title?.toLowerCase().includes('showcase') ||
    metadata.description?.toLowerCase().includes('demonstration')
  ) {
    scores.push({ type: 'demo', score: 0.8 });
  }

  // Look for news indicators
  if (
    metadata.title?.toLowerCase().includes('news') ||
    metadata.title?.toLowerCase().includes('update') ||
    metadata.description?.toLowerCase().includes('breaking')
  ) {
    scores.push({ type: 'news', score: 0.7 });
  }

  // Add howto as a fallback with lower confidence if tutorial-like
  if (
    metadata.title?.toLowerCase().includes('how to') ||
    metadata.description?.toLowerCase().includes('step by step')
  ) {
    scores.push({ type: 'howto', score: 0.6 });
  }

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

async function analyzeVideo(url: string) {
  try {
    // Get video metadata
    const metadata = await getVideoMetadata(url);
    if (!metadata) {
      throw new Error('Could not fetch video metadata');
    }

    // Get initial type scores based on metadata
    const typeScores = getInitialTypeScores(metadata);

    // Generate type verification prompt
    const typePrompt = generateTypeVerificationPrompt(metadata, typeScores);

    // Generate analysis prompt for most likely type
    const mostLikelyType = typeScores[0]?.type || 'tutorial';
    const analysisPrompt = generateAnalysisPrompt(metadata, mostLikelyType);

    const analysis = {
      url,
      metadata: {
        title: metadata.title,
        description: metadata.description,
        duration: metadata.duration,
        channelTitle: metadata.channelTitle,
        statistics: metadata.statistics,
        tags: metadata.tags
      },
      typeDetection: {
        possibleTypes: typeScores,
        typeVerificationPrompt: typePrompt
      },
      templatePreview: {
        mostLikelyType,
        analysisPrompt,
        baseTemplate: {
          summary: "string",
          core_concepts: {
            key_points: [{ content: "string", importance: 0.0 }],
            insights: [{ content: "string", importance: 0.0 }]
          }
        }
      }
    };

    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir);
    }

    // Save analysis to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `video-analysis-${metadata.id}-${timestamp}.json`;
    const filePath = join(dataDir, filename);
    
    writeFileSync(filePath, JSON.stringify(analysis, null, 2));
    console.log(`Analysis saved to: ${filePath}`);
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
}

// Get URL from command line argument
const url = process.argv[2];
if (!url) {
  console.error('Please provide a YouTube URL as an argument');
  process.exit(1);
}

analyzeVideo(url).catch(error => {
  console.error('Failed to analyze video:', error);
  process.exit(1);
});
