'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { VideoData } from '@/types/video';
import VideoMetadata from '@/components/VideoMetadata';
import VideoAnalysis from '@/components/VideoAnalysis';
import SocialPostGenerator from '@/components/SocialPostGenerator';

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
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      toast.error('Please enter a video URL');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const data = await response.json();
      if (data.success && data.metadata) {
        setVideoData(data.metadata);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error processing video:', error);
      toast.error(error.message || 'Failed to process video');
      setError(error.message || 'Failed to process video');
    } finally {
      setLoading(false);
    }
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
            <div className="space-y-8">
              {/* Full Width Metadata Section */}
              <div className="w-full">
                <VideoMetadata videoData={videoData} />
              </div>

              {/* Detailed Analysis Section */}
              <div className="w-full">
                <VideoAnalysis 
                  videoData={videoData} 
                  onUseInPost={(content) => {
                    // Handle using content in post
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
