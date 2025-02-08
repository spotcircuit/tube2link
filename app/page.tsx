'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { RefreshCw } from 'react-feather';

interface VideoData {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      high?: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: 'none' | 'upcoming' | 'live';
    defaultLanguage?: string;
    localized?: {
      title: string;
      description: string;
    };
    defaultAudioLanguage?: string;
    // Shorts specific fields
    shorts?: {
      isShort: boolean;
    };
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    projection: string;
    contentRating?: {
      ytRating?: string;
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
    favoriteCount: string;
  };
  transcription?: string;
}

interface GeneratedContent {
  summary: string;
  template: string;
  segmented: string;
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

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [useSpeechToText, setUseSpeechToText] = useState(false);
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

  useEffect(() => {
    const savedUrl = localStorage.getItem('lastVideoUrl');
    if (savedUrl) {
      setUrl(savedUrl);
      localStorage.removeItem('lastVideoUrl');
      
      const params = new URLSearchParams(window.location.search);
      if (params.get('code')) {
        handleSubmit(null, savedUrl);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent | null, savedUrl?: string) => {
    if (e) e.preventDefault();
    
    const videoUrl = savedUrl || url;
    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await axios.post('/api/convert', { videoUrl });
      
      // Check if we need OAuth
      if (response.data.needsAuth) {
        localStorage.setItem('lastVideoUrl', videoUrl);
        window.location.href = response.data.authUrl;
        return;
      }

      // Update to match API response format
      setVideoData({
        id: response.data.id,
        snippet: response.data.snippet,
        contentDetails: response.data.contentDetails,
        statistics: response.data.statistics,
        transcription: response.data.transcription
      });
    } catch (error: any) {
      if (error.response?.data?.needsAuth) {
        localStorage.setItem('lastVideoUrl', videoUrl);
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleGenerateContent = async (type: keyof GeneratedContent) => {
    try {
      const response = await axios.post('/api/generate-content', { type, transcription: videoData?.transcription });
      setGeneratedContent(response.data);
    } catch (error: any) {
      console.error('Failed to generate content:', error);
    }
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
        forceTranscribe: true,
        useSpeechToText
      });
      
      if (response.data.transcription) {
        setVideoData(prev => ({
          ...prev,
          transcription: response.data.transcription
        }));
        setTranscriptionStatus('success');
      } else {
        setError('No transcription received. Please try again.');
        setTranscriptionStatus('error');
      }
    } catch (error: any) {
      let errorMessage = error.response?.data?.error || 'Failed to transcribe video. Please try again.';
      if (error.response?.data?.needsSpeechToText) {
        errorMessage = error.response?.data?.details;
        setUseSpeechToText(true); // Auto-enable Speech-to-Text
      }
      setError(errorMessage);
      setTranscriptionStatus('error');
      console.error('Transcription error:', {
        error: error.response?.data || error,
        status: error.response?.status,
        details: error.response?.data?.details
      });
    }
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
                  onClick={async () => {
                    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
                    if (!videoId) {
                      setError('Invalid YouTube URL');
                      return;
                    }
                    
                    try {
                      const response = await axios.post('/api/load-transcription', { videoId });
                      if (response.data.success) {
                        setVideoData({
                          id: videoId,
                          snippet: {
                            title: 'Loaded from file',
                            thumbnails: {
                              maxres: {
                                url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                                width: 1280,
                                height: 720
                              }
                            }
                          },
                          contentDetails: {
                            duration: 'N/A',
                            dimension: '2d',
                            definition: 'hd',
                            caption: 'true',
                            licensedContent: false,
                            projection: 'rectangular'
                          },
                          statistics: {
                            viewCount: '0',
                            likeCount: '0',
                            commentCount: '0',
                            favoriteCount: '0'
                          },
                          transcription: response.data.transcription
                        });
                      }
                    } catch (error: any) {
                      if (error.response?.data?.needsTranscription) {
                        // If no transcription exists, proceed with normal conversion
                        handleSubmit(null);
                      } else {
                        setError('Failed to load transcription');
                      }
                    }
                  }}
                  type="button"
                  className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg transition-colors text-white text-sm"
                >
                  Load Existing
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Converting...
                    </div>
                  ) : (
                    'Convert New'
                  )}
                </button>
              </div>
            </div>
          </form>

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
                      src={videoData.snippet.thumbnails.maxres?.url || 
                           videoData.snippet.thumbnails.high?.url || 
                           videoData.snippet.thumbnails.medium?.url || 
                           `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`}
                      alt={videoData.snippet.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  
                  {/* Snippet Information */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-white">Video Info</h4>
                    <p className="text-white font-medium text-lg">{videoData.snippet.title}</p>
                    {videoData.snippet.localized && videoData.snippet.localized.title !== videoData.snippet.title && (
                      <p className="text-purple-300">Localized Title: {videoData.snippet.localized.title}</p>
                    )}
                    
                    <div className="bg-white/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Channel:</span>
                        <span className="text-white">{videoData.snippet.channelTitle}</span>
                        <span className="text-purple-400 text-sm">({videoData.snippet.channelId})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Published:</span>
                        <span className="text-white">{new Date(videoData.snippet.publishedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Language:</span>
                        <span className="text-white">{videoData.snippet.defaultLanguage || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Audio:</span>
                        <span className="text-white">{videoData.snippet.defaultAudioLanguage || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-300 block">Status:</span>
                        <span className={`font-medium ${
                          videoData.snippet.liveBroadcastContent === 'live' 
                            ? 'text-red-400' 
                            : videoData.snippet.liveBroadcastContent === 'upcoming'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          {videoData.snippet.liveBroadcastContent.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h5 className="text-lg font-medium text-white mb-3">Description</h5>
                      {videoData.snippet.description ? (
                        <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                          <p className="text-white text-sm whitespace-pre-wrap">
                            {videoData.snippet.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-yellow-400 text-sm italic">No description available</p>
                      )}
                    </div>

                    {videoData.snippet.tags && videoData.snippet.tags.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-lg font-medium text-white mb-3">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {videoData.snippet.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-white text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="mt-8 space-y-3">
                    <h4 className="text-xl font-semibold text-white">Content Details</h4>
                    <div className="bg-white/10 rounded-lg p-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-purple-300 block">Duration</span>
                        <span className="text-white">{formatDuration(videoData.contentDetails.duration)}</span>
                      </div>
                      <div>
                        <span className="text-purple-300 block">Quality</span>
                        <span className="text-white">{videoData.contentDetails.definition.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-purple-300 block">Dimension</span>
                        <span className="text-white">{videoData.contentDetails.dimension}</span>
                      </div>
                      <div>
                        <span className="text-purple-300 block">Captions</span>
                        <span className={videoData.contentDetails.caption === 'true' ? 'text-green-400' : 'text-yellow-400'}>
                          {videoData.contentDetails.caption === 'true' ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-300 block">Projection</span>
                        <span className="text-white">{videoData.contentDetails.projection}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="mt-8 space-y-3">
                    <h4 className="text-xl font-semibold text-white">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-purple-300 text-sm">Views</p>
                        <p className="text-2xl font-bold text-white">{parseInt(videoData.statistics.viewCount).toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-purple-300 text-sm">Likes</p>
                        <p className="text-2xl font-bold text-white">{parseInt(videoData.statistics.likeCount).toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-purple-300 text-sm">Comments</p>
                        <p className="text-2xl font-bold text-white">{parseInt(videoData.statistics.commentCount).toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg">
                        <p className="text-purple-300 text-sm">Favorites</p>
                        <p className="text-2xl font-bold text-white">{parseInt(videoData.statistics.favoriteCount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transcription Section */}
                {!videoData.transcription ? (
                  <div className="mt-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        id="useSpeechToText"
                        checked={useSpeechToText}
                        onChange={(e) => setUseSpeechToText(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                      />
                      <label htmlFor="useSpeechToText" className="text-sm text-gray-300">
                        Use Speech-to-Text if captions are not available
                      </label>
                    </div>
                    <button 
                      onClick={handleTranscribe} 
                      disabled={transcriptionStatus === 'loading'}
                      className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${transcriptionStatus === 'loading' ? 'opacity-75' : ''}`}
                    >
                      {transcriptionStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {useSpeechToText ? 'Converting Speech to Text...' : 'Loading Captions...'}
                        </>
                      ) : 'Transcribe Video'}
                    </button>
                    {error && (
                      <div className="mt-4 text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-xl font-semibold text-white mb-4">Transcription</h3>
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {videoData.transcription}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {videoData.transcription && (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-4">Generate Content</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleGenerateContent('summary')}
                        className="p-4 bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg border border-white/10 transition-all transform hover:scale-105"
                      >
                        <h4 className="text-lg font-semibold text-white mb-2">Summarization & Highlights</h4>
                        <p className="text-sm text-gray-300">Extract key insights and generate a concise, engaging summary</p>
                      </button>

                      <button
                        onClick={() => handleGenerateContent('template')}
                        className="p-4 bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg border border-white/10 transition-all transform hover:scale-105"
                      >
                        <h4 className="text-lg font-semibold text-white mb-2">Template-Based Content</h4>
                        <p className="text-sm text-gray-300">Use industry-specific templates for professional formatting</p>
                      </button>

                      <button
                        onClick={() => handleGenerateContent('segmented')}
                        className="p-4 bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg border border-white/10 transition-all transform hover:scale-105"
                      >
                        <h4 className="text-lg font-semibold text-white mb-2">Segmented Strategy</h4>
                        <p className="text-sm text-gray-300">Process content in meaningful segments with context-specific commentary</p>
                      </button>
                    </div>
                  </div>

                  {generatedContent && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Generated Content</h3>
                        <button
                          onClick={() => handleCopy(generatedContent.summary)}
                          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg transition-colors text-white text-sm"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm bg-black/20 rounded-lg p-4">
                        {generatedContent.summary}
                      </pre>
                    </div>
                  )}
                </div>
              )}
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
