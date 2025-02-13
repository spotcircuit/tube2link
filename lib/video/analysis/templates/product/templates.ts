import { VideoAnalysisPair } from '../../types';

// Base template for when we can't confidently determine specific type
export const BASE_PRODUCT_TEMPLATE = {
  type: 'product_mention',
  signals: [
    'mentions product',
    'discusses service',
    'references brand',
    'talks about item'
  ],
  template: `{
    "type": "product_mention",
    "products": [
      {
        "name": "Product/service name",
        "context": "How it's mentioned",
        "sentiment": "positive|negative|neutral",
        "details": {
          "price": "If mentioned",
          "category": "Type of product/service",
          "notes": "Additional context"
        }
      }
    ],
    "mainPoints": [
      "Key points about the product/service"
    ]
  }`
};

// Specific templates with stricter criteria
export const PRODUCT_TEMPLATES = {
  single: {
    type: 'single_review',
    signals: [
      'dedicated review video',
      'in-depth product analysis',
      'clear review structure',
      'testing/evaluation focus',
      'specific product deep-dive'
    ],
    template: `{
      "type": "single_review",
      "productDetails": {
        "name": "Full product name",
        "category": "Category",
        "price": "Price if mentioned",
        "specs": {}
      },
      "keyFeatures": [
        {
          "feature": "Feature name",
          "rating": 0.0 to 5.0,
          "comments": "Analysis"
        }
      ],
      "prosAndCons": {
        "pros": ["advantages"],
        "cons": ["disadvantages"]
      },
      "verdict": {
        "rating": 0.0 to 5.0,
        "summary": "Overall assessment",
        "recommendedFor": ["use cases"]
      }
    }`
  },
  comparison: {
    type: 'product_comparison',
    signals: [
      'explicit comparison video',
      'multiple products compared directly',
      'structured comparison criteria',
      'clear comparison purpose',
      'comparative analysis focus'
    ],
    template: `{
      "type": "product_comparison",
      "comparisonContext": {
        "category": "Category",
        "products": ["Product names"],
        "criteria": ["Comparison points"]
      },
      "headToHead": [
        {
          "criterion": "What's being compared",
          "winner": "Better product",
          "explanation": "Why"
        }
      ],
      "verdict": {
        "bestOverall": "Best product",
        "bestValue": "Best value option",
        "recommendations": [
          {
            "scenario": "Use case",
            "choice": "Recommended product"
          }
        ]
      }
    }`
  }
} as const;
