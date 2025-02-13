import { useState } from 'react';
import { ProductReviewAnalysis } from '@/lib/video/analysis/types';

interface ProductReviewProps {
  analysis: ProductReviewAnalysis;
  onUseInPost?: (content: string) => void;
}

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultCollapsed?: boolean;
}

export default function ProductReview({ analysis, onUseInPost }: ProductReviewProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'metadata': false,
    'product': false,
    'testing': true,
    'features': false,
    'experience': false,
    'verdict': false,
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections: Section[] = [
    {
      id: 'metadata',
      title: 'Overview',
      content: (
        <div className="bg-black/30 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Category:</span>
            <span className="text-gray-200">{analysis.metadata.category}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Review Type:</span>
            <span className="text-gray-200">{analysis.metadata.reviewType}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Target Audience:</span>
            <ul className="text-gray-200 list-disc ml-4">
              {analysis.metadata.targetAudience.map((audience: string, i: number) => (
                <li key={i}>{audience}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Testing Period:</span>
            <span className="text-gray-200">{analysis.metadata.testingPeriod}</span>
          </div>
        </div>
      )
    },
    {
      id: 'product',
      title: 'Product Details',
      content: (
        <div className="bg-black/30 p-4 rounded-lg space-y-4">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium text-purple-300">{analysis.product.name}</div>
            <div className="text-gray-400">by {analysis.product.brand}</div>
            <div className="text-sm text-gray-300">Model: {analysis.product.model}</div>
            <div className="text-sm text-gray-300">Released: {analysis.product.releaseDate}</div>
            <div className="text-lg text-green-400">{analysis.product.priceRange}</div>
          </div>

          <div className="mt-4">
            <div className="text-purple-300 font-medium mb-2">Specifications</div>
            <div className="space-y-2">
              {analysis.product.specs.map((spec: any, i: number) => (
                <div key={i} className="bg-black/20 p-2 rounded">
                  <div className="text-purple-200">{spec.category}</div>
                  <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                    {spec.details.map((detail: string, j: number) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testing',
      title: 'Testing & Performance',
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Test Methodology</div>
            <ul className="list-disc list-inside text-gray-200">
              {analysis.testing.methodology.map((method: string, i: number) => (
                <li key={i}>{method}</li>
              ))}
            </ul>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Test Scenarios</div>
            <div className="space-y-3">
              {analysis.testing.scenarios.map((scenario: any, i: number) => (
                <div key={i} className="bg-black/20 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-purple-200">{scenario.name}</div>
                    <div className="text-purple-300">{scenario.score}/10</div>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{scenario.description}</div>
                  <div className="text-sm text-gray-200 mt-1">{scenario.results}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Real-World Usage</div>
            <ul className="list-disc list-inside text-gray-200">
              {analysis.testing.realWorldUse.map((observation: string, i: number) => (
                <li key={i}>{observation}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Features',
      content: (
        <div className="space-y-3">
          {analysis.features.map((feature: any, i: number) => (
            <div key={i} className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-purple-300">{feature.name}</div>
                <div className="text-purple-200">{feature.rating}/10</div>
              </div>
              <div className="text-gray-200 mt-2">{feature.description}</div>
              <div className="text-gray-300 mt-1">{feature.performance}</div>
              
              {feature.highlights.length > 0 && (
                <div className="mt-2">
                  <div className="text-green-400 text-sm">Highlights:</div>
                  <ul className="list-disc list-inside text-gray-200 text-sm">
                    {feature.highlights.map((highlight: string, j: number) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feature.limitations.length > 0 && (
                <div className="mt-2">
                  <div className="text-red-400 text-sm">Limitations:</div>
                  <ul className="list-disc list-inside text-gray-200 text-sm">
                    {feature.limitations.map((limitation: string, j: number) => (
                      <li key={j}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'experience',
      title: 'User Experience',
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Highlights</div>
            <ul className="list-disc list-inside text-gray-200">
              {analysis.experience.highlights.map((highlight: string, i: number) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Pain Points</div>
            <ul className="list-disc list-inside text-gray-200">
              {analysis.experience.painPoints.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          {analysis.experience.comparedTo.length > 0 && (
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="text-purple-300 font-medium mb-2">Compared To</div>
              <div className="space-y-2">
                {analysis.experience.comparedTo.map((comparison: any, i: number) => (
                  <div key={i} className="bg-black/20 p-2 rounded">
                    <div className="font-medium text-purple-200">{comparison.product}</div>
                    <div className="text-sm text-green-400 mt-1">+ {comparison.advantage}</div>
                    <div className="text-sm text-red-400">- {comparison.disadvantage}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'verdict',
      title: 'Verdict & Recommendations',
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-xl font-medium text-purple-300">Final Verdict</div>
              <div className="text-2xl text-purple-300">{analysis.verdict.rating}/10</div>
            </div>
            <div className="text-gray-200 mt-2">{analysis.verdict.summary}</div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-green-400 font-medium mb-1">Pros</div>
                <ul className="list-disc list-inside text-gray-200 text-sm">
                  {analysis.verdict.pros.map((pro: string, i: number) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-red-400 font-medium mb-1">Cons</div>
                <ul className="list-disc list-inside text-gray-200 text-sm">
                  {analysis.verdict.cons.map((con: string, i: number) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-purple-300 font-medium mb-2">Recommendations</div>
            <div className="space-y-2">
              {analysis.verdict.recommendations.map((rec: any, i: number) => (
                <div key={i} className="bg-black/20 p-2 rounded">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => onUseInPost?.(rec.reasoning)}
                      className="text-blue-400 hover:text-blue-300 text-sm mt-1"
                    >
                      Copy
                    </button>
                    <div>
                      <div>
                        <span className="text-purple-200">For {rec.userType}:</span>
                        <span className="ml-2 font-medium text-gray-200">{rec.recommendation}</span>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">{rec.reasoning}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysis.verdict.alternatives.length > 0 && (
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="text-purple-300 font-medium mb-2">Alternatives to Consider</div>
              <div className="space-y-2">
                {analysis.verdict.alternatives.map((alt: any, i: number) => (
                  <div key={i} className="bg-black/20 p-2 rounded">
                    <div className="text-purple-200">{alt.product}</div>
                    <div className="text-sm text-gray-300 mt-1">{alt.whenPreferred}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 text-white">
      {sections.map(section => (
        <div key={section.id} className="bg-black/20 rounded-lg border border-white/10">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
          >
            <h3 className="text-lg font-medium">{section.title}</h3>
            <span className="text-purple-400">
              {collapsedSections[section.id] ? '▼' : '▲'}
            </span>
          </button>
          {!collapsedSections[section.id] && (
            <div className="p-4 pt-0">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
