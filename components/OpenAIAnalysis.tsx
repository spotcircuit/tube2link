'use client';

import React, { useState } from 'react';
import { EnrichedVideoMetadata } from '@/types/openai';
import TutorialView from './video-analysis/TutorialView';
import ComparisonView from './video-analysis/ComparisonView';
import ReviewView from './video-analysis/ReviewView';
import RecipeView from './video-analysis/RecipeView';
import NewsView from './video-analysis/NewsView';
import CommentaryView from './video-analysis/CommentaryView';
import SocialPostGenerator from './SocialPostGenerator';
import VideoMetadata from './VideoMetadata';

interface OpenAIAnalysisProps {
  data: EnrichedVideoMetadata;
  onReturn?: () => void;
  isToggled?: boolean;
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

export default function OpenAIAnalysis({ data, onReturn, isToggled = false }: OpenAIAnalysisProps) {
  return (
    <div className="space-y-8">
      {/* Core Summary Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-white">Core Summary</h2>
        <div className="space-y-6">
          {(data.core_summary as any)?.core_concepts && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-medium text-purple-300 mb-2">Core Concepts</h3>
              <p className="text-gray-200">{(data.core_summary as any).core_concepts}</p>
            </div>
          )}

          {Array.isArray((data.core_summary as any)?.key_insights) && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-medium text-purple-300 mb-2">Key Insights</h3>
              <ul className="space-y-2">
                {(data.core_summary as any).key_insights.map((insight: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-200">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {Array.isArray((data.extended_enrichment as any)?.tools_mentioned) &&
       (data.extended_enrichment as any).tools_mentioned.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-white">Tools & Resources</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ul className="space-y-2">
              {(data.extended_enrichment as any).tools_mentioned.map((tool: any, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span className="text-gray-200">{tool}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Video Type Specific Views */}
      {data.video_type && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-white">Type-Specific Analysis</h2>
          {data.video_type === 'tutorial' && <TutorialView data={data} />}
          {data.video_type === 'comparison' && <ComparisonView data={data} />}
          {data.video_type === 'review' && <ReviewView data={data} />}
          {data.video_type === 'recipe' && <RecipeView data={data} />}
          {data.video_type === 'news' && <NewsView data={data} />}
          {data.video_type === 'commentary' && <CommentaryView data={data} />}
        </section>
      )}

      {(data.extended_enrichment as any)?.recipe_details && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-white">Recipe Details</h2>
          <RecipeDetails recipe={(data.extended_enrichment as any).recipe_details} />
        </section>
      )}

      {(data.extended_enrichment as any)?.cooking_tips && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-white">Cooking Tips</h2>
          <CookingTips tips={(data.extended_enrichment as any).cooking_tips} />
        </section>
      )}

      <h2 className="text-xl font-bold mb-4 text-white">Generate Social Posts</h2>
      <SocialPostGenerator
        videoData={{
          title: data.title || '',
          url: data.url || '',
          description: data.description || '',
          channelTitle: data.channelTitle || '',
        }}
        onReturn={onReturn}
        onCopy={() => {}}
      />
    </div>
  );
}
