export const COMPARISON_TEMPLATE = {
  system: `You are a product comparison expert. Your task is to analyze a YouTube video comparing two or more products and extract structured information about their comparison. Focus on:
1. Key differences between products
2. Feature-by-feature comparison with ratings (1-10 scale)
3. Target audience for each product
4. Value proposition and price comparison
5. Final recommendations based on user type`,

  user: `Based on this video comparison:
Title: {title}
Description: {description}
Duration: {duration}
Channel: {channel}
Tags: {tags}

Extract a detailed comparison in this JSON format. For each feature, ALWAYS include a rating on a 1-10 scale and list both strengths (+) and weaknesses (-).`,

  template: `{
  "overview": {
    "category": "Product category",
    "type": "Type of comparison (e.g., Features, Value, Performance)",
    "targetAudience": ["Who this comparison is for"],
    "criteria": ["Main criteria used for comparison"]
  },
  "products": [
    {
      "name": "Product full name",
      "brand": "Brand name",
      "keyFeatures": [
        {
          "name": "Feature name",
          "rating": "X/10",
          "description": "Feature details",
          "strengths": ["+ Positive points"],
          "weaknesses": ["- Negative points"]
        }
      ],
      "bestFor": ["Specific use cases"]
    }
  ],
  "comparisonDetails": [
    {
      "feature": "Feature name",
      "importance": "X/10",
      "winner": "Product name",
      "keyDifferences": ["Notable differences"]
    }
  ],
  "value": {
    "priceComparison": "Price comparison",
    "bestValue": {
      "product": "Product name",
      "reasoning": "Why best value"
    },
    "recommendations": [
      {
        "for": "User type",
        "product": "Product name",
        "reason": "Why recommended"
      }
    ],
    "keyTakeaways": ["Main points"]
  }
}`
};
