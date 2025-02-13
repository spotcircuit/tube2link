import { VideoMetadata } from '@/types/video';
import { VideoAnalysisResult } from '../types';
import { analyzeProductContent } from './product';

// Will add other content types here as we implement them
export async function analyzeContent(
  type: 'product' | 'educational' | 'news',
  metadata: VideoMetadata
): Promise<VideoAnalysisResult<any>> {
  switch (type) {
    case 'product':
      return analyzeProductContent(metadata);
    // We'll add these as we implement them
    case 'educational':
    case 'news':
    default:
      throw new Error(`Content type ${type} analysis not yet implemented`);
  }
}
