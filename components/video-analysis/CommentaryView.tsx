'use client';

import { EnrichedVideoMetadata, CommentaryDetails } from '@/types/openai';

interface CommentaryViewProps {
  data: EnrichedVideoMetadata;
}

export default function CommentaryView({ data }: CommentaryViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.commentary_details) {
    return null;
  }

  const commentary_details: CommentaryDetails = enrichment.commentary_details;
  
  return (
    <div className="space-y-6">
      {/* Format and Tone */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {commentary_details?.format?.replace('_', ' ') || 'Unknown Format'}
          </div>
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {commentary_details?.tone || 'Unknown Tone'}
          </div>
        </div>
      </div>

      {/* Topics Covered */}
      <div className="space-y-4">
        {commentary_details?.topics_covered?.map((topic, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">{topic?.topic || 'Untitled Topic'}</h3>
            
            <div className="space-y-4">
              {/* Treatment */}
              <div>
                <h4 className="font-medium text-purple-200 mb-2">Treatment</h4>
                <p className="text-gray-300">{topic?.treatment || 'No treatment provided'}</p>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-medium text-purple-200 mb-2">Key Points</h4>
                <ul className="space-y-2">
                  {topic?.key_points?.map((point, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comedic Elements */}
              <div>
                <h4 className="font-medium text-purple-200 mb-2">Comedic Elements</h4>
                <ul className="space-y-2">
                  {topic?.comedic_elements?.map((element, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-purple-400 mr-2">😄</span>
                      <span className="text-gray-300">{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Host Perspective */}
      {commentary_details?.host_perspective && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Host Perspective</h3>
          <p className="text-gray-300">{commentary_details.host_perspective}</p>
        </div>
      )}

      {/* Notable Segments */}
      {commentary_details?.notable_segments && commentary_details.notable_segments.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Notable Segments</h3>
          <div className="space-y-4">
            {commentary_details.notable_segments.map((segment, i) => (
              <div key={i} className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-200">{segment?.title || 'Untitled Segment'}</h4>
                <p className="text-gray-300 mt-2">{segment?.description || 'No description provided'}</p>
                {segment?.timestamp && (
                  <span className="text-sm text-purple-400 mt-1 block">
                    Timestamp: {segment.timestamp}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Elements */}
      {commentary_details?.visual_elements && commentary_details.visual_elements.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Visual Elements</h3>
          <ul className="space-y-2">
            {commentary_details.visual_elements.map((element, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">🎨</span>
                <span className="text-gray-300">{element}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
