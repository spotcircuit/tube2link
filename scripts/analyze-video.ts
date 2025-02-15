import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getVideoInfo } from '../lib/youtube';
import { VideoType } from '../types/openai';

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

  // Look for product review indicators
  if (
    metadata.title?.toLowerCase().includes('review') ||
    metadata.description?.toLowerCase().includes('pros and cons')
  ) {
    scores.push({ type: 'product', score: 0.8 });
  }

  // Look for news indicators
  if (
    metadata.title?.toLowerCase().includes('news') ||
    metadata.title?.toLowerCase().includes('update') ||
    metadata.description?.toLowerCase().includes('breaking')
  ) {
    scores.push({ type: 'news', score: 0.8 });
  }

  // Look for recipe indicators
  if (
    metadata.title?.toLowerCase().includes('recipe') ||
    metadata.title?.toLowerCase().includes('cook') ||
    metadata.title?.toLowerCase().includes('bake') ||
    metadata.description?.toLowerCase().includes('ingredients')
  ) {
    scores.push({ type: 'recipe', score: 0.8 });
  }

  // Look for commentary indicators
  if (
    metadata.title?.toLowerCase().includes('reaction') ||
    metadata.title?.toLowerCase().includes('thoughts on') ||
    metadata.description?.toLowerCase().includes('my take')
  ) {
    scores.push({ type: 'commentary', score: 0.8 });
  }

  // Look for comparison indicators
  if (
    metadata.title?.toLowerCase().includes('vs') ||
    metadata.title?.toLowerCase().includes('versus') ||
    metadata.title?.toLowerCase().includes('comparison') ||
    metadata.description?.toLowerCase().includes('compare')
  ) {
    scores.push({ type: 'comparison', score: 0.8 });
  }

  // Look for review indicators
  if (
    metadata.title?.toLowerCase().includes('review') ||
    metadata.description?.toLowerCase().includes('pros and cons') ||
    metadata.description?.toLowerCase().includes('should you buy')
  ) {
    scores.push({ type: 'review', score: 0.8 });
  }

  return scores;
}

async function analyzeVideo(url: string) {
  try {
    // Extract video ID from URL
    const videoId = url.split('v=')[1];
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get video metadata
    const videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      throw new Error('Could not fetch video info');
    }

    const metadata = {
      title: videoInfo.rawVideoData?.snippet?.title,
      description: videoInfo.rawVideoData?.snippet?.description,
      channelTitle: videoInfo.rawVideoData?.snippet?.channelTitle,
      publishedAt: videoInfo.rawVideoData?.snippet?.publishedAt,
      viewCount: videoInfo.rawVideoData?.statistics?.viewCount,
      likeCount: videoInfo.rawVideoData?.statistics?.likeCount,
      commentCount: videoInfo.rawVideoData?.statistics?.commentCount,
    };

    // Get initial type confidence scores
    const typeScores = getInitialTypeScores(metadata);

    // Create output directory if it doesn't exist
    const outputDir = join(__dirname, '..', 'data', 'analysis');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save results
    const outputPath = join(outputDir, `${videoId}.json`);
    writeFileSync(outputPath, JSON.stringify({
      metadata,
      typeScores,
      url
    }, null, 2));

    console.log(`Analysis saved to ${outputPath}`);
  } catch (error) {
    console.error('Error analyzing video:', error);
  }
}

// Get URL from command line argument
const url = process.argv[2];
if (!url) {
  console.error('Please provide a YouTube URL as an argument');
  process.exit(1);
}

analyzeVideo(url);
