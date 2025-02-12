import { z } from 'zod';
import { VideoType } from './video_types';

// Base schemas for common patterns
const timestampPattern = /^([0-5][0-9]):([0-5][0-9])$/;
const urlPattern = /^https?:\/\/.+/;

// Shared schemas
const resourceSchema = z.object({
  url: z.string().regex(urlPattern, 'Invalid URL format'),
  description: z.string().min(1, 'Description is required')
});

const timestampedContentSchema = z.object({
  timestamp: z.string().regex(timestampPattern, 'Invalid timestamp format').optional(),
  description: z.string().min(1, 'Description is required')
});

// Tutorial validation schema
export const tutorialSchema = z.object({
  prerequisites: z.array(z.string()).min(1, 'At least one prerequisite is required'),
  keyLearnings: z.array(z.string()).min(1, 'At least one key learning is required'),
  steps: z.array(z.object({
    title: z.string().min(1, 'Step title is required'),
    description: z.string().min(1, 'Step description is required'),
    timeStamp: z.string().regex(timestampPattern, 'Invalid timestamp format').optional()
  })).min(1, 'At least one step is required'),
  technicalDetails: z.object({
    tools: z.array(z.string()),
    versions: z.array(z.string()),
    platforms: z.array(z.string())
  }),
  resources: z.array(resourceSchema)
});

// Review validation schema
export const reviewSchema = z.object({
  productDetails: z.object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.string().optional(),
    specs: z.record(z.string()).optional()
  }),
  keyFeatures: z.array(z.object({
    feature: z.string().min(1, 'Feature name is required'),
    rating: z.number().min(1).max(5),
    comments: z.string().min(1, 'Comments are required')
  })).min(1, 'At least one key feature is required'),
  prosAndCons: z.object({
    pros: z.array(z.string()).min(1, 'At least one pro is required'),
    cons: z.array(z.string()).min(1, 'At least one con is required')
  }),
  comparisons: z.array(z.object({
    product: z.string().min(1, 'Compared product name is required'),
    differences: z.array(z.string()).min(1, 'At least one difference is required')
  })),
  verdict: z.object({
    rating: z.number().min(1).max(10),
    summary: z.string().min(1, 'Verdict summary is required'),
    recommendedFor: z.array(z.string()).min(1, 'At least one recommendation is required')
  })
});

// Commentary validation schema
export const commentarySchema = z.object({
  keyMoments: z.array(z.object({
    timestamp: z.string().regex(timestampPattern, 'Invalid timestamp format').optional(),
    description: z.string().min(1, 'Description is required'),
    significance: z.string().min(1, 'Significance is required')
  })),
  mainPoints: z.array(z.object({
    point: z.string().min(1, 'Point is required'),
    context: z.string().min(1, 'Context is required')
  })).min(1, 'At least one main point is required'),
  culturalReferences: z.array(z.object({
    reference: z.string().min(1, 'Reference is required'),
    explanation: z.string().min(1, 'Explanation is required')
  })),
  audience: z.object({
    primary: z.array(z.string()).min(1, 'At least one primary audience is required'),
    interests: z.array(z.string()).min(1, 'At least one interest is required')
  }),
  moodAndTone: z.object({
    overall: z.string().min(1, 'Overall tone is required'),
    contentWarnings: z.array(z.string()).optional()
  })
});

// News validation schema
export const newsSchema = z.object({
  summary: z.object({
    headline: z.string().min(1, 'Headline is required'),
    keyPoints: z.array(z.string()).min(1, 'At least one key point is required')
  }),
  context: z.object({
    background: z.string().min(1, 'Background information is required'),
    relatedEvents: z.array(z.string())
  }),
  factCheck: z.object({
    claims: z.array(z.object({
      claim: z.string().min(1, 'Claim is required'),
      verification: z.string().min(1, 'Verification is required'),
      source: z.string().min(1, 'Source is required')
    }))
  }),
  impact: z.object({
    immediate: z.array(z.string()),
    longTerm: z.array(z.string()),
    affectedGroups: z.array(z.string()).min(1, 'At least one affected group is required')
  }),
  sources: z.array(z.object({
    name: z.string().min(1, 'Source name is required'),
    url: z.string().regex(urlPattern, 'Invalid URL format').optional(),
    credibility: z.string().min(1, 'Credibility assessment is required')
  })).min(1, 'At least one source is required')
});

// Lifestyle validation schema
export const lifestyleSchema = z.object({
  experience: z.object({
    location: z.string().optional(),
    duration: z.string().optional(),
    cost: z.string().optional(),
    rating: z.number().min(1).max(5)
  }),
  highlights: z.array(z.object({
    title: z.string().min(1, 'Highlight title is required'),
    description: z.string().min(1, 'Description is required'),
    timestamp: z.string().regex(timestampPattern, 'Invalid timestamp format').optional()
  })).min(1, 'At least one highlight is required'),
  tips: z.array(z.object({
    tip: z.string().min(1, 'Tip is required'),
    importance: z.enum(['must-know', 'helpful', 'optional'])
  })),
  recommendations: z.array(z.object({
    item: z.string().min(1, 'Item is required'),
    why: z.string().min(1, 'Reason is required'),
    where: z.string().optional(),
    cost: z.string().optional()
  })),
  preparation: z.object({
    requirements: z.array(z.string()),
    bestTime: z.string().optional(),
    warnings: z.array(z.string())
  })
});

// Schema map for easy lookup
export const schemaMap = {
  tutorial: tutorialSchema,
  review: reviewSchema,
  commentary: commentarySchema,
  news: newsSchema,
  lifestyle: lifestyleSchema
} as const;

// Validation function
export function validateEnrichment(type: VideoType, data: unknown) {
  const schema = schemaMap[type];
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      errors: [{ path: '', message: 'Unknown validation error' }]
    };
  }
}

// Fallback/repair functions for common issues
export function repairEnrichment(type: VideoType, data: unknown) {
  try {
    // Ensure data is an object before spreading
    const baseData = (typeof data === 'object' && data !== null) ? data : {};

    // Try to fix common issues before validation
    const repairedData = {
      ...baseData,
      // Add missing arrays if undefined
      ...(type === 'tutorial' && {
        prerequisites: (data as any)?.prerequisites || [],
        keyLearnings: (data as any)?.keyLearnings || [],
        steps: (data as any)?.steps || []
      }),
      // Convert string numbers to actual numbers
      ...(type === 'review' && {
        keyFeatures: (data as any)?.keyFeatures?.map((f: any) => ({
          ...f,
          rating: Number(f.rating) || 1
        })) || [],
        verdict: {
          ...(data as any)?.verdict,
          rating: Number((data as any)?.verdict?.rating) || 1
        }
      })
    };

    // Validate the repaired data
    const validationResult = validateEnrichment(type, repairedData);
    if (validationResult.success) {
      return { success: true, data: repairedData };
    }
    return validationResult;
  } catch (error) {
    return {
      success: false,
      errors: [{ path: '', message: 'Failed to repair enrichment data' }]
    };
  }
}
