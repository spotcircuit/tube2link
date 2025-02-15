'use client';

import { useState } from 'react';
import OpenAIAnalysis from '@/components/OpenAIAnalysis';
import { EnrichedVideoMetadata } from '@/types/openai';

export default function TestDetection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [openAIResult, setOpenAIResult] = useState<EnrichedVideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useOpenAI, setUseOpenAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setOpenAIResult(null);

    try {
      const params = new URLSearchParams({ url, useOpenAI: useOpenAI.toString() });
      const response = await fetch(`/api/test/detect?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      setResult(data);
      if (useOpenAI && data.analysis) {
        setOpenAIResult(data.analysis);
      } else {
        setOpenAIResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-purple-300">Video Analysis Test</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div>
            <label htmlFor="url" className="block text-lg font-medium text-purple-200 mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg p-3"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <label htmlFor="useOpenAI" className="text-lg font-medium text-purple-200">
              Use OpenAI Analysis
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={useOpenAI}
              onClick={() => setUseOpenAI(!useOpenAI)}
              className={`${
                useOpenAI ? 'bg-purple-600' : 'bg-gray-600'
              } relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
            >
              <span
                aria-hidden="true"
                className={`${
                  useOpenAI ? 'translate-x-6' : 'translate-x-0'
                } pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-3 px-6 text-lg font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Video'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Video Metadata */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Video Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Title</h3>
                  <p>{result.metadata.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Channel</h3>
                  <p>{result.metadata.channelTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="whitespace-pre-wrap">{result.metadata.description}</p>
                </div>
              </div>
            </section>

            {/* OpenAI Analysis */}
            {openAIResult && <OpenAIAnalysis data={openAIResult} />}
          </div>
        )}
      </div>
    </div>
  );
}