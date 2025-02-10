'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ProcessingStatus } from './components/ProcessingStatus';
import { toast } from 'react-hot-toast';
import { VIDEO_CONTEXTS } from '@/lib/video_context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugRender } from './components/DebugRender';
import { VideoData } from '@/types/video';

interface PostSettings {
  tone: number;
  length: 'brief' | 'standard' | 'detailed';
  personality: {
    charm: number;
    wit: number;
    humor: number;
    sarcasm: number;
  };
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

const POST_TEMPLATES = {
  question: {
    name: 'Question-Based',
    description: 'Thought-provoking questions that encourage engagement',
    structure: `
1. Open with an intriguing industry question
2. Share context from your experience
3. Present the video's perspective
4. Highlight key supporting evidence
5. Invite thoughtful responses`
  },
  story: {
    name: 'Story-Based',
    description: 'Narrative that draws readers in and makes content relatable',
    structure: `
1. Start with a relatable situation
2. Share the learning journey
3. Present key discoveries
4. Connect to broader principles
5. End with earned wisdom`
  },
  action: {
    name: 'Action-Oriented',
    description: 'Actionable takeaways that motivate readers',
    structure: `
1. State the goal clearly
2. Explain why it matters now
3. Present concrete steps
4. Share a practical example
5. Call to action`
  },
  insight: {
    name: 'Insight-Based',
    description: 'Data-driven insights that reveal deeper understanding',
    structure: `
1. Lead with surprising data
2. Explain the significance
3. Reveal deeper understanding
4. Support with evidence
5. Challenge assumptions`
  },
  problem_solution: {
    name: 'Problem-Solution',
    description: 'Clear solutions to common challenges',
    structure: `
1. Identify the pain point clearly
2. Explain its impact
3. Present the solution approach
4. Share implementation details
5. Highlight the benefits`
  },
  comparison: {
    name: 'Comparison',
    description: 'Balanced analysis of different approaches',
    structure: `
1. Introduce the approaches
2. Compare key aspects
3. Highlight innovations
4. Present evidence
5. Guide decision making`
  }
} as const;

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

const getToneHint = (tone: number): { label: string, suggestions: Record<string, string> } => {
  if (tone <= 33) {
    return {
      label: 'Casual',
      suggestions: {
        charm: 'Keep it friendly and approachable',
        wit: 'Use clever but relatable observations',
        humor: 'Light, fun touches welcome',
        sarcasm: 'Playful but not too sharp'
      }
    };
  }
  if (tone <= 66) {
    return {
      label: 'Balanced',
      suggestions: {
        charm: 'Professional yet engaging',
        wit: 'Smart insights, clearly explained',
        humor: 'Subtle, appropriate touches',
        sarcasm: 'Very light if at all'
      }
    };
  }
  return {
    label: 'Formal',
    suggestions: {
      charm: 'Polished and professional',
      wit: 'Insightful but straightforward',
      humor: 'Minimal, if any',
      sarcasm: 'Best avoided'
    }
  };
};

const getTemplateGuide = (template: string, length: 'brief' | 'standard' | 'detailed') => {
  console.debug('getTemplateGuide called with:', { template, length });
  const guides = {
    question: {
      brief: "150-200 words. Create a thought-provoking question with minimal context to spark discussion.",
      standard: "200-300 words. Present a main question with 2-3 follow-up points to guide the discussion.",
      detailed: "300-500 words. Explore a complex question from multiple angles, with supporting questions and discussion prompts throughout."
    },
    story: {
      brief: "150-200 words. Tell a focused micro-story highlighting one key moment or insight.",
      standard: "200-300 words. Develop a narrative with clear beginning, middle, and end. Balance story elements with key takeaways.",
      detailed: "300-500 words. Create a rich narrative with character development, detailed scenes, and multiple learning points woven throughout."
    },
    action: {
      brief: "150-200 words. Single, clear call-to-action with immediate next step.",
      standard: "200-300 words. Main call-to-action with 2-3 supporting steps or reasons.",
      detailed: "300-500 words. Comprehensive action plan with preparation steps, implementation guide, and expected outcomes."
    },
    insight: {
      brief: "150-200 words. Lead with surprising data and explain its significance.",
      standard: "200-300 words. Present key discoveries and support with evidence.",
      detailed: "300-500 words. Reveal deeper understanding and challenge assumptions."
    },
    problem_solution: {
      brief: "150-200 words. Identify the pain point clearly and present the solution approach.",
      standard: "200-300 words. Explain the impact and share implementation details.",
      detailed: "300-500 words. Highlight the benefits and provide a clear call-to-action."
    },
    comparison: {
      brief: "150-200 words. Introduce the approaches and compare key aspects.",
      standard: "200-300 words. Highlight innovations and present evidence.",
      detailed: "300-500 words. Guide decision making with a balanced analysis."
    }
  };

  const guide = guides[template as keyof typeof guides]?.[length];
  if (!guide) {
    console.error('Invalid template or length:', { template, length });
    return 'Guide not found';
  }
  return guide;
};

const templateOptions = Object.entries(POST_TEMPLATES).map(([id, template]) => ({
  id: id as keyof typeof POST_TEMPLATES,
  name: template.name,
  description: template.description
}));

interface KeyActionsSectionProps {
  actions: Array<{ content: string; importance: number }>;
  onUseInPost?: (action: { content: string; importance: number }) => void;
  onHighlight?: (action: { content: string; importance: number }) => void;
}

function KeyActionsSection({ actions, onUseInPost, onHighlight }: KeyActionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Group actions by importance
  const groupedActions = actions.reduce((acc, action) => {
    const importance = action.importance;
    if (importance >= 0.8) acc.high.push(action);
    else if (importance >= 0.5) acc.medium.push(action);
    else acc.low.push(action);
    return acc;
  }, { high: [], medium: [], low: [] } as { high: typeof actions, medium: typeof actions, low: typeof actions });

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
      >
        <span>🎯 Key Actions</span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          {groupedActions.high.length > 0 && (
            <div>
              <h5 className="text-red-400 font-medium mb-2">🔥 High Priority</h5>
              {groupedActions.high.map((action, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 group">
                  <p className="text-gray-300 flex-grow">{action.content}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onUseInPost?.(action)}
                      className="text-xs bg-purple-900/50 hover:bg-purple-900 px-2 py-1 rounded mr-1"
                    >
                      Use in Post
                    </button>
                    <button 
                      onClick={() => onHighlight?.(action)}
                      className="text-xs bg-yellow-900/50 hover:bg-yellow-900 px-2 py-1 rounded"
                    >
                      Highlight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {groupedActions.medium.length > 0 && (
            <div>
              <h5 className="text-orange-400 font-medium mb-2">⚡ Medium Priority</h5>
              {groupedActions.medium.map((action, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 group">
                  <p className="text-gray-300 flex-grow">{action.content}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onUseInPost?.(action)}
                      className="text-xs bg-purple-900/50 hover:bg-purple-900 px-2 py-1 rounded mr-1"
                    >
                      Use in Post
                    </button>
                    <button 
                      onClick={() => onHighlight?.(action)}
                      className="text-xs bg-yellow-900/50 hover:bg-yellow-900 px-2 py-1 rounded"
                    >
                      Highlight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {groupedActions.low.length > 0 && (
            <div>
              <h5 className="text-blue-400 font-medium mb-2">📝 Other Actions</h5>
              {groupedActions.low.map((action, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 group">
                  <p className="text-gray-300 flex-grow">{action.content}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onUseInPost?.(action)}
                      className="text-xs bg-purple-900/50 hover:bg-purple-900 px-2 py-1 rounded mr-1"
                    >
                      Use in Post
                    </button>
                    <button 
                      onClick={() => onHighlight?.(action)}
                      className="text-xs bg-yellow-900/50 hover:bg-yellow-900 px-2 py-1 rounded"
                    >
                      Highlight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [generating, setGenerating] = useState(false);
  const [processId, setProcessId] = useState<string>();
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [preprocessedData, setPreprocessedData] = useState<any>(null);
  const [quickSummary, setQuickSummary] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof POST_TEMPLATES>('question');
  const [writingStyle, setWritingStyle] = useState<'casual' | 'balanced' | 'formal'>('balanced');
  const [postSettings, setPostSettings] = useState<PostSettings>({
    tone: 50,
    length: 'standard',
    personality: {
      charm: 0,
      wit: 0,
      humor: 0,
      sarcasm: 0
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);
  const [quickSummaryExpanded, setQuickSummaryExpanded] = useState(true);
  const [detailedAnalysisExpanded, setDetailedAnalysisExpanded] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Check authentication on mount
  useEffect(() => {
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
    
    const urlToProcess = savedUrl || videoUrl;
    if (!urlToProcess) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      // Normalize URL to handle various YouTube URL formats
      let normalizedUrl = urlToProcess;
      if (!urlToProcess.startsWith('http')) {
        // If it's just a video ID, convert it to a full URL
        normalizedUrl = `https://www.youtube.com/watch?v=${urlToProcess}`;
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
        transcription: response.data.transcription,
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
        setVideoData((prev: VideoData | null) => {
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

  const handlePreprocess = async () => {
    try {
      setGenerating(true);
      setError('');
      
      // Generate a unique process ID
      const processId = crypto.randomUUID();
      
      console.log('Preprocessing video data:', {
        videoData,
        processId
      });

      const response = await fetch('/api/preprocess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData,
          processId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to preprocess content');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Store preprocessed data and analysis
      setVideoData(prevVideoData => {
        console.log('Previous Video Data:', prevVideoData);
        if (!prevVideoData) return null;
        const newData = {
          ...prevVideoData,
          preprocessed: data.preprocessed,
          summary: data.summary,
          detailedAnalysis: data.detailedAnalysis
        };
        console.log('New Video Data:', newData);
        return newData;
      });
      
      // Show template selection
      setShowTemplateOptions(true);
    } catch (error: any) {
      console.error('Preprocessing error:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!videoData?.preprocessed) {
      toast.error('Please preprocess the video first');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      
      // Use the same data structure as preview
      const promptData = {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        channelTitle: videoData.channelTitle,
        summary: videoData.summary,
        detailedAnalysis: videoData.detailedAnalysis,
        patterns: videoData.preprocessed.patterns,
        semantic: videoData.preprocessed.semantic,
        roles: videoData.preprocessed.roles
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: promptData,
          mode: selectedTemplate,
          settings: postSettings,
          preview: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate post');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewPrompt = async () => {
    if (!videoData?.preprocessed) {
      toast.error('Please preprocess the video first');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Use the same data structure for both preview and generation
      const promptData = {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        channelTitle: videoData.channelTitle,
        summary: videoData.summary,
        detailedAnalysis: videoData.detailedAnalysis,
        patterns: videoData.preprocessed.patterns,
        semantic: videoData.preprocessed.semantic,
        roles: videoData.preprocessed.roles
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: promptData,
          mode: selectedTemplate,
          settings: postSettings,
          preview: true
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to preview prompt');
      }

      setPreviewPrompt(data.prompt);
      setShowPreview(true);
    } catch (error: any) {
      console.error('Error previewing prompt:', error);
      setError(error.message);
      toast.error(error.message);
      setShowPreview(false);
    } finally {
      setGenerating(false);
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
          {!videoData ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
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
                        Transcribing...
                      </div>
                    ) : (
                      'Transcribe'
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
                      src={videoData.thumbnails?.maxres?.url || 
                           videoData.thumbnails?.high?.url || 
                           videoData.thumbnails?.medium?.url || 
                           videoData.thumbnails?.default?.url ||
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
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-300 block flex-shrink-0">Description:</span>
                        <span className="text-white break-words overflow-auto max-h-32">{videoData.description}</span>
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
                    
                    {/* Processing Status */}
                    <ProcessingStatus 
                      generating={generating}
                      processId={processId}
                    />
                    
                    {!showTemplateOptions ? (
                      <div className="space-y-4">
                        <button 
                          onClick={handlePreprocess}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!videoData?.transcription || generating}
                        >
                          <span>Process Video</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Summary Section */}
                        {videoData?.summary && (
                          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                            <h4 className="text-lg font-semibold text-white mb-2">Summary</h4>
                            <div className="space-y-4">
                              {videoData.summary && (
                                <div className="text-gray-300 leading-relaxed">
                                  {videoData.summary}
                                </div>
                              )}
                              {videoData.detailedAnalysis && (
                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                  {videoData.detailedAnalysis}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Writing Style */}
                        <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                          <h4 className="text-lg font-semibold text-white mb-4">Writing Style</h4>
                          <div className="space-y-6">
                            {/* Tone Slider */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Casual</span>
                                <span className="text-gray-400">Formal</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={postSettings.tone}
                                onChange={(e) => setPostSettings({
                                  ...postSettings,
                                  tone: parseInt(e.target.value)
                                })}
                                className="w-full"
                              />
                              <div className="text-center text-sm text-gray-400">
                                {getToneLabel(postSettings.tone)}
                              </div>
                            </div>

                            {/* Personality Traits */}
                            <div className="space-y-4">
                              <h5 className="text-white font-medium">Personality Traits</h5>
                              
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
                                        <DebugRender 
                                          value={getToneHint(postSettings.tone).suggestions[trait.key]} 
                                          name={`tone-hint-${trait.key}`}
                                        />
                                      </p>
                                    </div>
                                    <span>
                                      <DebugRender 
                                        value={postSettings.personality[trait.key as keyof typeof postSettings.personality]} 
                                        name={`personality-${trait.key}`}
                                      />%
                                    </span>
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
                        </div>

                        <ErrorBoundary>
                          {/* Length Selection */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                              Post Length
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                              {['brief', 'standard', 'detailed'].map((length) => {
                                const guide = getTemplateGuide(selectedTemplate, length as 'brief' | 'standard' | 'detailed');
                                console.debug('Rendering length option:', {
                                  length,
                                  selectedTemplate,
                                  guide
                                });
                                
                                return (
                            <button 
                                    key={length}
                                    onClick={() => setPostSettings(prev => ({ ...prev, length: length as 'brief' | 'standard' | 'detailed' }))}
                                    className={`p-4 rounded-lg border ${
                                      postSettings.length === length
                                        ? 'border-purple-500 bg-purple-900/50'
                                        : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-900/20'
                                    } transition-all duration-200`}
                                  >
                                    <h3 className="text-lg font-semibold mb-2 capitalize">{length}</h3>
                                    <p className="text-sm text-gray-400">
                                      <DebugRender 
                                        value={guide} 
                                        name={`guide-${length}`}
                                      />
                                    </p>
                            </button>
                                );
                              })}
                            </div>
                          </div>
                        </ErrorBoundary>

                        {/* Template Selection */}
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Post Template
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templateOptions.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`p-4 rounded-lg border ${
                                  selectedTemplate === template.id
                                    ? 'border-purple-500 bg-purple-900/50'
                                    : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-900/20'
                                } transition-all duration-200`}
                              >
                                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                                <p className="text-sm text-gray-400">
                                  {template.description}
                                </p>
                              </button>
                            ))}
                                </div>
                              </div>

                        {/* Create LinkedIn Post Button */}
                        <div className="mt-6 flex gap-4">
                          <button
                            onClick={handlePreviewPrompt}
                            disabled={!selectedTemplate || generating}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            <span>Preview Prompt</span>
                          </button>
                          <button
                            onClick={handleGeneratePost}
                            disabled={!selectedTemplate || generating}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            <span>Generate Post</span>
                          </button>
                        </div>

                        {/* Generated Content */}
                        {generatedContent && (
                          <div className="mt-8">
                            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                              <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm">
                                {generatedContent}
                              </pre>
                            </div>
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

      {/* Preview Prompt Modal */}
      {showPreview && previewPrompt && !error && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Preview Prompt</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-900">
              {error ? (
                <div className="text-red-500 bg-red-900/20 p-4 rounded-lg">
                  {error}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-100 bg-gray-800 p-4 rounded-lg">
                  {previewPrompt}
                </pre>
              )}
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end bg-gray-900">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
