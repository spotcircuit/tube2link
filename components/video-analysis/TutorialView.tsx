'use client';

import { EnrichedVideoMetadata } from '@/types/openai';

interface TutorialViewProps {
  data: EnrichedVideoMetadata;
}

export default function TutorialView({ data }: TutorialViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment || !('tutorial_details' in enrichment)) {
    return null;
  }

  const { tutorial_details } = enrichment;
  
  return (
    <div className="space-y-8">
      {/* Prerequisites & Learning Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorial_details.prerequisites && tutorial_details.prerequisites.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              {tutorial_details.prerequisites.map((prereq, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-200">{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tutorial_details.learning_objectives && tutorial_details.learning_objectives.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Learning Objectives</h3>
            <ul className="space-y-2">
              {tutorial_details.learning_objectives.map((objective, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-200">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Steps */}
      {tutorial_details.steps && tutorial_details.steps.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-6">Step-by-Step Guide</h3>
          <div className="space-y-6">
            {tutorial_details.steps.map((step, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-300 text-sm">{i + 1}</span>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-purple-200">{step.title}</h4>
                    {step.timestamp && (
                      <span className="text-sm text-gray-400">@{step.timestamp}</span>
                    )}
                  </div>
                  <p className="text-gray-200">{step.description}</p>
                  {step.key_points && step.key_points.length > 0 && (
                    <div className="mt-3 bg-gray-800/50 p-3 rounded">
                      <h5 className="text-sm font-medium text-purple-200 mb-2">Key Points:</h5>
                      <ul className="space-y-1">
                        {step.key_points.map((point, j) => (
                          <li key={j} className="flex items-start text-sm">
                            <span className="text-purple-400 mr-2">•</span>
                            <span className="text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.code_snippet && (
                    <pre className="mt-3 p-3 bg-gray-800/50 rounded text-sm overflow-x-auto">
                      <code className="text-gray-200">{step.code_snippet}</code>
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices & Common Pitfalls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorial_details.best_practices && tutorial_details.best_practices.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Best Practices</h3>
            <ul className="space-y-2">
              {tutorial_details.best_practices.map((practice, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-200">{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tutorial_details.common_pitfalls && tutorial_details.common_pitfalls.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Common Pitfalls</h3>
            <ul className="space-y-2">
              {tutorial_details.common_pitfalls.map((pitfall, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">⚠️</span>
                  <span className="text-gray-200">{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resources */}
      {tutorial_details.resources && tutorial_details.resources.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorial_details.resources.map((resource, i) => (
              <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-medium text-purple-200">{resource.name}</h4>
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                    {resource.type}
                  </span>
                </div>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-purple-400 hover:text-purple-300"
                  >
                    <span>Visit Resource</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
