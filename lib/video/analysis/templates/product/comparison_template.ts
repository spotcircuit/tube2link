export const COMPARISON_TEMPLATE = {
  system: `You are a product comparison expert. Your task is to analyze a YouTube video comparing two or more products and extract structured information about their comparison. Focus on:
1. Key differences between products
2. Feature-by-feature comparison
3. Target audience for each product
4. Value proposition and price comparison
5. Final recommendations based on user type`,

  user: `Based on this video comparison:
Title: {title}
Description: {description}
Duration: {duration}
Channel: {channel}
Tags: {tags}

Extract a detailed comparison in this JSON format. For each product, include features, pros, cons, and target audience.`,

  template: `{
  "items_compared": [
    {
      "name": "Product name",
      "features": ["List of features"],
      "price": "Price if mentioned",
      "pros": ["List of advantages"],
      "cons": ["List of disadvantages"],
      "best_for": "Target audience"
    }
  ],
  "comparative_analysis": "Detailed analysis of the comparison",
  "recommendations": "Final recommendations",
  "comparison_criteria": ["List of criteria used for comparison"],
  "winner": "Best product if clearly stated"
}`
};
