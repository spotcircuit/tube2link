'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { VideoData } from '@/types/video';
import { EnrichedVideoMetadata } from '@/types/openai';
import VideoMetadata from '@/components/VideoMetadata';
import OpenAIAnalysis from '@/components/OpenAIAnalysis';

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

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [openAIResult, setOpenAIResult] = useState<EnrichedVideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string>('');
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
      // First get video metadata from convert endpoint
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
      if (data.status === 'success' && data.metadata) {
        // Save the successful URL
        setSavedUrl(videoUrl);
        
        setVideoData({
          ...data.metadata,
          isShort: data.isShort || false,
          url: videoUrl // Use the input URL directly
        });

        // Get OpenAI analysis
        setAnalysisLoading(true);
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            metadata: {
              ...data.metadata,
              url: videoUrl // Make sure analysis gets the URL too
            }
          })
        });
        
        if (!analysisResponse.ok) {
          console.error('OpenAI analysis failed:', await analysisResponse.text());
          toast.error('OpenAI analysis failed. Please try again.');
          return;
        }

        const analysisData = await analysisResponse.json();
        console.log('OpenAI analysis:', analysisData);
        
        if (analysisData.status === 'success' && analysisData.analysis) {
          setOpenAIResult(analysisData.analysis);
        } else {
          console.error('No valid analysis data found in response');
          toast.error('Failed to get video analysis. Please try again.');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error processing video:', error);
      toast.error(error.message || 'Failed to process video');
      setError(error.message || 'Failed to process video');
    } finally {
      setLoading(false);
      setAnalysisLoading(false);
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
                            Processing...
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

              {/* OpenAI Analysis */}
              {analysisLoading ? (
                <div className="w-full backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="text-white text-lg">Analyzing video content...</p>
                  </div>
                </div>
              ) : openAIResult && (
                <div className="w-full backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10">
                  <OpenAIAnalysis 
                    data={openAIResult} 
                    isToggled={true} 
                    onReturn={() => {
                      setVideoData(null);
                      setOpenAIResult(null);
                      setError(null);
                      setLoading(false);
                      setAnalysisLoading(false);
                      if (inputRef.current) {
                        inputRef.current.value = '';
                        inputRef.current.focus();
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
