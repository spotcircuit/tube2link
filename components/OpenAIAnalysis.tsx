'use client';

import { EnrichedVideoMetadata } from '@/types/openai';
import TutorialView from './video-analysis/TutorialView';
import ComparisonView from './video-analysis/ComparisonView';
import ReviewView from './video-analysis/ReviewView';
import RecipeView from './video-analysis/RecipeView';
import NewsView from './video-analysis/NewsView';
import CommentaryView from './video-analysis/CommentaryView';

interface OpenAIAnalysisProps {
  data: EnrichedVideoMetadata;
  isToggled: boolean;
}

const RecipeDetails = ({ recipe }: { recipe: any }) => (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
    {recipe.prep_time && (
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div>
          <span className="font-medium">Prep Time:</span> {recipe.prep_time}
        </div>
        {recipe.cook_time && (
          <div>
            <span className="font-medium">Cook Time:</span> {recipe.cook_time}
          </div>
        )}
        {recipe.total_time && (
          <div>
            <span className="font-medium">Total Time:</span> {recipe.total_time}
          </div>
        )}
      </div>
    )}
    
    {recipe.serving_size && (
      <div className="mb-3">
        <span className="font-medium">Servings:</span> {recipe.serving_size}
      </div>
    )}

    {recipe.ingredients && recipe.ingredients.length > 0 && (
      <div className="mb-3">
        <h4 className="font-medium mb-1">Ingredients:</h4>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient: string, idx: number) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
      </div>
    )}

    {recipe.instructions && recipe.instructions.length > 0 && (
      <div className="mb-3">
        <h4 className="font-medium mb-1">Instructions:</h4>
        <ol className="list-decimal list-inside">
          {recipe.instructions.map((step: string, idx: number) => (
            <li key={idx} className="mb-1">{step}</li>
          ))}
        </ol>
      </div>
    )}

    {recipe.cooking_techniques && recipe.cooking_techniques.length > 0 && (
      <div className="mb-3">
        <h4 className="font-medium mb-1">Techniques Used:</h4>
        <div className="flex flex-wrap gap-2">
          {recipe.cooking_techniques.map((technique: string, idx: number) => (
            <span key={idx} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
              {technique}
            </span>
          ))}
        </div>
      </div>
    )}

    {recipe.dietary_categories && recipe.dietary_categories.length > 0 && (
      <div>
        <h4 className="font-medium mb-1">Dietary Information:</h4>
        <div className="flex flex-wrap gap-2">
          {recipe.dietary_categories.map((category: string, idx: number) => (
            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {category}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const CookingTips = ({ tips }: { tips: any }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Cooking Tips & Techniques</h3>
    {tips.general_tips && tips.general_tips.length > 0 && (
      <div className="mb-3">
        <h4 className="font-medium mb-1">General Tips:</h4>
        <ul className="list-disc list-inside">
          {tips.general_tips.map((tip: string, idx: number) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    )}
    {tips.pro_techniques && tips.pro_techniques.length > 0 && (
      <div className="mb-3">
        <h4 className="font-medium mb-1">Pro Techniques:</h4>
        <ul className="list-disc list-inside">
          {tips.pro_techniques.map((technique: string, idx: number) => (
            <li key={idx}>{technique}</li>
          ))}
        </ul>
      </div>
    )}
    {tips.time_saving_methods && tips.time_saving_methods.length > 0 && (
      <div>
        <h4 className="font-medium mb-1">Time-Saving Methods:</h4>
        <ul className="list-disc list-inside">
          {tips.time_saving_methods.map((method: string, idx: number) => (
            <li key={idx}>{method}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default function OpenAIAnalysis({ data, isToggled }: OpenAIAnalysisProps) {
  if (!isToggled) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Toggle OpenAI Analysis to view the enriched content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Raw JSON Response */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-300">OpenAI Analysis Response</h2>
        </div>
        <pre className="whitespace-pre-wrap text-gray-200 bg-gray-700/50 p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Core Summary Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Core Summary</h2>
        <div className="space-y-4">
          {/* Core Concepts */}
          <div>
            <h3 className="font-medium text-purple-200 mb-2">Core Concepts</h3>
            <p className="text-gray-300">{data.core_summary.core_concepts}</p>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="font-medium text-purple-200 mb-2">Key Insights</h3>
            <ul className="space-y-2">
              {data.core_summary.key_insights.map((insight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Short Content Details */}
          {(data.core_summary.main_subject || 
            data.core_summary.action_shown || 
            data.core_summary.content_context || 
            data.core_summary.content_purpose || 
            (data.core_summary.visual_elements && data.core_summary.visual_elements.length > 0) || 
            (data.core_summary.audio_elements && data.core_summary.audio_elements.length > 0) || 
            data.core_summary.call_to_action) && (
            <div className="space-y-4 mt-4">
              {/* Main Subject */}
              {data.core_summary.main_subject && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Main Subject</h3>
                  <p className="text-gray-300">{data.core_summary.main_subject}</p>
                </div>
              )}

              {/* Action Shown */}
              {data.core_summary.action_shown && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Action/Highlight</h3>
                  <p className="text-gray-300">{data.core_summary.action_shown}</p>
                </div>
              )}

              {/* Content Context */}
              {data.core_summary.content_context && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Context</h3>
                  <p className="text-gray-300">{data.core_summary.content_context}</p>
                </div>
              )}

              {/* Content Purpose */}
              {data.core_summary.content_purpose && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Purpose</h3>
                  <p className="text-gray-300">{data.core_summary.content_purpose}</p>
                </div>
              )}

              {/* Visual Elements */}
              {data.core_summary.visual_elements && data.core_summary.visual_elements.length > 0 && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Visual Elements</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.core_summary.visual_elements.map((element, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Elements */}
              {data.core_summary.audio_elements && data.core_summary.audio_elements.length > 0 && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Audio Elements</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.core_summary.audio_elements.map((element, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              {data.core_summary.call_to_action && (
                <div>
                  <h3 className="font-medium text-purple-200 mb-2">Call to Action</h3>
                  <p className="text-gray-300">{data.core_summary.call_to_action}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Tools & Resources Section */}
      {data.extended_enrichment && 
       'tools_mentioned' in data.extended_enrichment && 
       data.extended_enrichment.tools_mentioned && 
       data.extended_enrichment.tools_mentioned.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Tools & Resources</h2>
          <div className="space-y-4">
            {data.extended_enrichment.tools_mentioned.map((tool, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{tool.name}</h3>
                <p className="text-gray-600">{tool.description}</p>
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recipe Details Section */}
      {data.extended_enrichment && 
       'recipe_details' in data.extended_enrichment && 
       data.extended_enrichment.recipe_details && (
        <section>
          <h2 className="text-xl font-bold mb-4">Recipes</h2>
          {data.extended_enrichment.recipe_details.cuisine_type && (
            <div className="mb-4">
              <span className="font-medium">Cuisine Type:</span> {data.extended_enrichment.recipe_details.cuisine_type}
            </div>
          )}
          {data.extended_enrichment.recipe_details.skill_level && (
            <div className="mb-4">
              <span className="font-medium">Skill Level:</span> {data.extended_enrichment.recipe_details.skill_level}
            </div>
          )}
          {data.extended_enrichment.recipe_details.recipes.map((recipe, idx) => (
            <RecipeDetails key={idx} recipe={recipe} />
          ))}
        </section>
      )}

      {/* Cooking Tips Section */}
      {data.extended_enrichment && 
       'cooking_tips' in data.extended_enrichment && 
       data.extended_enrichment.cooking_tips && (
        <CookingTips tips={data.extended_enrichment.cooking_tips} />
      )}

      {/* Video Type Specific Views */}
      {data?.video_type === 'tutorial' && <TutorialView data={data} />}
      {data?.video_type === 'recipe' && <RecipeView data={data} />}
      {data?.video_type === 'comparison' && <ComparisonView data={data} />}
      {data?.video_type === 'review' && <ReviewView data={data} />}
      {data?.video_type === 'news' && <NewsView data={data} />}
      {data?.video_type === 'commentary' && <CommentaryView data={data} />}
    </div>
  );
}
