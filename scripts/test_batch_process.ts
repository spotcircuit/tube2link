import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

import { getOpenAIClient } from '../lib/openai';
import { splitText, mergeGeneratedContent } from '../lib/batchProcessor';
import * as fs from 'fs/promises';
import OpenAI from 'openai';

// Set environment variables directly
process.env.OPENAI_API_KEY = 'sk-FJ8sXjgvDhdem9oL8jUU_PUZ5p6Oj78Y0uFdQUhv2cZdBPsAiYzeLJp68';

async function processBatchFromEnrichedPrompt(videoId: string) {
  try {
    const dataDir = path.resolve(process.cwd(), 'data');
    console.log('Data directory:', dataDir);
    
    // Read the enriched prompt
    const enrichedPromptPath = path.resolve(dataDir, `${videoId}_enriched_prompt.txt`);
    console.log(`Reading enriched prompt from: ${enrichedPromptPath}`);
    
    // Check if file exists
    try {
      await fs.access(enrichedPromptPath);
      console.log('File exists and is accessible');
    } catch (error) {
      console.error('File access error:', error);
      throw new Error(`Cannot access enriched prompt file: ${enrichedPromptPath}`);
    }

    const enrichedPrompt = await fs.readFile(enrichedPromptPath, 'utf-8');
    console.log('Enriched prompt length:', enrichedPrompt.length);

    // Split into batches if needed
    const batches = splitText(enrichedPrompt);
    console.log(`Split into ${batches.length} batch(es)`);

    // Initialize OpenAI client
    const openai = getOpenAIClient();
    console.log('Initialized OpenAI client');

    let batchResults = [];

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length}`);

      // Generate post for this batch
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        messages: [
          {
            role: "system",
            content: `You are a professional LinkedIn content creator. Generate a concise, engaging LinkedIn post${batches.length > 1 ? ` (Part ${i + 1}/${batches.length})` : ''} based on the provided context and guidelines.`
          },
          {
            role: "user",
            content: batches[i]
          }
        ],
        temperature: 0.7,
        max_tokens: 50000
      });

      if (!completion.choices[0]?.message?.content) {
        throw new Error('No content generated from OpenAI');
      }

      const generatedPost = completion.choices[0].message.content;
      batchResults.push(generatedPost);

      // Save intermediate result
      const batchResultPath = path.resolve(dataDir, `${videoId}_batch_${i + 1}_result.txt`);
      await fs.writeFile(batchResultPath, generatedPost, 'utf-8');
      console.log(`Batch ${i + 1} result saved to: ${batchResultPath}`);
    }

    // Combine all results
    const combinedPost = mergeGeneratedContent(batchResults);

    // Save batch result
    const batchResultPath = path.resolve(dataDir, `${videoId}_batch_result.txt`);
    await fs.writeFile(batchResultPath, combinedPost, 'utf-8');
    console.log(`Combined result saved to: ${batchResultPath}`);
    
    // Save batch metadata
    const batchMetadataPath = path.resolve(dataDir, `${videoId}_batch_metadata.json`);
    await fs.writeFile(batchMetadataPath, JSON.stringify({
      batchId: `batch_${Date.now()}_${videoId}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      model: 'gpt-4o-mini-realtime-preview-2024-12-17',
      inputFile: enrichedPromptPath,
      outputFile: batchResultPath,
      totalBatches: batches.length,
      estimatedTokens: enrichedPrompt.length / 4 // Rough estimate
    }, null, 2), 'utf-8');
    console.log(`Batch metadata saved to: ${batchMetadataPath}`);

    console.log('Batch processing completed successfully!');
    
  } catch (error: any) {
    console.error('Error in batch processing:', error?.message || error);
    
    // Save error information
    const errorPath = path.resolve(process.cwd(), 'data', `${videoId}_batch_error.json`);
    await fs.writeFile(errorPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error?.message || String(error),
      stack: error?.stack
    }, null, 2), 'utf-8');
    
    throw error;
  }
}

// Get video ID from command line argument
const videoId = process.argv[2];
if (!videoId) {
  console.error('Please provide a video ID as argument');
  process.exit(1);
}

// Run the batch process
processBatchFromEnrichedPrompt(videoId)
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error('Failed to process batch:', error?.message || error);
    process.exit(1);
  });
