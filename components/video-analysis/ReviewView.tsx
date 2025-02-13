'use client';

import { EnrichedVideoMetadata } from '@/types/openai';

interface ReviewViewProps {
  data: EnrichedVideoMetadata;
}

export default function ReviewView({ data }: ReviewViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment || !('review_details' in enrichment)) {
    return null;
  }

  const { review_details } = enrichment;
  
  return (
    <div className="space-y-6">
      {/* Product Overview */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-300">{review_details.product_name}</h3>
            {review_details.manufacturer && (
              <p className="text-gray-400 mt-1">{review_details.manufacturer}</p>
            )}
          </div>
          {review_details.price_point && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {review_details.price_point}
            </span>
          )}
        </div>

        {/* Key Features */}
        <div className="mt-4">
          <h4 className="font-medium text-purple-200 mb-2">Key Features</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {review_details.key_features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h4 className="font-medium text-green-400 mb-3">Pros</h4>
          <ul className="space-y-2">
            {review_details.pros.map((pro, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h4 className="font-medium text-red-400 mb-3">Cons</h4>
          <ul className="space-y-2">
            {review_details.cons.map((con, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span className="text-gray-300">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h4 className="font-medium text-purple-300 mb-4">Performance Analysis</h4>
        
        {/* Highlights */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-purple-200 mb-2">Highlights</h5>
          <ul className="space-y-2">
            {review_details.performance.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Issues */}
        <div>
          <h5 className="text-sm font-medium text-purple-200 mb-2">Issues</h5>
          <ul className="space-y-2">
            {review_details.performance.issues.map((issue, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h4 className="font-medium text-purple-300 mb-4">Final Assessment</h4>
        
        {/* Value Assessment */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-purple-200 mb-2">Value for Money</h5>
          <p className="text-gray-300">{review_details.value_assessment}</p>
        </div>

        {/* Recommendation */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-purple-200 mb-2">Recommendation</h5>
          <p className="text-gray-300">{review_details.recommendation}</p>
        </div>

        {/* Best For */}
        <div>
          <h5 className="text-sm font-medium text-purple-200 mb-2">Best For</h5>
          <ul className="space-y-2">
            {review_details.best_for.map((use, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timestamps */}
      {review_details.timestamps && review_details.timestamps.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h4 className="font-medium text-purple-300 mb-4">Video Segments</h4>
          <div className="space-y-3">
            {review_details.timestamps.map((stamp, i) => (
              <div key={i} className="flex items-start">
                <span className="text-purple-400 font-mono mr-3">{stamp.time}</span>
                <span className="text-gray-300">{stamp.topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
