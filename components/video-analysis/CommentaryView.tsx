'use client';

import { EnrichedVideoMetadata } from '@/types/openai';

interface CommentaryViewProps {
  data: EnrichedVideoMetadata;
}

export default function CommentaryView({ data }: CommentaryViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment || !('commentary_details' in enrichment)) {
    return null;
  }

  const { commentary_details } = enrichment;
  
  return (
    <div className="space-y-6">
      {/* Format and Tone */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {commentary_details.format.replace('_', ' ')}
          </div>
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {commentary_details.tone}
          </div>
        </div>
      </div>

      {/* Topics Covered */}
      <div className="space-y-4">
        {commentary_details.topics_covered.map((topic, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">{topic.topic}</h3>
            
            <div className="space-y-4">
              {/* Treatment */}
              <div>
                <h4 className="font-medium text-purple-200 mb-2">Treatment</h4>
                <p className="text-gray-300">{topic.treatment}</p>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-medium text-purple-200 mb-2">Key Points</h4>
                <ul className="space-y-2">
                  {topic.key_points.map((point, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comedic Elements */}
              {topic.comedic_elements.length > 0 && (
                <div>
                  <h4 className="font-medium text-purple-200 mb-2">Comedic Elements</h4>
                  <ul className="space-y-2">
                    {topic.comedic_elements.map((element, j) => (
                      <li key={j} className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span className="text-gray-300">{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Host Perspective */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-300 mb-4">Host Perspective</h3>
        <p className="text-gray-300">{commentary_details.host_perspective}</p>
      </div>

      {/* Notable Segments */}
      {commentary_details.notable_segments.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Notable Segments</h3>
          <div className="space-y-4">
            {commentary_details.notable_segments.map((segment, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-200">{segment.title}</h4>
                  {segment.timestamp && (
                    <span className="text-purple-400 font-mono">{segment.timestamp}</span>
                  )}
                </div>
                <p className="text-gray-300">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Elements */}
      {commentary_details.visual_elements.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Visual Elements</h3>
          <div className="flex flex-wrap gap-2">
            {commentary_details.visual_elements.map((element, i) => (
              <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {element}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Audience Engagement */}
      {commentary_details.audience_engagement && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Audience Engagement</h3>
          <p className="text-gray-300">{commentary_details.audience_engagement}</p>
        </div>
      )}
    </div>
  );
}
