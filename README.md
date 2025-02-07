# Tube2Link: YouTube to LinkedIn Content Generator

A Next.js application that converts YouTube videos into engaging LinkedIn posts using AI-powered transcription and content generation.

## Current Features

- 🔐 Google OAuth Authentication
- 📺 YouTube Video Metadata Extraction
- ⌚ Duration Formatting
- 🖼️ Thumbnail Display
- 🎯 Modern, Responsive UI

## Upcoming Features

1. **Transcription & Processing**
   - Google Cloud Speech-to-Text integration
   - Audio extraction and processing
   - Multi-language support
   - Transcript segmentation

2. **Content Generation**
   - Key points extraction
   - Template-based post generation
   - Custom formatting options
   - Call-to-action generation

3. **N8N Integration**
   - Webhook setup for video processing
   - Template management system
   - Error handling and logging
   - LinkedIn API integration

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
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/callback

# Session
SESSION_SECRET=your_32_character_session_secret

# Google Cloud (Coming Soon)
GOOGLE_PROJECT_ID=your_project_id
STORAGE_BUCKET=your_bucket_name

# N8N (Coming Soon)
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

4. Run the development server
```bash
npm run dev
```

## Next Steps

### Phase 1: Transcription Setup
- [ ] Set up Google Cloud project
- [ ] Configure Speech-to-Text API
- [ ] Implement audio extraction and processing
- [ ] Add transcription progress tracking

### Phase 2: Content Generation
- [ ] Design LinkedIn post templates
- [ ] Implement key points extraction
- [ ] Add customization options for posts
- [ ] Create preview functionality

### Phase 3: N8N Integration
- [ ] Set up N8N instance
- [ ] Create workflow for video processing
- [ ] Implement template management
- [ ] Add LinkedIn API integration

### Phase 4: UI/UX Improvements
- [ ] Add progress indicators
- [ ] Implement error handling
- [ ] Add template selection interface
- [ ] Create post preview/edit interface

## Architecture

### Current Stack
- Next.js (Frontend & API)
- Iron Session (Authentication)
- YouTube Data API
- TailwindCSS (Styling)

### Upcoming Integrations
- Google Cloud Speech-to-Text
- N8N Workflow Engine
- LinkedIn API
- FFmpeg (Audio Processing)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
