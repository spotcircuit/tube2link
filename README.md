# Tube2Link: YouTube to LinkedIn Content Generator

A Next.js application that converts YouTube videos into engaging LinkedIn posts using YouTube's caption system and AI-powered content generation.

## Current Development Status
- ✅ Video metadata fetching and preview (working)
- ✅ OAuth authentication flow (working)
- ✅ Initial video loading and UI (working)
- ✅ Transcription generation (working)
  - Using YouTube's caption system via youtube-transcript-api
  - Supports both manual and auto-generated captions
  - Includes error handling and fallbacks

## Features

### 1. Two-Step Content Generation
- **Step 1: Video Details** (✅ Working)
  - Fetch video metadata (title, duration, thumbnail)
  - Quick preview before transcription
  - Validate video accessibility

- **Step 2: Transcription & Post Generation** (✅ Working)
  - Fast automatic caption extraction
  - Support for multiple languages
  - AI-powered LinkedIn post generation

### 2. Authentication & Security
- Secure OAuth 2.0 authentication with Google
- Automatic token refresh
- Persistent session management
- Secure credential storage

### 3. User Interface
- Modern, responsive design with TailwindCSS
- Smooth animations and transitions
- Real-time loading states
- Error handling with user-friendly messages
- Copy-to-clipboard functionality

### 4. Post Generation Features
- **Length Control** (✅ Working)
  - Brief (150-200 words)
  - Standard (200-300 words)
  - Detailed (300-500 words)
  - Accurate word count validation

- **Content Optimization** (✅ Working)
  - Action-oriented writing style
  - Strategic video URL placement
  - Optimized hashtag positioning
  - Engagement-focused formatting

## Upcoming Features

#### 1. Rich Text Editor
- Custom post editing with formatting
- Real-time word count
- Markdown support
- Save drafts functionality

#### 2. LinkedIn Preview
- Real-time post preview
- Character count validation
- Mobile/desktop view toggle
- Image preview support

## Video Types Implementation

Below are the supported video types and their metadata templates:

### 1. Technical / Instructional Videos
- **General Overview**
  - Title/Topic
  - Summary of covered content
- **Core Content**
  - Key concepts and principles
  - Main takeaways
- **Practice & Application**
  - Implementation steps
  - Required tools/prerequisites
  - Limitations and caveats
  - Code examples/demos
- **Additional Resources**
  - Documentation links
  - Related tutorials

### 2. Product Reviews / Comparisons
- **Overview**
  - Category and type
  - Target audience
  - Comparison criteria
- **Product Details**
  - Name and brand
  - Key features with ratings
  - Strengths and weaknesses
  - Best use cases
- **Comparison Analysis**
  - Feature-by-feature breakdown
  - Winner per category
  - Key differences
- **Value Assessment**
  - Price comparison
  - Best value option
  - Recommendations by user type
  - Key takeaways

### 3. News / Current Events
- **Overview**
  - Headline
  - Summary and significance
- **Detailed Breakdown**
  - Key points
  - Background context
  - Expert analysis
- **Supporting Information**
  - Notable quotes
  - Impact assessment
  - Additional sources

### 4. Entertainment / Shows
- **General Overview**
  - Show title
  - Episode summary
- **Segment Breakdown**
  - Key moments
  - Guest information
  - Recurring segments
- **Engagement**
  - Audience reactions
  - Behind-the-scenes info
  - Related content

### 5. Gaming Content
- **Overview**
  - Game title
  - Gameplay summary
- **Content Analysis**
  - Gameplay highlights
  - Tips and strategies
  - Technical details
- **Additional Elements**
  - Review/rating
  - Community feedback
  - Resource links

### 6. Educational / Lectures
- **Overview**
  - Topic
  - Learning objectives
- **Content Structure**
  - Key concepts
  - Detailed explanations
  - Examples/case studies
- **Supplementary**
  - Discussion points
  - Additional materials
  - Further reading

### Customization Tips
1. **Flexibility**: Combine elements from multiple templates as needed
2. **Audience Focus**: Prioritize information relevant to your viewers
3. **Consistency**: Maintain similar structure for similar content types
4. **Evolution**: Refine templates based on user feedback

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/tube2link.git
cd tube2link
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_YT_API_KEY=your_youtube_api_key
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/callback
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

4. Run the development server
```bash
npm run dev
```

## Project Structure
```
tube2link/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── route.ts         # Authentication endpoints
│   │   │   └── callback/
│   │   │       └── route.ts     # OAuth callback handler
│   │   └── convert/
│   │       └── route.ts         # Video processing endpoint
│   ├── layout.tsx
│   └── page.tsx                 # Main application page
├── lib/
│   ├── auth.ts                  # OAuth configuration
│   ├── config.ts               # Environment configuration
│   └── transcription.ts        # Transcription utilities
└── public/
    └── images/
        └── tube2linkedin.png   # Application logo
```

## API Endpoints

### 1. `/api/auth`
- **GET**: Check authentication status or initiate OAuth flow
- Returns: Authentication status or OAuth URL

### 2. `/api/auth/callback`
- **GET**: Handle OAuth callback
- Stores authentication tokens
- Redirects back to application

### 3. `/api/convert`
- **POST**: Process YouTube video
- Parameters:
  - `videoUrl`: URL or ID of YouTube video
  - `forceTranscribe`: Force new transcription (optional)
- Returns: Video metadata and transcription

## Error Handling
The application includes comprehensive error handling for:
- Invalid YouTube URLs
- Videos without captions
- Authentication failures
- Network issues
- API rate limits

## Known Bugs and Issues

### 1. React Rendering Issues
- Objects being rendered as React children in template components
- Error: "Objects are not valid as a React child (found: object with keys {})"
- Status: Under investigation
- Workaround: Using ErrorBoundary and DebugRender components for better error tracking

### 2. OpenAI API Key Issues
If you encounter a 401 error with the OpenAI API:

1. **Environment Variable Conflict**
   - Check for system/user-level `OPENAI_API_KEY` overriding `.env.local`
   - PowerShell check:
     ```powershell
     [System.Environment]::GetEnvironmentVariable('OPENAI_API_KEY', 'User')
     ```
   - Remove conflicting variable:
     ```powershell
     [System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $null, 'User')
     ```

2. **After Environment Fix**
   - Restart terminal/IDE
   - Verify `.env.local` is being used

3. **API Key Format**
   - Must start with `sk-`
   - Match format from OpenAI dashboard

4. **Debug Script**
   - Use `scripts/test-openai.py` to test API key
   - Provides detailed environment debugging

## Troubleshooting

### OpenAI API Key Issues
If you encounter a 401 error with the OpenAI API, check the following:

1. **Environment Variable Conflict**
   - Ensure there's no system or user-level `OPENAI_API_KEY` environment variable overriding your `.env.local` settings
   - To check for user environment variables in PowerShell:
     ```powershell
     [System.Environment]::GetEnvironmentVariable('OPENAI_API_KEY', 'User')
     ```
   - To remove a conflicting user environment variable:
     ```powershell
     [System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $null, 'User')
     ```

2. **After Fixing Environment Variables**
   - Restart your terminal/IDE to ensure it picks up the new environment
   - The application should now use the API key from `.env.local`

3. **Verify API Key Format**
   - Ensure your API key in `.env.local` starts with `sk-` and matches the format from your OpenAI dashboard

4. **Test Script**
   You can use this Python script to test your OpenAI API key and debug environment variables:
   ```python
   import os
   import json
   import requests
   from pathlib import Path
   from dotenv import load_dotenv

   def debug_env():
       print("\n🔍 Environment Debug Info:")
       print(f"Current directory: {os.getcwd()}")
       print(f"Script directory: {Path(__file__).parent}")
       print("\nDotenv files found:")
       for env_file in Path('.').glob('**/.env*'):
           print(f"- {env_file}")
       
       print("\nEnvironment variables:")
       for key in sorted(os.environ):
           if 'KEY' in key or 'SECRET' in key:
               value = os.environ[key]
               print(f"- {key}: {value[:10]}...{value[-10:] if len(value) > 20 else value}")

   def test_api_key():
       try:
           print("🔄 Loading environment variables...")
           
           # Find all .env files
           env_files = list(Path('.').glob('**/.env*'))
           print(f"Found {len(env_files)} .env files:")
           for env_file in env_files:
               print(f"- {env_file}")
           
           # Load .env.local specifically
           env_path = Path(__file__).parent.parent / '.env.local'
           print(f"\nLoading from: {env_path}")
           load_dotenv(env_path)
           
           # Debug environment after loading
           debug_env()
           
           api_key = os.getenv('OPENAI_API_KEY')
           if not api_key:
               raise ValueError("OPENAI_API_KEY not found in .env.local")

           print(f"\nUsing API key: {api_key[:10]}...{api_key[-10:]}")

           headers = {
               "Authorization": f"Bearer {api_key}",
               "Content-Type": "application/json"
           }

           # Define the payload for the API call
           payload = {
               "model": "gpt-3.5-turbo",
               "messages": [
                   {
                       "role": "system",
                       "content": "You are a professional LinkedIn content creator who specializes in creating engaging, high-quality posts from video content."
                   },
                   {
                       "role": "user",
                       "content": "Create a LinkedIn post about AI and automation."
                   }
               ],
               "temperature": 0.7,
               "max_tokens": 1000
           }

           # Save request parameters
           output_dir = Path(__file__).parent / 'output'
           output_dir.mkdir(exist_ok=True)
           
           with open(output_dir / 'request.json', 'w') as f:
               json.dump({
                   'headers': headers,
                   'payload': payload
               }, f, indent=2)

           print("\n📝 Saved request parameters to output/request.json")

           # Make the POST request to OpenAI's chat completions endpoint
           print("\n🚀 Making request to OpenAI API...")
           response = requests.post(
               "https://api.openai.com/v1/chat/completions", 
               headers=headers, 
               json=payload
           )

           # Save the response
           with open(output_dir / 'response.json', 'w') as f:
               if response.status_code == 200:
                   json.dump(response.json(), f, indent=2)
               else:
                   json.dump({
                       'status_code': response.status_code,
                       'error': response.text
                   }, f, indent=2)

           # Check if the request was successful
           if response.status_code == 200:
               print("✅ API request successful!")
               print("\nResponse content:", response.json()['choices'][0]['message']['content'])
           else:
               print("❌ API request failed:")
               print(f"Status code: {response.status_code}")
               print(f"Error: {response.text}")
               
       except Exception as e:
           print("❌ Error:")
           print(f"Message: {str(e)}")

   if __name__ == "__main__":
       test_api_key()
   ```

   Save this as `scripts/test-openai.py` and run it to test your OpenAI API setup. It will:
   - Load environment variables from `.env.local`
   - Show debug information about your environment
   - Make a test request to OpenAI
   - Save request and response details to JSON files

## Recent Updates

### 1. Dynamic Content Generation
- Added intelligent video type detection
- Implemented 6 new post templates
- Added post length customization (brief/standard/detailed)

### 2. Error Handling Improvements
- Added React Error Boundaries
- Enhanced debugging tools for React components
- Improved error reporting and tracing

### 3. UI/UX Enhancements
- New template selection interface
- Dynamic length controls
- Improved personality trait sliders

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
