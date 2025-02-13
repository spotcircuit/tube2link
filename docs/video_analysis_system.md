# Video Analysis System

## Overview
The video analysis system uses a tiered approach to detect and analyze different types of YouTube videos. It combines pattern-based detection with AI analysis when needed, using specialized templates for different video types.

## Detection Flow

### 1. Initial Type Detection (First Tier)
- Uses pattern matching on video metadata (title, description, tags)
- Requires 40%+ confidence to proceed to specific analysis
- Main types:
  - Product/Review
  - Tutorial
  - Commentary
  - News
  - Lifestyle

### 2. Subtype Detection (Second Tier)
For videos that pass first tier (>40% confidence):

#### Product/Review Videos
- If confidence ≥ 80%:
  - Use specific template (review or comparison)
- If confidence 40-80%:
  - Use AI analysis to determine specific type
- If confidence < 40%:
  - Fall back to base template

#### Other Video Types
- If confidence ≥ 80%:
  - Use type-specific template
- If confidence < 80%:
  - Fall back to base template

## Folder Structure
```
lib/video/analysis/templates/
├── base/               # Base templates for any video type
├── product/           # Product review & comparison
├── tutorial/          # How-to & educational
├── commentary/        # Reactions & gameplay
├── news/             # News & updates
└── lifestyle/        # Vlogs & experiences
```

## Templates

### Base Template
- Used when confidence is low
- Generic video content analysis
- Basic metadata extraction

### Specialized Templates

#### Product Templates
1. Single Review Template
   - Detailed product analysis
   - Features and specifications
   - Pros and cons

2. Comparison Template
   - Multiple product comparison
   - Feature comparison matrix
   - Pros and cons for each

#### Tutorial Templates
- Step-by-step instructions
- Required materials/prerequisites
- Learning outcomes

#### Commentary Templates
- Reaction highlights
- Key moments
- Entertainment value

#### News Templates
- Key points
- Sources
- Timeline of events

#### Lifestyle Templates
- Experience highlights
- Location/context
- Personal insights

## Confidence Scoring

### First Tier (Type Detection)
- High confidence patterns: +3 points
- Medium confidence patterns: +2 points
- Low confidence patterns: +1 point
- Channel patterns: +2 points
- Category bonus: +1 point
- Total possible score: 7 points
- Threshold: 40% (2.8 points)

### Second Tier (Subtype Detection)
- Title patterns: 40% weight
- Description patterns: 30% weight
- Tags: 20% weight
- Metadata (duration, etc.): 10% weight
- Threshold for specific template: 80%

## Implementation Notes
1. Always validate metadata before processing
2. Use optional chaining for nullable fields
3. Implement fallbacks for missing data
4. Log detection signals for debugging
5. Cache results when possible

## Future Improvements
1. Add more specialized templates
2. Refine confidence scoring
3. Implement feedback loop for AI analysis
4. Add support for multi-language detection
5. Enhance pattern matching with ML models
