import { EnrichedVideoMetadata } from '@/types/openai';

interface RecipeViewProps {
  data: EnrichedVideoMetadata;
}

export default function RecipeView({ data }: RecipeViewProps) {
  const { extended_enrichment: enrichment } = data;
  
  if (!enrichment || !('recipes' in enrichment)) {
    return null;
  }

  const { recipes } = enrichment;

  return (
    <div className="space-y-8">
      {/* Recipes */}
      {recipes?.map((recipe, idx) => (
        <section key={idx} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">{recipe.name}</h3>
          
          {/* Time and Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {recipe.cook_time && (
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <span className="text-purple-200 font-medium">Cook Time:</span>{' '}
                <span className="text-gray-200">{recipe.cook_time}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <span className="text-purple-200 font-medium">Difficulty:</span>{' '}
                <span className="text-gray-200">{recipe.difficulty}</span>
              </div>
            )}
            {recipe.serving_size && (
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <span className="text-purple-200 font-medium">Servings:</span>{' '}
                <span className="text-gray-200">{recipe.serving_size}</span>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Ingredients</h4>
              <ul className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start text-gray-200">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Steps */}
          {recipe.key_steps && recipe.key_steps.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Key Steps</h4>
              <ol className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                {recipe.key_steps.map((step, i) => (
                  <li key={i} className="flex items-start text-gray-200">
                    <span className="text-purple-400 mr-2">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Tips</h4>
              <ul className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                {recipe.tips.map((tip, i) => (
                  <li key={i} className="flex items-start text-gray-200">
                    <span className="text-purple-400 mr-2">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      {/* Cooking Notes */}
      {enrichment.cooking_notes && (
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">Cooking Notes</h3>
          
          {/* Equipment */}
          {enrichment.cooking_notes.equipment_needed && enrichment.cooking_notes.equipment_needed.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Equipment Needed</h4>
              <ul className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                {enrichment.cooking_notes.equipment_needed.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-200">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation Tips */}
          {enrichment.cooking_notes.preparation_tips && enrichment.cooking_notes.preparation_tips.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Preparation Tips</h4>
              <ul className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                {enrichment.cooking_notes.preparation_tips.map((tip, i) => (
                  <li key={i} className="flex items-start text-gray-200">
                    <span className="text-purple-400 mr-2">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Storage Info */}
          {enrichment.cooking_notes.storage_info && (
            <div>
              <h4 className="text-xl font-semibold mb-3 text-purple-200">Storage Information</h4>
              <div className="bg-gray-700/50 p-4 rounded-lg text-gray-200">
                {enrichment.cooking_notes.storage_info}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
