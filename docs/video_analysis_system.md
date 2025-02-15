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

  Based on the error snippet, Next.js is having trouble exporting your custom error routes—specifically for /_error and /500. This usually happens when the error page (or pages) isn't correctly implemented or when something in the component causes a runtime error during the export phase.

Here are some steps to help troubleshoot and fix the issue:

Check Your Custom Error Pages:

Ensure you have either a proper _error or dedicated 500 error page. If you’re using the Pages Router, for example, create a file at pages/_error.js (or /pages/500.js for server error handling) that exports a valid React component.
For a minimal custom error page, try something like:
jsx
Copy
// pages/500.js
export default function Custom500() {
  return <h1>500 - Server Error</h1>;
}
If you already have one, check that there are no runtime errors (such as accessing browser-only APIs like window without guards).
Review File Structure:

Make sure that non-page components or files aren’t accidentally placed in the pages directory. Next.js treats every file in that folder as a route, which can lead to unexpected behavior if you have extra files.
Examine Strict Compile Issues:

Since you’re compiling in strict mode, type or runtime errors that don’t show up in development might surface. Run your build locally with a strict configuration (using npm run build) and check for any warnings or errors related to your error pages.
Deprecation Warnings:

The warning about punyco (likely referring to the deprecated punycode library) is usually just a warning and may not be the cause of the export error, but it’s worth ensuring all your dependencies are updated.
Temporarily Simplify the Error Page:

To isolate the issue, replace your custom error page’s content with a very simple component (like a plain <h1> tag) to see if the error persists. If the build then succeeds, you can incrementally add back your custom logic to pinpoint what’s causing the failure.
Check for Dynamic Imports or SSR-Only Code:

If your error page (or any components it uses) includes dynamic imports or code that relies on client-side-only APIs, make sure to conditionally load them (or disable SSR for that component using Next.js’s dynamic import with { ssr: false }).

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
