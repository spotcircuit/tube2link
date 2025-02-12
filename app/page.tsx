'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { VIDEO_CONTEXTS } from '@/lib/video_context';

import { VideoData } from '@/types/video';
import { getConfig } from '@/lib/config';
import RichTextEditor from '@/components/RichTextEditor';

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
    structure: `
1. Open with an intriguing industry question
2. Share context from your experience
3. Present the video's perspective
4. Highlight key supporting evidence
5. Invite thoughtful responses`
  },
  story: {
    name: 'Story-Based',
    structure: `
1. Start with a relatable situation
2. Share the learning journey
3. Present key discoveries
4. Connect to broader principles
5. End with earned wisdom`
  },
  action: {
    name: 'Action-Oriented',
    structure: `
1. State the goal clearly
2. Explain why it matters now
3. Present concrete steps
4. Share a practical example
5. Call to action`
  },
  insight: {
    name: 'Insight-Based',
    structure: `
1. Lead with surprising data
2. Explain the significance
3. Reveal deeper understanding
4. Support with evidence
5. Challenge assumptions`
  },
  problem_solution: {
    name: 'Problem-Solution',
    structure: `
1. Identify the pain point clearly
2. Explain its impact
3. Present the solution approach
4. Share implementation details
5. Highlight the benefits`
  },
  comparison: {
    name: 'Comparison',
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
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  // Add state for collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'implementation': false,
    'code-examples': false,
    'key-points': false,
    'insights': false,
    'requirements': false,
    'limitations': false,
  });

  // Toggle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Copy content to clipboard
  const copyToClipboard = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle to skip preprocessing
  const SKIP_PREPROCESS = true;

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
      
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      // Update video data with transcription and video info
      setVideoData({
        ...response.data.videoInfo,
        transcription: response.data.transcription
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to process video';
      setError(errorMessage);
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
    if (!videoData?.transcription) {
      setError('No transcription available');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      // Get summary first
      const summaryResponse = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoData }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.details || 'Failed to generate summary');
      }

      const summaryData = await summaryResponse.json();
      console.log('Summary Data:', summaryData);

      // Always update with summary
      setVideoData(prevVideoData => {
        if (!prevVideoData) return null;
        return {
          ...prevVideoData,
          summary: summaryData.summary
        };
      });

      // If skipping preprocessing, show template options immediately
      if (SKIP_PREPROCESS) {
        setShowTemplateOptions(true);
        setGenerating(false);
        return;
      }

      // Continue with preprocessing if not skipped
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
      console.log('Preprocessing Response:', data);
      
      // Store preprocessed data and analysis
      setVideoData(prevVideoData => {
        if (!prevVideoData) return null;
        const newData = {
          ...prevVideoData,
          preprocessed: data.preprocessed,
          detailedAnalysis: data.detailedAnalysis
        };
        console.log('Updated Video Data:', newData);
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
    if (!videoData) {
      toast.error('No video data available')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData,
          template: selectedTemplate,
          settings: postSettings
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate post')
      }

      const data = await response.json()
      setEditorContent(data.content)
      setShowTemplateOptions(false)
      setShowEditor(true)
    } catch (error) {
      console.error('Error generating post:', error)
      toast.error('Failed to generate post')
    } finally {
      setGenerating(false)
    }
  };

  const handleEditorReturn = () => {
    setShowEditor(false);
    setShowTemplateOptions(true);
  };

  const handleEditorCopy = () => {
    toast.success('Content copied to clipboard!');
  };

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
              Transform your YouTube videos into engaging Social Media posts with just a few clicks
            </p>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        {!videoData && (
          <div className="w-full max-w-7xl mx-auto -mt-24 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered',
                  icon: '🤖'
                },
                {
                  title: 'Time-Saving',
                  icon: '⚡'
                },
                {
                  title: 'Professional',
                  icon: '✨'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                </div>
              ))}
            </div>
            
            {/* URL Input Form */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
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
                          'Convert'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {videoData && (
          <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-8">
              {/* Video Info Column */}
              <div className="space-y-6">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                  <Image
                    src={videoData.thumbnails?.high?.url ||
                         videoData.thumbnails?.medium?.url || 
                         videoData.thumbnails?.default?.url ||
                         `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`}
                    alt={videoData.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                
                {/* Video Info */}
                <div className="space-y-4">
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
                    <div className="bg-black/20 rounded-lg border border-white/10">
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm p-6 max-h-[60vh] h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                        {videoData.transcription}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Post Generation Column */}
              <div className="space-y-6">
                {!showTemplateOptions && !showEditor ? (
                  <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Generate Social Media Post</h4>
                    <div className="space-y-4">
                      <button 
                        onClick={handlePreprocess}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                        disabled={!videoData?.transcription || generating}
                      >
                        {generating ? (
                          <>
                            <span className="animate-spin">⚡</span>
                            <span>Processing Video...</span>
                          </>
                        ) : (
                          <>
                            <span>Process Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Summary Section */}
                {videoData?.summary && showTemplateOptions && (
                  <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                    {/* Main Summary */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Summary</h4>
                      <div className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                        {typeof videoData.summary === 'string' ? videoData.summary : videoData.summary.summary}
                      </div>
                    </div>
                    
                    {typeof videoData.summary !== 'string' && videoData.summary.analysis && (
                      <div className="mt-8 space-y-8">
                        {/* Core Concepts */}
                        <div className="space-y-6">
                          <h5 className="text-white font-medium flex items-center gap-2">
                            <span className="text-purple-400">💡</span> Core Concepts
                          </h5>
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* Key Points */}
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="text-purple-300 text-sm font-medium">Key Points</h6>
                                <button
                                  className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                  onClick={() => copyToClipboard(
                                    videoData.summary?.analysis?.core_concepts?.key_points
                                      ?.map(point => `${point.importance}: ${point.content}\n`)
                                      ?.join('\n') || ''
                                  )}
                                >
                                  Copy
                                </button>
                              </div>
                              <div className="space-y-2">
                                {videoData.summary?.analysis?.core_concepts?.key_points?.map((point, index) => (
                                  <div key={index} className="flex items-start gap-2 group relative">
                                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                      point.importance >= 0.8 ? 'bg-purple-500/20 text-purple-300' :
                                      point.importance >= 0.5 ? 'bg-blue-500/20 text-blue-300' :
                                      'bg-gray-500/20 text-gray-300'
                                    }`}>
                                      {point.importance >= 0.8 ? 'Core Concept' :
                                       point.importance >= 0.5 ? 'Key Point' :
                                       'Supporting'}
                                    </span>
                                    <div className="text-gray-300 flex-1 relative">
                                      <p className="text-gray-300">{point.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Insights */}
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="text-purple-300 text-sm font-medium">Insights</h6>
                                <button
                                  className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                  onClick={() => copyToClipboard(
                                    videoData.summary?.analysis?.core_concepts?.insights
                                      ?.map(insight => `${insight.importance}: ${insight.content}\n`)
                                      ?.join('\n') || ''
                                  )}
                                >
                                  Copy
                                </button>
                              </div>
                              <div className="space-y-2">
                                {videoData.summary?.analysis?.core_concepts?.insights?.map((insight, index) => (
                                  <div key={index} className="flex items-start gap-2 group relative">
                                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                      insight.importance >= 0.8 ? 'bg-red-500/20 text-red-300' :
                                      insight.importance >= 0.5 ? 'bg-yellow-500/20 text-yellow-300' :
                                      'bg-green-500/20 text-green-300'
                                    }`}>
                                      {insight.importance >= 0.8 ? 'Critical' :
                                       insight.importance >= 0.5 ? 'Valuable' :
                                       'Helpful'}
                                    </span>
                                    <div className="text-gray-300 flex-1 relative">
                                      <p className="text-gray-300">{insight.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Technical Details Section */}
                        <div className="space-y-6">
                          <h5 className="text-white font-medium flex items-center gap-2">
                            <span className="text-purple-400">⚙️</span> Technical Details
                          </h5>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Requirements */}
                            <div className="bg-black/20 rounded-lg border border-white/5">
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/10"
                                onClick={() => toggleSection('requirements')}
                              >
                                <h6 className="text-purple-300 text-sm font-medium">Requirements</h6>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        videoData.summary?.analysis?.technical_details?.requirements
                                          ?.map(req => `${req.content}\n${req.type ? `// Type: ${req.type}\n` : ''}\n`)
                                          ?.join('\n') || ''
                                      );
                                    }}
                                  >
                                    Copy
                                  </button>
                                  <span className="text-purple-400">
                                    {collapsedSections['requirements'] ? '▼' : '▲'}
                                  </span>
                                </div>
                              </div>
                              {!collapsedSections['requirements'] && (
                                <div className="p-4 pt-0">
                                  <div className="space-y-3">
                                    {videoData.summary?.analysis?.technical_details?.requirements?.map((req, index) => (
                                      <div key={index} className="bg-black/20 p-3 rounded space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-300">{req.content}</span>
                                          {req.type && (
                                            <span className="text-xs text-blue-400">Type: {req.type}</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Limitations */}
                            <div className="bg-black/20 rounded-lg border border-white/5">
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/10"
                                onClick={() => toggleSection('limitations')}
                              >
                                <h6 className="text-purple-300 text-sm font-medium">Limitations</h6>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        videoData.summary?.analysis?.technical_details?.limitations
                                          ?.map(limit => `${limit.content}\n${limit.severity ? `// Severity: ${limit.severity}\n` : ''}\n`)
                                          ?.join('\n') || ''
                                      );
                                    }}
                                  >
                                    Copy
                                  </button>
                                  <span className="text-purple-400">
                                    {collapsedSections['limitations'] ? '▼' : '▲'}
                                  </span>
                                </div>
                              </div>
                              {!collapsedSections['limitations'] && (
                                <div className="p-4 pt-0">
                                  <div className="space-y-3">
                                    {videoData.summary?.analysis?.technical_details?.limitations?.map((limit, index) => (
                                      <div key={index} className="bg-black/20 p-3 rounded space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-300">{limit.content}</span>
                                          {limit.severity && (
                                            <span className={`text-xs ${
                                              limit.severity === 'high' ? 'text-red-400' :
                                              limit.severity === 'medium' ? 'text-yellow-400' :
                                              'text-blue-400'
                                            }`}>
                                              Severity: {limit.severity}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Practical Application Section */}
                        <div className="space-y-6">
                          <h5 className="text-white font-medium flex items-center gap-2">
                            <span className="text-purple-400">🛠️</span> Practical Application
                          </h5>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Implementation Steps */}
                            <div className="bg-black/20 rounded-lg border border-white/5">
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/10"
                                onClick={() => toggleSection('implementation')}
                              >
                                <h6 className="text-purple-300 text-sm font-medium">Implementation Steps</h6>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        videoData.summary?.analysis?.practical_application?.implementation_steps
                                          ?.map((step, index) => `${index + 1}: ${step.content}\n${step.prerequisites?.length ? `Prerequisites: ${step.prerequisites.join(', ')}\n` : ''}\n`)
                                          ?.join('\n') || ''
                                      );
                                    }}
                                  >
                                    Copy
                                  </button>
                                  <span className="text-purple-400">
                                    {collapsedSections['implementation'] ? '▼' : '▲'}
                                  </span>
                                </div>
                              </div>
                              {!collapsedSections['implementation'] && (
                                <div className="p-4 pt-0">
                                  <div className="space-y-4">
                                    {videoData.summary?.analysis?.practical_application?.implementation_steps?.map((step, index) => (
                                      <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-purple-400">
                                              #{index + 1}
                                            </span>
                                            <span className="text-gray-300">{step.content}</span>
                                          </div>
                                          <span className={`text-xs px-2 py-1 rounded ${
                                            step.importance >= 0.8 ? 'bg-red-500/20 text-red-300' :
                                            step.importance >= 0.5 ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-green-500/20 text-green-300'
                                          }`}>
                                            {step.importance >= 0.8 ? 'Critical' :
                                             step.importance >= 0.5 ? 'Important' :
                                             'Optional'}
                                          </span>
                                        </div>
                                        {step.prerequisites?.length > 0 && (
                                          <div className="text-sm text-gray-400 pl-6">
                                            <span className="font-medium">Prerequisites: </span>
                                            {step.prerequisites.join(', ')}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Code Examples */}
                            <div className="bg-black/20 rounded-lg border border-white/5">
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/10"
                                onClick={() => toggleSection('code-examples')}
                              >
                                <h6 className="text-purple-300 text-sm font-medium">Code Examples</h6>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(
                                        videoData.summary?.analysis?.practical_application?.code_examples
                                          ?.map(ex => `// Language: ${ex.language} (Importance: ${ex.importance})\n${ex.content}\n`)
                                          ?.join('\n') || ''
                                      );
                                    }}
                                  >
                                    Copy
                                  </button>
                                  <span className="text-purple-400">
                                    {collapsedSections['code-examples'] ? '▼' : '▲'}
                                  </span>
                                </div>
                              </div>
                              {!collapsedSections['code-examples'] && (
                                <div className="p-4 pt-0">
                                  <div className="space-y-6">
                                    {videoData.summary?.analysis?.practical_application?.code_examples?.map((example, index) => (
                                      <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className={`text-xs px-2 py-1 rounded ${
                                            example.importance >= 0.8 ? 'bg-purple-500/20 text-purple-300' :
                                            example.importance >= 0.5 ? 'bg-blue-500/20 text-blue-300' :
                                            'bg-gray-500/20 text-gray-300'
                                          }`}>
                                            {example.language}
                                          </span>
                                          <span className="text-xs text-gray-400">
                                            Importance: {Math.round(example.importance * 100)}%
                                          </span>
                                        </div>
                                        <pre className="bg-black/20 p-3 rounded overflow-x-auto">
                                          <code className="text-gray-300 text-sm">{example.content}</code>
                                        </pre>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Writing Style */}
                        {showTemplateOptions && (
                          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg font-semibold text-white mb-6">Writing Style</h4>
                            <div className="space-y-8">
                              {/* Tone Slider */}
                              <div className="space-y-3">
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
                              <div className="space-y-6">
                                <h5 className="text-white font-medium">Personality Traits</h5>
                                <div className="grid sm:grid-cols-2 gap-6">
                                  {[
                                    { key: 'charm', label: '✨ Charm', description: 'Warmth and appeal' },
                                    { key: 'wit', label: '💭 Wit', description: 'Clever observations' },
                                    { key: 'humor', label: '😊 Humor', description: 'Fun and light' },
                                    { key: 'sarcasm', label: '😏 Sarcasm', description: 'Ironic edge' }
                                  ].map((trait) => (
                                    <div key={trait.key} className="space-y-2">
                                      <div className="flex justify-between text-white">
                                        <div>
                                          <div className="font-medium">{trait.label}</div>
                                          <p className="text-sm text-gray-400">{trait.description}</p>
                                          <p className="text-xs text-blue-400">
                                            {getToneHint(postSettings.tone).suggestions[trait.key]}
                                          </p>
                                        </div>
                                        <span className="text-xs text-purple-400">
                                          {postSettings.personality[trait.key as keyof typeof postSettings.personality]}%
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
                          </div>
                        )}

                        {/* Length Selection */}
                        {showTemplateOptions && (
                          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                            <label className="block text-lg font-semibold text-white mb-4">
                              Post Length
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                              {['brief', 'standard', 'detailed'].map((length) => (
                                <button
                                  key={length}
                                  onClick={() => setPostSettings(prev => ({ ...prev, length: length as any }))}
                                  className={`px-4 py-3 rounded-lg border transition-colors duration-200 ${
                                    postSettings.length === length
                                      ? 'bg-purple-600 border-purple-500 text-white'
                                      : 'bg-black/20 border-white/10 text-gray-300 hover:bg-black/30'
                                  }`}
                                >
                                  {length.charAt(0).toUpperCase() + length.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Template Selection */}
                        {showTemplateOptions && (
                          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                            <label className="block text-lg font-semibold text-white mb-4">
                              Post Template
                            </label>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {templateOptions.map((template) => (
                                <button
                                  key={template.id}
                                  onClick={() => setSelectedTemplate(template.id)}
                                  className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                                    selectedTemplate === template.id
                                      ? 'bg-purple-600 border-purple-500'
                                      : 'bg-black/20 border-white/10 hover:bg-black/30'
                                  }`}
                                >
                                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Generate Button */}
                        {showTemplateOptions && (
                          <div className="mt-8">
                            <button
                              onClick={handleGeneratePost}
                              disabled={generating || !selectedTemplate}
                              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              {generating ? (
                                <>
                                  <span className="animate-spin">⚡</span>
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <span>Generate Social Media Post</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

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

                {/* Editor */}
                {showEditor && (
                  <div className="mt-8">
                    <RichTextEditor
                      content={editorContent}
                      onReturn={handleEditorReturn}
                      onCopy={handleEditorCopy}
                      videoUrl={`https://youtu.be/${videoData?.metadata?.videoId}`}
                      videoTitle={videoData?.title}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
