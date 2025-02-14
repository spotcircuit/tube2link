'use client';

import { EnrichedVideoMetadata, TutorialDetails } from '@/types/openai';

interface TutorialViewProps {
  data: EnrichedVideoMetadata;
}

export default function TutorialView({ data }: TutorialViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.tutorial_details) {
    return null;
  }

  const tutorial: TutorialDetails = enrichment.tutorial_details;
  
  return (
    <div className="space-y-6">
      {/* Prerequisites & Learning Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              {tutorial.prerequisites.map((prereq, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tutorial.learning_objectives && tutorial.learning_objectives.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Learning Objectives</h3>
            <ul className="space-y-2">
              {tutorial.learning_objectives.map((objective, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tutorial Steps */}
      {tutorial.steps && tutorial.steps.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-6">Tutorial Steps</h3>
          <div className="space-y-8">
            {tutorial.steps.map((step, i) => (
              <div key={i} className="border-l-2 border-purple-400 pl-4">
                <div className="flex items-center mb-2">
                  <span className="text-purple-300 font-semibold mr-2">Step {i + 1}:</span>
                  <h4 className="text-lg font-medium text-purple-200">{step.title}</h4>
                  {step.timestamp && (
                    <span className="ml-2 text-sm text-gray-400">[{step.timestamp}]</span>
                  )}
                </div>
                <p className="text-gray-300 mb-3">{step.description}</p>
                {step.code_snippet && (
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-gray-300">{step.code_snippet}</code>
                  </pre>
                )}
                {step.key_points && step.key_points.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-purple-300 mb-2">Key Points:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {step.key_points.map((point, j) => (
                        <li key={j} className="text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      {tutorial.best_practices && tutorial.best_practices.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Best Practices</h3>
          <ul className="space-y-2">
            {tutorial.best_practices.map((practice, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span className="text-gray-300">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Pitfalls */}
      {tutorial.common_pitfalls && tutorial.common_pitfalls.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Common Pitfalls</h3>
          <ul className="space-y-2">
            {tutorial.common_pitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-400 mr-2">⚠</span>
                <span className="text-gray-300">{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Resources */}
      {tutorial.resources && tutorial.resources.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Additional Resources</h3>
          <ul className="space-y-3">
            {tutorial.resources.map((resource, i) => (
              <li key={i} className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <div>
                  <span className="text-gray-300">{resource.name}</span>
                  <span className="text-gray-400 text-sm ml-2">({resource.type})</span>
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 hover:text-purple-300 text-sm mt-1"
                    >
                      View Resource →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
