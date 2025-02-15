import { VideoMetadata } from '@/types/video';
import { VideoType } from '@/types/openai';
import { VideoAnalysisResult } from '../types';
import { analyzeProductContent } from './product';

// Will add other content types here as we implement them
export async function analyzeContent(
  type: VideoType,
  metadata: VideoMetadata
): Promise<VideoAnalysisResult<any>> {
  switch (type) {
    case 'product':
      return analyzeProductContent(metadata, {
        primaryType: 'product',
        primaryConfidence: 0.8,
        subType: 'single',
        subConfidence: 0.6
      });
    // We'll add these as we implement them
    case 'tutorial':
    case 'news':
    case 'commentary':
    case 'recipe':
    case 'comparison':
    case 'review':
    default:
      throw new Error(`Content type ${type} analysis not yet implemented`);
  }
}
