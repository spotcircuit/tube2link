import { VideoMetadata } from '@/types/video';
import { analyzeProductContent } from '@/lib/video/analysis/templates/product';
import { getVideoInfo } from '@/lib/youtube';

async function testVideoAnalysis(videoId: string) {
  try {
    // Get video info from YouTube
    const videoInfo = await getVideoInfo(videoId);
    
    if (!videoInfo) {
      console.error('Video not found:', videoId);
      return;
    }

    // Convert to our metadata format
    const metadata: VideoMetadata = {
      videoId,
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      channelTitle: videoInfo.snippet?.channelTitle || '',
      publishedAt: videoInfo.snippet?.publishedAt || '',
      duration: videoInfo.contentDetails?.duration || '',
      thumbnails: videoInfo.snippet?.thumbnails || {},
      tags: videoInfo.snippet?.tags || [],
      category: videoInfo.snippet?.categoryId || '',
      metrics: {
        viewCount: Number(videoInfo.statistics?.viewCount) || 0,
        likeCount: Number(videoInfo.statistics?.likeCount) || 0,
        commentCount: Number(videoInfo.statistics?.commentCount) || 0
      }
    };

    // Mock context for testing - we can adjust these
    const context = {
      primaryType: 'product' as const,
      primaryConfidence: 0.9,
      subType: 'single' as const,
      subConfidence: 0.5  // Set this low to test template selection
    };

    console.log('\n=== Testing Video Analysis ===');
    console.log('Title:', metadata.title);
    console.log('Channel:', metadata.channelTitle);
    console.log('Duration:', metadata.duration);
    console.log('Tags:', metadata.tags.join(', '));
    console.log('\n=== Analysis Result ===');

    const result = await analyzeProductContent(metadata, context);
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error analyzing video:', error);
  }
}

// Test cases
const TEST_VIDEOS = {
  // Clear single product reviews
  singleReview: [
    'dQw4w9WgXcQ',  // Replace with actual review video IDs
  ],
  
  // Clear comparison videos
  comparison: [
    'dQw4w9WgXcQ',  // Replace with actual comparison video IDs
  ],
  
  // Videos that mention products but aren't reviews
  productMention: [
    'dQw4w9WgXcQ',  // Replace with actual product mention video IDs
  ],
  
  // Ambiguous cases
  ambiguous: [
    'dQw4w9WgXcQ',  // Replace with actual ambiguous video IDs
  ]
};

async function runTests() {
  console.log('=== Testing Single Reviews ===');
  for (const id of TEST_VIDEOS.singleReview) {
    await testVideoAnalysis(id);
  }

  console.log('\n=== Testing Comparisons ===');
  for (const id of TEST_VIDEOS.comparison) {
    await testVideoAnalysis(id);
  }

  console.log('\n=== Testing Product Mentions ===');
  for (const id of TEST_VIDEOS.productMention) {
    await testVideoAnalysis(id);
  }

  console.log('\n=== Testing Ambiguous Cases ===');
  for (const id of TEST_VIDEOS.ambiguous) {
    await testVideoAnalysis(id);
  }
}

// Only run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}
