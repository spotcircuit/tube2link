# Tube2Link: YouTube to LinkedIn Content Generator

A Next.js application that converts YouTube videos into engaging LinkedIn posts using AI-powered transcription and content generation.

## Current Development Status
**IMPORTANT: DO NOT MODIFY THE CONVERT ENDPOINT**
- ✅ Video metadata fetching and preview (working)
- ✅ OAuth authentication flow (working)
- ✅ Initial video loading and UI (working)
- ❌ Transcription generation (in progress)
  - Currently implementing Google Cloud Speech-to-Text fallback
  - Need to fix transcription file writing
  - Need to improve error handling

## Features

### 1. Two-Step Content Generation
- **Step 1: Video Details** (✅ Working)
  - Fetch video metadata (title, duration, thumbnail)
  - Quick preview before transcription
  - Validate video accessibility

- **Step 2: Transcription & Post Generation** (🚧 In Progress)
  - Automatic YouTube caption extraction
  - Fallback to Google Cloud Speech-to-Text
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
N8N_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_YT_API_KEY=your_youtube_api_key
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_CLIENT_EMAIL=your_client_email
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/callback
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_PRIVATE_KEY=your_private_key
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
- Stores tokens in secure cookies
- Redirects to main application

### 3. `/api/convert`
- **POST**: Process YouTube videos
- Parameters:
  - `videoUrl`: YouTube video URL
  - `getDetailsOnly`: Boolean to fetch only metadata
  - `useSpeechToText`: Boolean to enable Speech-to-Text fallback
- Returns: Video details, transcription, and LinkedIn post

## Tech Stack
- Next.js 13+ (App Router)
- Google Cloud APIs
  - YouTube Data API
  - Speech-to-Text API
  - OAuth 2.0
- TailwindCSS
- Axios

## Known Issues & TODO
**NOTE: The /api/convert endpoint is working correctly for video metadata. DO NOT MODIFY IT.**

Current focus is on transcription generation:
- [ ] Fix transcription error handling in frontend (page.tsx)
- [ ] Complete Speech-to-Text integration with Google Cloud
- [ ] Fix file writing for transcriptions
- [ ] Add proper error logging and monitoring
- [ ] Add retry mechanism for failed transcriptions
- [ ] Add progress indicator for Speech-to-Text processing

## License
MIT
