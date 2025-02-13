'use client';

import { EnrichedVideoMetadata } from '@/types/openai';

interface NewsViewProps {
  data: EnrichedVideoMetadata;
}

export default function NewsView({ data }: NewsViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment || !('news_details' in enrichment)) {
    return null;
  }

  const { news_details } = enrichment;
  
  return (
    <div className="space-y-6">
      {/* Event Context */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Event Context</h3>
        <p className="text-gray-300">{news_details.context}</p>
      </div>

      {/* Key Points */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Points</h3>
        <ul className="space-y-2">
          {news_details.key_points.map((point, i) => (
            <li key={i} className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              <span className="text-gray-300">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Notable Quotes */}
      {news_details.quotes && news_details.quotes.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Notable Quotes</h3>
          <div className="space-y-4">
            {news_details.quotes.map((quote, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                <blockquote className="text-gray-300 mb-2">"{quote.text}"</blockquote>
                <div className="flex items-center text-sm text-gray-400">
                  <span>— {quote.speaker}</span>
                  {quote.context && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{quote.context}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants */}
      {news_details.participants && news_details.participants.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Key Participants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news_details.participants.map((participant, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-200 mb-2">{participant.name}</h4>
                <div className="space-y-1 text-gray-300">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Role:</span>
                    <span>{participant.role}</span>
                  </div>
                  {participant.affiliation && (
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">Affiliation:</span>
                      <span>{participant.affiliation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fact Check */}
      {news_details.fact_check && news_details.fact_check.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Fact Check</h3>
          <div className="space-y-4">
            {news_details.fact_check.map((fact, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-200 mb-2">Claim</h4>
                <p className="text-gray-300 mb-3">{fact.claim}</p>
                <h4 className="font-medium text-purple-200 mb-2">Context</h4>
                <p className="text-gray-300">{fact.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
