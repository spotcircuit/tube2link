'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { RefreshCw } from 'react-feather';
import Link from 'next/link';

interface VideoData {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  tags?: string[];
  transcription?: string | null;
}

// Convert ISO 8601 duration to readable format
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const [_, hours, minutes, seconds] = match;
  const h = parseInt(hours || '0');
  const m = parseInt(minutes || '0');
  const s = parseInt(seconds || '0');

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  } else {
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
};

const PROMPT_TEMPLATES = {
  summary: `
Create a LinkedIn post based on the video "{title}" by {channel}. The video is about {description}. The main topics covered are {tags}. The video's transcription is: {transcription}. The video ID is {videoId}.

Write a concise summary of the video in 2-3 paragraphs, focusing on the key points and takeaways. Use a professional tone and avoid any promotional language.
`,
  story: `
Create a LinkedIn post based on the video "{title}" by {channel}. The video is about {description}. The main topics covered are {tags}. The video's transcription is: {transcription}. The video ID is {videoId}.

Write a narrative-driven post that tells a story related to the video's content. Use a conversational tone and include personal anecdotes or examples that illustrate the key points.
`,
  value: `
Create a LinkedIn post based on the video "{title}" by {channel}. The video is about {description}. The main topics covered are {tags}. The video's transcription is: {transcription}. The video ID is {videoId}.

Write a post that focuses on the practical benefits and value that viewers can gain from watching the video. Use a clear and concise tone and include specific examples or tips that viewers can apply to their own work or lives.
`,
  question: `
Create a LinkedIn post based on the video "{title}" by {channel}. The video is about {description}. The main topics covered are {tags}. The video's transcription is: {transcription}. The video ID is {videoId}.

Write a post that asks a thought-provoking question related to the video's content. Use a curious tone and encourage viewers to share their thoughts and opinions in the comments.
`,
  action: `
Create a LinkedIn post based on the video "{title}" by {channel}. The video is about {description}. The main topics covered are {tags}. The video's transcription is: {transcription}. The video ID is {videoId}.

Write a post that encourages viewers to take action based on the video's content. Use a motivational tone and include a clear call-to-action that viewers can follow.
`,
};

const LENGTH_SETTINGS = {
  brief: {
    label: "Brief",
    icon: "📝",
    description: "Quick, punchy post",
    charRange: "300-500 characters",
    bestFor: "Quick insights, busy feeds",
    example: "🎯 Key takeaway from [Video]\n\n💡 Main insight explained in 1-2 sentences\n\n🔗 Watch more: [link]"
  },
  standard: {
    label: "Standard",
    icon: "📄",
    description: "Balanced length",
    charRange: "800-1200 characters",
    bestFor: "Most content types",
    example: "🎯 Main topic from [Video]\n\n💡 Key point 1\n💡 Key point 2\n\n🤔 Why this matters...\n\n🔗 Full video: [link]"
  },
  detailed: {
    label: "Detailed",
    icon: "📚",
    description: "In-depth coverage",
    charRange: "1500-2000 characters",
    bestFor: "Complex topics, deep dives",
    example: "🎯 Comprehensive look at [Topic]\n\n💡 Background\n💡 Key points (3-4)\n💡 Analysis\n\n🤔 Implications\n\n🔗 Watch here: [link]"
  }
} as const;

const getToneLabel = (value: number) => {
  if (value <= 33) return 'Conversational';
  if (value <= 66) return 'Balanced';
  return 'Formal';
};

const getTemplateGuide = (template: string, length: 'brief' | 'standard' | 'detailed') => {
  const guides = {
    summary: {
      brief: "Create a quick overview focusing only on the 2-3 most important points. Be direct and concise.",
      standard: "Provide a balanced summary with key points and brief context. Include supporting details where valuable.",
      detailed: "Create an extended summary that thoroughly explains each key point. Include background context, examples, and implications."
    },
    story: {
      brief: "Tell a focused micro-story highlighting one key moment or insight.",
      standard: "Develop a narrative with clear beginning, middle, and end. Balance story elements with key takeaways.",
      detailed: "Create a rich narrative with character development, detailed scenes, and multiple learning points woven throughout."
    },
    value: {
      brief: "Focus on one primary benefit or takeaway that provides immediate value.",
      standard: "Present 2-3 key benefits with practical applications and examples.",
      detailed: "Deep dive into multiple benefits, including implementation details, case examples, and long-term implications."
    },
    question: {
      brief: "Pose one thought-provoking question with minimal context to spark discussion.",
      standard: "Present a main question with 2-3 follow-up points to guide the discussion.",
      detailed: "Explore a complex question from multiple angles, with supporting questions and discussion prompts throughout."
    },
    action: {
      brief: "Single, clear call-to-action with immediate next step.",
      standard: "Main call-to-action with 2-3 supporting steps or reasons.",
      detailed: "Comprehensive action plan with preparation steps, implementation guide, and expected outcomes."
    }
  };

  return guides[template as keyof typeof guides][length];
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'summary' | 'story' | 'value' | 'question' | 'action'>('summary');
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [postSettings, setPostSettings] = useState({
    tone: 50,
    length: 'standard' as 'brief' | 'standard' | 'detailed',
    personality: {
      charm: 0,
      wit: 0,
      humor: 0,
      sarcasm: 0
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth');
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.data?.authUrl) {
          window.location.href = error.response.data.authUrl;
        }
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent | null, savedUrl?: string) => {
    if (e) e.preventDefault();
    
    const videoUrl = savedUrl || url;
    if (!videoUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      // Normalize URL to handle various YouTube URL formats
      let normalizedUrl = videoUrl;
      if (!videoUrl.startsWith('http')) {
        // If it's just a video ID, convert it to a full URL
        normalizedUrl = `https://www.youtube.com/watch?v=${videoUrl}`;
      }

      const response = await axios.post('/api/convert', { videoUrl: normalizedUrl });
      
      // Check if we need OAuth
      if (response.data.needsAuth) {
        window.location.href = response.data.authUrl;
        return;
      }

      // Update to match API response format
      setVideoData({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        channelTitle: response.data.channelTitle,
        thumbnails: response.data.thumbnails,
        tags: response.data.tags,
        transcription: response.data.transcription
      });
    } catch (error: any) {
      if (error.response?.data?.needsAuth) {
        window.location.href = error.response.data.authUrl;
        return;
      }

      const errorMessage = error.response?.data?.error || 'Failed to process video';
      const errorDetails = error.response?.data?.details || error.message;
      setError(`${errorMessage}\n\nDetails: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleTranscribe = async () => {
    if (!videoData) return;
    
    try {
      setTranscriptionStatus('loading');
      setError('');
      
      // Use the video ID from videoData
      const videoUrl = `https://www.youtube.com/watch?v=${videoData.id}`;
      console.log('Transcribing video:', videoUrl);
      
      const response = await axios.post('/api/convert', { 
        videoUrl,
        forceTranscribe: true
      });
      
      if (response.data.transcription) {
        setVideoData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            transcription: response.data.transcription
          };
        });
        setTranscriptionStatus('success');
      } else if (response.data.error) {
        setError(response.data.error);
        setTranscriptionStatus('error');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to transcribe video');
      setTranscriptionStatus('error');
    }
  };

  const getToneHint = (tone: number) => {
    if (tone <= 33) {
      return {
        message: "💡 Conversational posts work well with higher charm and humor",
        suggestions: {
          charm: "Try 60-80%",
          humor: "Try 50-70%",
          wit: "Try 40-60%",
          sarcasm: "Keep under 40%"
        }
      };
    }
    if (tone <= 66) {
      return {
        message: "💡 Balanced tone works best with moderate personality traits",
        suggestions: {
          charm: "Try 40-60%",
          humor: "Try 30-50%",
          wit: "Try 30-50%",
          sarcasm: "Keep under 30%"
        }
      };
    }
    return {
      message: "💡 Formal tone typically uses minimal personality traits",
      suggestions: {
        charm: "Try 20-40%",
        humor: "Keep under 30%",
        wit: "Try 20-40%",
        sarcasm: "Best at 0%"
      }
    };
  };

  const handleShowPrompt = () => {
    const prompt = generatePrompt();
    if (prompt) {
      setCurrentPrompt(prompt);
      setShowPrompt(true);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setGenerating(true);
      setError('');
      
      console.log('Sending request with:', {
        videoData,
        mode: selectedTemplate,
        settings: postSettings
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData,
          mode: selectedTemplate,
          settings: postSettings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setShowPrompt(false);
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const generatePrompt = () => {
    if (!videoData) return null;

    const templateGuide = getTemplateGuide(selectedTemplate, postSettings.length);

    const basePrompt = PROMPT_TEMPLATES[selectedTemplate]
      .replace('{title}', videoData.title)
      .replace('{channel}', videoData.channelTitle)
      .replace('{description}', videoData.description || 'No description available')
      .replace('{tags}', videoData.tags?.join(', ') || 'No tags')
      .replace('{transcription}', videoData.transcription || 'No transcription available')
      .replace('{videoId}', videoData.id);

    const contentGuide = `
Content Strategy:
${templateGuide}`;

    const lengthGuide = `
Post Length: ${LENGTH_SETTINGS[postSettings.length].label}
Target Length: ${LENGTH_SETTINGS[postSettings.length].charRange}
Style: ${LENGTH_SETTINGS[postSettings.length].description}`;

    const toneGuide = `
Tone Setting: ${getToneLabel(postSettings.tone)} (${postSettings.tone}%)
- Conversational (0-33%): Friendly, approachable, like talking to a friend
- Balanced (34-66%): Mix of formal and casual, like a friendly colleague
- Formal (67-100%): Professional, structured, business-appropriate`;

    const personalityGuide = `
Personality Settings:
- Charm: ${postSettings.personality.charm}% (Add warmth and appeal to the writing)
- Wit: ${postSettings.personality.wit}% (Include clever observations and insights)
- Humor: ${postSettings.personality.humor}% (Add light, fun elements where appropriate)
- Sarcasm: ${postSettings.personality.sarcasm}% (Include subtle irony if it fits)

Adjust the writing style based on these personality levels while maintaining the selected tone.`;

    return basePrompt + '\n\n' + contentGuide + '\n\n' + lengthGuide + '\n\n' + toneGuide + '\n\n' + personalityGuide;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="flex flex-row items-center gap-32 pl-4 -mt-8">
          <div className="relative w-[32rem] h-[32rem] transform hover:scale-105 transition-transform duration-300 perspective-1000 drop-shadow-2xl flex-shrink-0">
            <Image
              src="/images/tube2linkedin.png"
              alt="Tube2Link Logo"
              layout="fill"
              className="rounded-2xl [filter:invert(1)_hue-rotate(180deg)] object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 max-w-xl ml-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Tube2Link
            </h1>
            <p className="text-white text-2xl md:text-3xl font-medium break-words">
              Transform your YouTube videos into engaging LinkedIn posts with just one click
            </p>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        {!videoData && (
          <div className="w-full max-w-6xl mx-auto -mt-24 px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered',
                  description: 'Advanced AI algorithms transform your video content into professional LinkedIn posts',
                  icon: '🤖'
                },
                {
                  title: 'Time-Saving',
                  description: 'Convert videos to posts in minutes, not hours',
                  icon: '⚡'
                },
                {
                  title: 'Professional',
                  description: 'Get polished, engagement-ready content for your LinkedIn audience',
                  icon: '✨'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-24"></div>
          </div>
        )}

        <div className="w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          {!videoData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your YouTube video URL here"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <div className="mt-4 md:mt-0 md:absolute md:right-2 md:top-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Converting...
                      </div>
                    ) : (
                      'Convert'
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : null}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <pre className="text-red-200 whitespace-pre-wrap font-mono text-sm">
                {error}
              </pre>
            </div>
          )}

          {videoData && (
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Video Details Column */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Video Details</h3>
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                    <Image
                      src={videoData.thumbnails.maxres?.url || 
                           videoData.thumbnails.high?.url || 
                           videoData.thumbnails.medium?.url || 
                           `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`}
                      alt={videoData.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  
                  {/* Snippet Information */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-white">Video Info</h4>
                    <p className="text-white font-medium text-lg">{videoData.title}</p>
                    
                    <div className="bg-white/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Channel:</span>
                        <span className="text-white">{videoData.channelTitle}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Description:</span>
                        <span className="text-white">{videoData.description}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h5 className="text-lg font-medium text-white mb-3">Tags</h5>
                      {videoData.tags && videoData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {videoData.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-white text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Transcription */}
                    <div className="mt-8 space-y-3">
                      <h4 className="text-xl font-semibold text-white">Transcription</h4>
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {videoData.transcription}
                      </pre>
                    </div>
                  </div>

                  {/* Generate LinkedIn Post Section */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Generate LinkedIn Post</h3>
                    
                    {!showTemplateOptions ? (
                      <button 
                        onClick={() => setShowTemplateOptions(true)}
                        className="block w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg text-center hover:opacity-90 transition-opacity"
                      >
                        Generate LinkedIn Post
                      </button>
                    ) : (
                      <div className="space-y-8">
                        {/* Template Selection */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Choose Template</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              {
                                type: 'summary',
                                title: 'Summary',
                                description: 'Concise overview with key insights',
                                icon: '📝'
                              },
                              {
                                type: 'story',
                                title: 'Story-Based',
                                description: 'Narrative-driven content',
                                icon: '📖'
                              },
                              {
                                type: 'value',
                                title: 'Value-First',
                                description: 'Focus on practical benefits',
                                icon: '💎'
                              },
                              {
                                type: 'question',
                                title: 'Question-Based',
                                description: 'Drive engagement & discussion',
                                icon: '💭'
                              },
                              {
                                type: 'action',
                                title: 'Call-to-Action',
                                description: 'Guide readers to take action',
                                icon: '🎯'
                              }
                            ].map((template) => (
                              <button
                                key={template.type}
                                onClick={() => setSelectedTemplate(template.type as typeof selectedTemplate)}
                                className={`p-4 ${
                                  selectedTemplate === template.type
                                    ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                                    : 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40'
                                } rounded-lg border border-white/10 transition-all transform hover:scale-105`}
                              >
                                <div className="text-3xl mb-2">{template.icon}</div>
                                <h4 className="text-lg font-semibold text-white mb-2">{template.title}</h4>
                                <p className="text-sm text-gray-300">{template.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Length Selection */}
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-white mb-4">Post Length</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.keys(LENGTH_SETTINGS) as Array<keyof typeof LENGTH_SETTINGS>).map((length) => (
                              <button
                                key={length}
                                onClick={() => setPostSettings(prev => ({ ...prev, length }))}
                                className={`p-4 ${
                                  postSettings.length === length
                                    ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                                    : 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40'
                                } rounded-lg border border-white/10 transition-all`}
                              >
                                <div className="text-3xl mb-2">{LENGTH_SETTINGS[length].icon}</div>
                                <h4 className="text-lg font-semibold text-white mb-1">{LENGTH_SETTINGS[length].label}</h4>
                                <p className="text-sm text-gray-300 mb-2">{LENGTH_SETTINGS[length].description}</p>
                                <p className="text-xs text-gray-400 mb-1">{LENGTH_SETTINGS[length].charRange}</p>
                                <p className="text-xs text-blue-400">Best for: {LENGTH_SETTINGS[length].bestFor}</p>
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-white mb-2">Example Structure:</p>
                            <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                              {LENGTH_SETTINGS[postSettings.length].example}
                            </pre>
                          </div>
                        </div>

                        {/* Tone Slider */}
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-white mb-4">Tone</h4>
                          <div className="space-y-4">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={postSettings.tone}
                                onChange={(e) => setPostSettings(prev => ({
                                  ...prev,
                                  tone: parseInt(e.target.value)
                                }))}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-400 mt-2">
                                <span>Conversational</span>
                                <span>Balanced</span>
                                <span>Formal</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-white">
                              <div>
                                <p className="font-medium">Current: {getToneLabel(postSettings.tone)}</p>
                                <p className="text-sm text-gray-400">
                                  {postSettings.tone <= 33 && "Friendly and approachable, like talking to a friend"}
                                  {postSettings.tone > 33 && postSettings.tone <= 66 && "Mix of formal and casual, like a friendly colleague"}
                                  {postSettings.tone > 66 && "Professional and structured, business-appropriate"}
                                </p>
                                <p className="text-sm text-blue-400 mt-2">
                                  {getToneHint(postSettings.tone).message}
                                </p>
                              </div>
                              <span>{postSettings.tone}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Personality Sliders */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">Personality</h4>
                          <div className="space-y-4">
                            {[
                              { key: 'charm', label: '✨ Charm', description: 'Warmth and appeal' },
                              { key: 'wit', label: '💭 Wit', description: 'Clever observations' },
                              { key: 'humor', label: '😊 Humor', description: 'Fun and light' },
                              { key: 'sarcasm', label: '😏 Sarcasm', description: 'Ironic edge' }
                            ].map((trait) => (
                              <div key={trait.key} className="space-y-2">
                                <div className="flex justify-between text-white">
                                  <div>
                                    <label>{trait.label}</label>
                                    <p className="text-sm text-gray-400">{trait.description}</p>
                                    <p className="text-xs text-blue-400">
                                      {getToneHint(postSettings.tone).suggestions[trait.key as keyof typeof postSettings.personality]}
                                    </p>
                                  </div>
                                  <span>{postSettings.personality[trait.key as keyof typeof postSettings.personality]}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={postSettings.personality[trait.key as keyof typeof postSettings.personality]}
                                  onChange={(e) => setPostSettings(prev => ({
                                    ...prev,
                                    personality: {
                                      ...prev.personality,
                                      [trait.key]: parseInt(e.target.value)
                                    }
                                  }))}
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Preview and Generate Buttons */}
                        <div className="space-y-4">
                          <button
                            onClick={handleShowPrompt}
                            className="w-full py-3 bg-gray-600 text-white rounded-xl font-semibold text-lg text-center hover:bg-gray-500 transition-colors"
                          >
                            Preview Prompt
                          </button>
                          
                          <button
                            onClick={handleGenerateContent}
                            disabled={generating}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg text-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {generating ? (
                              <div className="flex items-center justify-center">
                                <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                Generating...
                              </div>
                            ) : (
                              'Generate Post'
                            )}
                          </button>
                        </div>

                        {/* Prompt Preview Modal */}
                        {showPrompt && currentPrompt && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                            <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                              <h3 className="text-xl font-semibold text-white mb-4">Generated Prompt</h3>
                              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm bg-black/20 rounded-lg p-4">
                                {currentPrompt}
                              </pre>
                              <div className="flex justify-end gap-4 mt-6">
                                <button
                                  onClick={() => setShowPrompt(false)}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={handleGenerateContent}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                  Generate with this Prompt
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Generated Content */}
                        {generatedContent && (
                          <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold text-white">Generated Post</h4>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedContent);
                                  // Show temporary "Copied!" message
                                  const button = event?.target as HTMLButtonElement;
                                  const originalText = button.textContent;
                                  button.textContent = 'Copied!';
                                  setTimeout(() => {
                                    button.textContent = originalText;
                                  }, 2000);
                                }}
                                className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg transition-colors text-white text-sm"
                              >
                                Copy
                              </button>
                            </div>
                            <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm bg-black/20 rounded-lg p-4">
                              {generatedContent}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-16 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Tube2Link. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
