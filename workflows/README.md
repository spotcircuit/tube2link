# Tube2Link n8n Workflow Documentation

## Overview
The Tube2Link n8n workflow provides two main functionalities:
1. **Video Analysis**: Analyzes YouTube videos and provides structured insights
2. **Social Post Generation**: Creates engaging social media posts about YouTube videos

## Quick Start

### Video Analysis
```bash
curl -X POST http://localhost:5678/webhook-test/tube2link \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"}'
```

### Social Post Generation
```bash
curl -X POST http://localhost:5678/webhook-test/tube2link/social \
  -H "Content-Type: application/json" \
  -d '{
    "videoData": {
      "title": "Video Title",
      "channelTitle": "Channel Name",
      "description": "Video Description",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID"
    },
    "template": "howto",
    "settings": {
      "tone": 60,
      "length": "standard",
      "personality": {
        "charm": 70,
        "wit": 50,
        "humor": 40,
        "sarcasm": 20
      },
      "useEmojis": true
    }
  }'
```

## Requirements

### System Requirements
- n8n version 1.76.1 or higher
- Node.js 16.x or higher
- PowerShell or equivalent for testing

### API Keys
- OpenAI API key
- YouTube Data API key

### Environment Variables
Required environment variables in n8n:
```env
OPENAI_API_KEY=your_openai_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### Rate Limits
- YouTube Data API: 10,000 units per day (free tier)
- OpenAI API: Depends on your subscription tier

## Installation

1. Import the workflow JSON into your n8n instance
2. Configure API credentials:
   - Add OpenAI API credentials
   - Add YouTube API credentials
3. Activate the workflow
4. Test the endpoints using the provided test cases

## Error Handling

The workflow includes comprehensive error handling:

1. **Input Validation**
   - Video URL format validation
   - Required fields checking
   - Parameter type validation

2. **API Error Handling**
   - YouTube API errors
   - OpenAI API errors
   - Network timeouts

3. **Response Validation**
   - OpenAI response structure validation
   - Content format validation
   - Empty response handling

## Technical Details

### Endpoints

#### 1. Video Analysis (`/tube2link`)
- **Method**: POST
- **Input**: JSON object with `videoUrl`
- **Output**: JSON object with `formattedContent` containing video analysis
- **Process Flow**:
  1. Extract Video ID from URL
  2. Fetch video metadata from YouTube API
  3. Select appropriate analysis prompt
  4. Generate analysis using OpenAI
  5. Format and return response

#### 2. Social Post Generation (`/tube2link/social`)
- **Method**: POST
- **Input**: JSON object with `videoData`, `template`, and `settings`
- **Output**: JSON object with `formattedContent` containing social media post
- **Process Flow**:
  1. Generate system and user prompts based on settings
  2. Create social post using OpenAI
  3. Format and return response

### Node Configuration

#### Video Analysis Workflow
1. **Webhook**
   - Path: `/tube2link`
   - Response Mode: When Last Node Finishes
   - Response Format: First Entry JSON

2. **Extract Video ID**
   - Function: Extracts YouTube video ID from URL
   - Regex Pattern: `/(?:v=|\/)([a-zA-Z0-9_-]{11})/`

3. **YouTube Data API**
   - Fetches video metadata
   - Required fields: title, description, channelTitle

4. **Select Prompt**
   - Generates analysis prompt based on video data
   - Includes system and user prompts

5. **OpenAI Analysis**
   - Model: GPT-4
   - Temperature: Dynamic based on content
   - JSON Output: true

6. **Format Content**
   - Formats OpenAI response
   - Adds video URL to response

#### Social Post Workflow
1. **Social Webhook**
   - Path: `/tube2link/social`
   - Response Mode: When Last Node Finishes
   - Response Format: First Entry JSON

2. **Social Prompt**
   - Generates prompts based on:
     - Template type
     - Tone settings (0-100)
     - Length preference
     - Personality traits
     - Emoji preferences

3. **Social OpenAI**
   - Model: GPT-4
   - Temperature: Dynamic based on personality settings
   - JSON Output: true

4. **Format Social Post**
   - Extracts post content
   - Returns formatted response

### Example Test Case

#### Test Video Analysis
```powershell
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook-test/tube2link" -ContentType "application/json" -Body '{
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
}'
```

Expected Response:
```json
{
    "formattedContent": "Detailed analysis of the video content..."
}
```

#### Test Social Post Generation
```powershell
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook-test/tube2link/social" -ContentType "application/json" -Body '{
    "videoData": {
        "title": "Self-hosting n8n - The Complete Guide",
        "channelTitle": "n8n",
        "description": "Learn how to self-host n8n using various methods",
        "url": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
    },
    "template": "howto",
    "settings": {
        "tone": 60,
        "length": "standard",
        "personality": {
            "charm": 70,
            "wit": 50,
            "humor": 40,
            "sarcasm": 20
        },
        "useEmojis": true
    }
}'
```

Expected Response:
```json
{
    "formattedContent": "🚀 Ready to take control of your automation? Check out our latest video..."
}
```

## Examples

### Video Analysis Endpoint

#### Request
```bash
curl -X POST http://localhost:5678/webhook/tube2link \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
  }'
```

PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook/tube2link" `
  -ContentType "application/json" `
  -Body '{
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
  }'
```

#### Response
```json
{
  "status": "success",
  "data": {
    "content": {
      "title": "Video Title",
      "description": "Video Description",
      "tags": ["tag1", "tag2"],
      "statistics": {
        "viewCount": "1234",
        "likeCount": "100",
        "commentCount": "50"
      }
    },
    "type": "video_analysis",
    "format": "json",
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
  }
}
```

### Social Post Generation Endpoint

#### Request
```bash
curl -X POST http://localhost:5678/webhook/tube2link/social \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY",
    "platform": "twitter",
    "tone": "professional",
    "length": "short"
  }'
```

PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook/tube2link/social" `
  -ContentType "application/json" `
  -Body '{
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY",
    "platform": "twitter",
    "tone": "professional",
    "length": "short"
  }'
```

#### Response
```json
{
  "status": "success",
  "data": {
    "formattedContent": "Check out this amazing video on AI development! Learn about the latest trends and best practices. #AI #Development #Tutorial",
    "type": "social_post",
    "platform": "twitter",
    "videoUrl": "https://www.youtube.com/watch?v=kq5bmrjPPAY"
  }
}
```

### Input Parameters

#### Video Analysis
| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| videoUrl  | string | Yes      | Full YouTube video URL         |

#### Social Post Generation
| Parameter | Type   | Required | Description                                           |
|-----------|--------|----------|-------------------------------------------------------|
| videoUrl  | string | Yes      | Full YouTube video URL                               |
| platform  | string | No       | Target platform (twitter, linkedin, facebook)        |
| tone      | string | No       | Post tone (professional, casual, funny)             |
| length    | string | No       | Post length (short, medium, long)                   |

### Error Responses

```json
{
  "status": "error",
  "message": "Invalid video URL provided",
  "code": "INVALID_INPUT"
}
```

Common error codes:
- `INVALID_INPUT`: Invalid parameters provided
- `VIDEO_NOT_FOUND`: YouTube video not accessible
- `API_ERROR`: Error calling YouTube API
- `RATE_LIMIT`: API rate limit exceeded

## Security & Best Practices

### API Security
1. **Credential Management**
   - Store API keys in n8n credentials
   - Never expose API keys in code or responses
   - Rotate API keys periodically

2. **Webhook Security**
   - Use HTTPS in production
   - Consider adding authentication for production
   - Implement rate limiting
   - Validate input data

3. **Response Security**
   - Sanitize output data
   - Remove sensitive information
   - Use appropriate HTTP status codes

### Performance Optimization
1. **API Calls**
   - Cache YouTube API responses
   - Optimize OpenAI token usage
   - Implement request batching when possible

2. **Response Times**
   - Monitor webhook response times
   - Set appropriate timeouts
   - Implement async processing for long operations

3. **Resource Usage**
   - Monitor n8n resource usage
   - Implement appropriate error retries
   - Clean up temporary data

### Monitoring
1. **Workflow Health**
   - Monitor execution success rates
   - Track API response times
   - Set up alerts for failures

2. **API Usage**
   - Track API quota usage
   - Monitor rate limits
   - Set up usage alerts

3. **Error Tracking**
   - Log error patterns
   - Monitor error rates
   - Set up error notifications

### Notes
- Both endpoints require active workflow testing in n8n
- OpenAI API key must be configured in n8n credentials
- YouTube API key must be configured for video analysis
- All responses are in JSON format with consistent structure
- Error handling is implemented at each node
- Responses include markdown formatting for easy integration
