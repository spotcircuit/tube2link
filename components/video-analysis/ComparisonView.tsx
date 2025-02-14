'use client';

import { EnrichedVideoMetadata, ComparisonDetails } from '@/types/openai';

interface ComparisonViewProps {
  data: EnrichedVideoMetadata;
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.comparison_details) {
    return null;
  }

  const comparison: ComparisonDetails = enrichment.comparison_details;
  
  return (
    <div className="space-y-6">
      {/* Product Comparison Grid */}
      {comparison.items_compared && comparison.items_compared.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Product Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparison.items_compared.map((item, i) => (
              <div key={i} className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-medium text-purple-300">{item.name || 'Unnamed Product'}</h4>
                  {i === 0 && <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">Basic</span>}
                  {i === 1 && <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">Mid-Range</span>}
                  {i === 2 && <span className="px-2 py-1 text-xs bg-gold-500/20 text-yellow-300 rounded-full">Premium</span>}
                </div>
                
                {item.price && (
                  <div className="mb-4 p-2 bg-gray-800/50 rounded">
                    <span className="text-green-400 font-medium">Price:</span> {item.price}
                  </div>
                )}
                
                <div className="mb-4">
                  <h5 className="text-purple-200 font-medium mb-2">Key Features</h5>
                  <ul className="list-none space-y-2">
                    {item.features?.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {item.pros && item.pros.length > 0 && (
                    <div>
                      <h5 className="text-green-400 font-medium mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pros
                      </h5>
                      <ul className="list-none space-y-2">
                        {item.pros.map((pro, j) => (
                          <li key={j} className="flex items-start text-green-300">
                            <span className="text-green-400 mr-2">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.cons && item.cons.length > 0 && (
                    <div>
                      <h5 className="text-red-400 font-medium mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Cons
                      </h5>
                      <ul className="list-none space-y-2">
                        {item.cons.map((con, j) => (
                          <li key={j} className="flex items-start text-red-300">
                            <span className="text-red-400 mr-2">-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {item.best_for && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h5 className="text-purple-200 font-medium mb-2">Best For</h5>
                    <p className="text-gray-300">{item.best_for}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Analysis */}
      {comparison.comparative_analysis && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Comparative Analysis</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{comparison.comparative_analysis}</p>
        </div>
      )}

      {/* Winner */}
      {comparison.winner && (
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-lg border border-purple-500/50">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Winner</h3>
          <p className="text-purple-200 font-medium">{comparison.winner}</p>
        </div>
      )}
    </div>
  );
}
