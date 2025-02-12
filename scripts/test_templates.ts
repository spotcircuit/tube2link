import { generatePrompt, PostGenerationMode } from '../lib/ai';
import { PostSettings } from '../types/post';
import { VideoData } from '../types/video';

// Sample test data
const testData: VideoData = {
  id: "test123",
  title: "How to Build a Web Scraper in Python - Complete Tutorial",
  description: "In this detailed tutorial, we'll walk through building a web scraper from scratch using Python and BeautifulSoup. Learn best practices and handle common challenges.",
  channelId: "test_channel_123",
  channelTitle: "Test Channel",
  metadata: {
    title: "How to Build a Web Scraper in Python - Complete Tutorial",
    channelTitle: "Test Channel",
    description: "In this detailed tutorial, we'll walk through building a web scraper from scratch using Python and BeautifulSoup. Learn best practices and handle common challenges.",
    videoId: "test123"
  },
  gptQuickSummary: "A comprehensive tutorial on web scraping with Python, covering setup, implementation, and advanced techniques.",
  patterns: {
    key_points: [
      { content: "Setting up Python and required libraries" },
      { content: "Understanding HTML structure for scraping" },
      { content: "Implementing error handling and rate limiting" }
    ],
    examples: [
      { content: "Scraping product data from an e-commerce site" },
      { content: "Extracting news articles with pagination" }
    ]
  },
  semantic: {
    actions: [
      { content: "Install BeautifulSoup and requests libraries", importance: 0.9 },
      { content: "Create a basic scraper function", importance: 0.8 }
    ]
  },
  roles: {
    user: [
      { content: "Developers looking to automate data collection", matched_patterns: ["pattern1"] },
      { content: "Data analysts needing web data", matched_patterns: ["pattern2"] }
    ],
    developer: [
      { content: "Using async requests for better performance", matched_patterns: ["tech1"] },
      { content: "Implementing proxy rotation", matched_patterns: ["tech2"] }
    ]
  }
};

// Test settings
const testSettings: PostSettings[] = [
  {
    tone: 0.5, // Balanced
    personality: { charm: 50, wit: 50, humor: 50, sarcasm: 30 },
    length: 'standard'
  }
];

// Test each template with different settings
async function testTemplates() {
  const modes: PostGenerationMode[] = ['question', 'story', 'action', 'insight', 'problem_solution', 'comparison'];
  
  for (const mode of modes) {
    console.log(`\n=== Testing ${mode} template ===\n`);
    for (const settings of testSettings) {
      const prompt = generatePrompt(testData, mode, settings);
      console.log(`\n--- With tone ${settings.tone} ---\n`);
      console.log(prompt);
      console.log('\n' + '='.repeat(80) + '\n');
    }
  }
}

// Helper to get tone label
function getToneLabel(tone: number): string {
  if (tone < 0.33) return 'Casual';
  if (tone < 0.66) return 'Balanced';
  return 'Formal';
}

// Run tests
testTemplates().catch(console.error);
