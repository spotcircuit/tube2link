import { PreprocessedData } from './preprocessor';

export function splitText(text: string, chunkSize: number = 50000): string[] {
  // Split text into chunks (using sentences to be more natural)
  const sentences = text.replace('!', '.').replace('?', '.').split('.');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (currentSize + trimmed.length > chunkSize) {
      chunks.push(currentChunk.join('. '));
      currentChunk = [trimmed];
      currentSize = trimmed.length;
    } else {
      currentChunk.push(trimmed);
      currentSize += trimmed.length + 2; // +2 for '. '
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('. '));
  }

  return chunks;
}

export function mergeGeneratedContent(contents: string[]): string {
  // Join with separator to maintain readability
  return contents.join('\n\n---\n\n');
}

export function mergePreprocessedData(target: PreprocessedData, source: PreprocessedData) {
  // Merge the most important patterns and semantic analysis
  if (source.patterns) {
    // Get top key points and examples
    if (source.patterns.key_points) {
      target.patterns.key_points = [...new Set([...target.patterns.key_points, ...source.patterns.key_points])];
    }
    if (source.patterns.examples) {
      target.patterns.examples = [...new Set([...target.patterns.examples, ...source.patterns.examples])];
    }
    if (source.patterns.lists) {
      target.patterns.lists = [...new Set([...target.patterns.lists, ...source.patterns.lists])];
    }
    if (source.patterns.code_blocks) {
      target.patterns.code_blocks = [...new Set([...target.patterns.code_blocks, ...source.patterns.code_blocks])];
    }
  }

  // Merge semantic analysis, keeping only high importance items
  if (source.semantic) {
    if (source.semantic.actions) {
      const actions = source.semantic.actions.filter((a) => a.importance > 0.25);
      target.semantic.actions = [...target.semantic.actions, ...actions];
    }
    if (source.semantic.problems) {
      const problems = source.semantic.problems.filter((p) => p.importance > 0.25);
      target.semantic.problems = [...target.semantic.problems, ...problems];
    }
    if (source.semantic.comparisons) {
      const comparisons = source.semantic.comparisons.filter((c) => c.importance > 0.25);
      target.semantic.comparisons = [...target.semantic.comparisons, ...comparisons];
    }
  }

  // Merge role-based content
  if (source.roles) {
    if (source.roles.user) {
      target.roles.user = [...new Set([...target.roles.user, ...source.roles.user])];
    }
    if (source.roles.developer) {
      target.roles.developer = [...new Set([...target.roles.developer, ...source.roles.developer])];
    }
  }
}
