'use client';

import { EnrichedVideoMetadata, NewsDetails } from '@/types/openai';

interface NewsViewProps {
  data: EnrichedVideoMetadata;
}

export default function NewsView({ data }: NewsViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.news_details) {
    return null;
  }

  const news: NewsDetails = enrichment.news_details;
  
  return (
    <div className="space-y-6">
      {/* Context */}
      {news.context && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Event Context</h3>
          <p className="text-gray-300">{news.context}</p>
        </div>
      )}

      {/* Key Points */}
      {news.key_points && news.key_points.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Points</h3>
          <ul className="list-none space-y-2">
            {news.key_points.map((point, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {news.sources && news.sources.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Sources</h3>
          <ul className="list-none space-y-2">
            {news.sources.map((source, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis */}
      {news.analysis && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Analysis</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{news.analysis}</p>
        </div>
      )}
    </div>
  );
}
