import { useState } from 'react';

interface ComparisonAnalysis {
  overview: {
    category: string;
    type: string;
    targetAudience: string[];
    criteria: string[];
  };
  products: Array<{
    name: string;
    brand: string;
    keyFeatures: Array<{
      name: string;
      rating: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    bestFor: string[];
  }>;
  comparisonDetails: Array<{
    feature: string;
    importance: string;
    winner: string;
    keyDifferences: string[];
  }>;
  value: {
    priceComparison: string;
    bestValue: {
      product: string;
      reasoning: string;
    };
    recommendations: Array<{
      for: string;
      product: string;
      reason: string;
    }>;
    keyTakeaways: string[];
  };
}

interface ProductComparisonProps {
  analysis: ComparisonAnalysis;
  onUseInPost?: (content: string) => void;
}

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultCollapsed?: boolean;
}

export default function ProductComparison({ analysis, onUseInPost }: ProductComparisonProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'overview': false,
    'products': false,
    'comparison': false,
    'value': false,
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="bg-black/30 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Category:</span>
            <span className="text-gray-200">{analysis.overview.category}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Type:</span>
            <span className="text-gray-200">{analysis.overview.type}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Target Audience:</span>
            <ul className="text-gray-200 list-disc ml-4">
              {analysis.overview.targetAudience.map((audience, i) => (
                <li key={i}>{audience}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Criteria:</span>
            <ul className="text-gray-200 list-disc ml-4">
              {analysis.overview.criteria.map((criterion, i) => (
                <li key={i}>{criterion}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'products',
      title: 'Products',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.products.map((product, i) => (
            <div key={i} className="bg-black/30 p-4 rounded-lg">
              <div className="text-xl font-medium text-purple-300">{product.name}</div>
              <div className="text-sm text-gray-400">by {product.brand}</div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <div className="font-medium text-purple-200 mb-2">Key Features</div>
                  {product.keyFeatures.map((feature, j) => (
                    <div key={j} className="mb-3 bg-black/20 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-purple-300">{feature.rating}</span>
                      </div>
                      <div className="text-sm text-gray-300 mt-1">{feature.description}</div>
                      <ul className="text-sm text-green-400 mt-1 space-y-1">
                        {feature.strengths.map((strength, k) => (
                          <li key={k}>{strength}</li>
                        ))}
                      </ul>
                      <ul className="text-sm text-red-400 mt-1 space-y-1">
                        {feature.weaknesses.map((weakness, k) => (
                          <li key={k}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="font-medium text-purple-200 mb-2">Best For</div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {product.bestFor.map((use, j) => (
                      <li key={j}>{use}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'comparison',
      title: 'Comparison Details',
      content: (
        <div className="space-y-4">
          {analysis.comparisonDetails.map((detail, i) => (
            <div key={i} className="bg-black/30 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-purple-300 font-medium">{detail.feature}</span>
                <span className="text-gray-400">(Importance: {detail.importance})</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-300 font-medium w-32">Winner:</span>
                <span className="text-gray-200">{detail.winner}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-300 font-medium w-32">Key Differences:</span>
                <ul className="text-gray-200 list-disc ml-4">
                  {detail.keyDifferences.map((diff, j) => (
                    <li key={j}>{diff}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'value',
      title: 'Value & Conclusion',
      content: (
        <div className="bg-black/30 p-4 rounded-lg space-y-4">
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Price Comparison:</span>
            <span className="text-gray-200">{analysis.value.priceComparison}</span>
          </div>
          <div className="space-y-2">
            <span className="text-purple-300 font-medium">Best Value:</span>
            <div className="ml-4 space-y-2">
              <div className="text-gray-200">{analysis.value.bestValue.product}</div>
              <div className="text-gray-300">{analysis.value.bestValue.reasoning}</div>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-purple-300 font-medium">Recommendations:</span>
            {analysis.value.recommendations.map((rec, i) => (
              <div key={i} className="ml-4 bg-black/20 p-3 rounded-lg">
                <div className="text-purple-200">For {rec.for}:</div>
                <div className="text-gray-200">{rec.product}</div>
                <div className="text-gray-300">{rec.reason}</div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-300 font-medium w-32">Key Takeaways:</span>
            <ul className="text-gray-200 list-disc ml-4">
              {analysis.value.keyTakeaways.map((takeaway, i) => (
                <li key={i}>{takeaway}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.id} className="space-y-2">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center gap-2 text-lg font-medium text-purple-300 hover:text-purple-200"
          >
            <span>{section.title}</span>
            <span className="text-sm text-gray-400">
              {collapsedSections[section.id] ? '(Show)' : '(Hide)'}
            </span>
          </button>
          {!collapsedSections[section.id] && section.content}
        </div>
      ))}
    </div>
  );
}
