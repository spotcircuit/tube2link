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
      url: `https://youtube.com/watch?v=${videoId}`,
      title: videoInfo.rawVideoData?.snippet?.title ?? '',
      description: videoInfo.rawVideoData?.snippet?.description ?? '',
      channelTitle: videoInfo.rawVideoData?.snippet?.channelTitle ?? '',
      publishedAt: videoInfo.rawVideoData?.snippet?.publishedAt ?? '',
      duration: videoInfo.rawVideoData?.contentDetails?.duration ?? '',
      thumbnails: {
        default: videoInfo.rawVideoData?.snippet?.thumbnails?.default?.url ? {
          url: videoInfo.rawVideoData.snippet.thumbnails.default.url,
          width: videoInfo.rawVideoData.snippet.thumbnails.default.width ?? undefined,
          height: videoInfo.rawVideoData.snippet.thumbnails.default.height ?? undefined
        } : undefined,
        high: videoInfo.rawVideoData?.snippet?.thumbnails?.high?.url ? {
          url: videoInfo.rawVideoData.snippet.thumbnails.high.url,
          width: videoInfo.rawVideoData.snippet.thumbnails.high.width ?? undefined,
          height: videoInfo.rawVideoData.snippet.thumbnails.high.height ?? undefined
        } : undefined,
        maxres: videoInfo.rawVideoData?.snippet?.thumbnails?.maxres?.url ? {
          url: videoInfo.rawVideoData.snippet.thumbnails.maxres.url,
          width: videoInfo.rawVideoData.snippet.thumbnails.maxres.width ?? undefined,
          height: videoInfo.rawVideoData.snippet.thumbnails.maxres.height ?? undefined
        } : undefined,
        medium: videoInfo.rawVideoData?.snippet?.thumbnails?.medium?.url ? {
          url: videoInfo.rawVideoData.snippet.thumbnails.medium.url,
          width: videoInfo.rawVideoData.snippet.thumbnails.medium.width ?? undefined,
          height: videoInfo.rawVideoData.snippet.thumbnails.medium.height ?? undefined
        } : undefined,
        standard: videoInfo.rawVideoData?.snippet?.thumbnails?.standard?.url ? {
          url: videoInfo.rawVideoData.snippet.thumbnails.standard.url,
          width: videoInfo.rawVideoData.snippet.thumbnails.standard.width ?? undefined,
          height: videoInfo.rawVideoData.snippet.thumbnails.standard.height ?? undefined
        } : undefined
      },
      metrics: {
        viewCount: videoInfo.rawVideoData?.statistics?.viewCount ? Number(videoInfo.rawVideoData.statistics.viewCount) : undefined,
        likeCount: videoInfo.rawVideoData?.statistics?.likeCount ? Number(videoInfo.rawVideoData.statistics.likeCount) : undefined,
        commentCount: videoInfo.rawVideoData?.statistics?.commentCount ? Number(videoInfo.rawVideoData.statistics.commentCount) : undefined
      },
      tags: videoInfo.rawVideoData?.snippet?.tags ?? undefined
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
    console.log('Tags:', (metadata.tags || []).join(', '));
    console.log('\n=== Analysis Result ===');

    const result = await analyzeProductContent(metadata, context);
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error in video analysis:', error);
  }
}

// Test cases
const TEST_VIDEOS = {
  // Clear single product reviews
  singleReview: [
    'dQw4w9WgXcQ', // Example video ID
  ],
  // Comparison reviews
  comparisonReview: [
    'dQw4w9WgXcQ', // Example video ID
  ],
  // First impressions
  firstImpressions: [
    'dQw4w9WgXcQ', // Example video ID
  ]
};

async function runTests() {
  for (const [category, videos] of Object.entries(TEST_VIDEOS)) {
    console.log(`\n=== Testing ${category} ===`);
    for (const videoId of videos) {
      console.log(`\nTesting video: ${videoId}`);
      await testVideoAnalysis(videoId);
    }
  }
}

// Only run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}
