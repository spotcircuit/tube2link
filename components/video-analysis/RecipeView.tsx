'use client';

import { EnrichedVideoMetadata, Recipe } from '@/types/openai';

interface RecipeViewProps {
  data: EnrichedVideoMetadata;
}

export default function RecipeView({ data }: RecipeViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment?.recipes || !Array.isArray(enrichment.recipes)) {
    return null;
  }

  const recipes: Recipe[] = enrichment.recipes;
  
  return (
    <div className="space-y-8">
      {recipes.map((recipe, idx) => (
        <section key={idx} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">{recipe.name}</h3>
          
          {/* Recipe Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {recipe.cook_time && (
              <div>
                <span className="text-purple-400 font-medium">Cook Time:</span>
                <p className="text-gray-300">{recipe.cook_time}</p>
              </div>
            )}
            {recipe.difficulty && (
              <div>
                <span className="text-purple-400 font-medium">Difficulty:</span>
                <p className="text-gray-300">{recipe.difficulty}</p>
              </div>
            )}
            {recipe.serving_size && (
              <div>
                <span className="text-purple-400 font-medium">Servings:</span>
                <p className="text-gray-300">{recipe.serving_size}</p>
              </div>
            )}
          </div>
          
          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-purple-300 mb-3">Ingredients</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient: string, i: number) => (
                  <li key={i} className="text-gray-300 flex items-center space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Key Steps */}
          {recipe.key_steps && recipe.key_steps.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-purple-300 mb-3">Instructions</h4>
              <ol className="space-y-2">
                {recipe.key_steps.map((step: string, i: number) => (
                  <li key={i} className="text-gray-300 flex items-start">
                    <span className="text-purple-400 mr-2">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-purple-300 mb-3">Tips</h4>
              <ul className="space-y-2">
                {recipe.tips.map((tip: string, i: number) => (
                  <li key={i} className="text-gray-300 flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
