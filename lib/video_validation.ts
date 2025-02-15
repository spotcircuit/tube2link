import { z } from 'zod';
import { VideoType } from '@/types/openai';

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

// Schema map for each video type
const schemaMap: Record<VideoType, z.ZodObject<any>> = {
  product: z.object({
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
    })).min(1),
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
  }),
  tutorial: z.object({
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
  }),
  commentary: z.object({
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
  }),
  news: z.object({
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
  }),
  recipe: z.object({
    recipe: z.object({
      name: z.string().min(1, 'Recipe name is required'),
      servings: z.string().min(1, 'Number of servings is required'),
      prepTime: z.string().min(1, 'Preparation time is required'),
      cookTime: z.string().min(1, 'Cooking time is required'),
      totalTime: z.string().min(1, 'Total time is required'),
      ingredients: z.array(z.object({
        item: z.string().min(1, 'Ingredient name is required'),
        amount: z.string().min(1, 'Amount is required'),
        notes: z.string().optional()
      })).min(1, 'At least one ingredient is required'),
      instructions: z.array(z.object({
        step: z.string().min(1, 'Step description is required'),
        details: z.string().min(1, 'Step details are required'),
        timestamp: z.string().regex(timestampPattern, 'Invalid timestamp format').optional(),
        tips: z.array(z.string()).optional()
      })).min(1, 'At least one instruction step is required'),
      nutrition: z.object({
        calories: z.string().optional(),
        protein: z.string().optional(),
        carbs: z.string().optional(),
        fat: z.string().optional()
      }).optional()
    }),
    tips: z.array(z.string()).min(1, 'At least one tip is required'),
    substitutions: z.array(z.object({
      ingredient: z.string().min(1, 'Ingredient name is required'),
      alternatives: z.array(z.string()).min(1, 'At least one alternative is required')
    })).optional(),
    equipment: z.array(z.string()).min(1, 'At least one piece of equipment is required')
  }),
  review: z.object({
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
    verdict: z.object({
      rating: z.number().min(1).max(10),
      summary: z.string().min(1, 'Verdict summary is required'),
      recommendedFor: z.array(z.string()).min(1, 'At least one recommendation is required')
    })
  }),
  comparison: z.object({
    products: z.array(z.object({
      name: z.string().min(1, 'Product name is required'),
      category: z.string().min(1, 'Category is required'),
      price: z.string().optional(),
      specs: z.record(z.string()).optional()
    })).min(2, 'At least two products are required for comparison'),
    comparisonPoints: z.array(z.object({
      feature: z.string().min(1, 'Feature name is required'),
      importance: z.number().min(1).max(10),
      comparison: z.string().min(1, 'Comparison details are required'),
      winner: z.string().min(1, 'Winner must be specified')
    })).min(1, 'At least one comparison point is required'),
    winners: z.array(z.object({
      category: z.string().min(1, 'Category name is required'),
      winner: z.string().min(1, 'Winner must be specified'),
      explanation: z.string().min(1, 'Explanation is required')
    })).min(1, 'At least one winner category is required'),
    verdict: z.object({
      bestOverall: z.string().min(1, 'Best overall product must be specified'),
      bestValue: z.string().min(1, 'Best value product must be specified'),
      situationalRecommendations: z.array(z.object({
        scenario: z.string().min(1, 'Scenario description is required'),
        recommendation: z.string().min(1, 'Recommendation is required'),
        reason: z.string().min(1, 'Reason is required')
      })).min(1, 'At least one situational recommendation is required')
    })
  })
};

// Validation function
export function validateEnrichment(type: VideoType, data: unknown) {
  const schema = schemaMap[type];
  if (!schema) {
    return {
      success: false,
      errors: [{ path: '', message: `Invalid video type: ${type}` }],
    };
  }
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ path: '', message: 'Unknown validation error' }],
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
