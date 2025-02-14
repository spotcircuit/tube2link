'use client';

import { EnrichedVideoMetadata, ReviewDetails } from '@/types/openai';

interface ReviewViewProps {
  data: EnrichedVideoMetadata;
}

export default function ReviewView({ data }: ReviewViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.review_details) {
    return null;
  }

  const review: ReviewDetails = enrichment.review_details;
  
  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-300">{review.product_name}</h3>
            {review.manufacturer && (
              <p className="text-gray-400">{review.manufacturer}</p>
            )}
          </div>
          {review.price_point && (
            <div className="text-right">
              <span className="text-gray-400">Price:</span>
              <p className="text-purple-300 font-semibold">{review.price_point}</p>
            </div>
          )}
        </div>

        {/* Key Features */}
        {review.key_features && review.key_features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-purple-300 mb-3">Key Features</h4>
            <ul className="space-y-2">
              {review.key_features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          {review.pros && review.pros.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">Pros</h4>
              <ul className="space-y-2">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {review.cons && review.cons.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-red-400 mb-3">Cons</h4>
              <ul className="space-y-2">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Performance */}
      {review.performance && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-purple-300 mb-4">Performance</h4>
          
          {/* Highlights */}
          {review.performance.highlights && review.performance.highlights.length > 0 && (
            <div className="mb-4">
              <h5 className="text-green-400 font-medium mb-2">Highlights</h5>
              <ul className="space-y-2">
                {review.performance.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {review.performance.issues && review.performance.issues.length > 0 && (
            <div>
              <h5 className="text-red-400 font-medium mb-2">Issues</h5>
              <ul className="space-y-2">
                {review.performance.issues.map((issue, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span className="text-gray-300">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Value Assessment & Recommendation */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {review.value_assessment && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-purple-300 mb-3">Value Assessment</h4>
            <p className="text-gray-300">{review.value_assessment}</p>
          </div>
        )}

        {review.recommendation && (
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-3">Recommendation</h4>
            <p className="text-gray-300">{review.recommendation}</p>
          </div>
        )}
      </div>

      {/* Best For */}
      {review.best_for && review.best_for.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Best For</h4>
          <ul className="space-y-2">
            {review.best_for.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
