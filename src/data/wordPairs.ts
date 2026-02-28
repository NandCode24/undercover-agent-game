import generatedWordPairs from "./generatedWordPairs.json";

export type WordPair = [string, string];
export type WordPairsByCategory = Record<string, WordPair[]>;

/**
 * Runtime validator to ensure each entry is exactly a tuple of two strings
 */
function isValidWordPair(pair: unknown): pair is WordPair {
  return (
    Array.isArray(pair) &&
    pair.length === 2 &&
    typeof pair[0] === "string" &&
    typeof pair[1] === "string"
  );
}

/**
 * Convert raw JSON (string[][]) safely into strict WordPair[][]
 */
function normalizeWordPairs(
  raw: Record<string, unknown>
): WordPairsByCategory {
  const normalized: WordPairsByCategory = {};

  Object.entries(raw).forEach(([category, pairs]) => {
    if (!Array.isArray(pairs)) return;

    normalized[category] = pairs.filter(isValidWordPair);
  });

  return normalized;
}

/**
 * Fully validated word database
 */
export const wordPairs: WordPairsByCategory =
  normalizeWordPairs(generatedWordPairs as Record<string, unknown>);

/**
 * Get all available categories
 */
export const getCategories = (): string[] => {
  return Object.keys(wordPairs);
};

/**
 * Get random category
 */
export const getRandomCategory = (): string => {
  const categories = getCategories();
  return categories[Math.floor(Math.random() * categories.length)];
};

/**
 * Get random word pair from category
 */
export const getRandomPair = (category?: string): WordPair => {
  const selectedCategory = category ?? getRandomCategory();
  const pairs = wordPairs[selectedCategory];

  if (!pairs || pairs.length === 0) {
    throw new Error("No word pairs found for category");
  }

  return pairs[Math.floor(Math.random() * pairs.length)];
};
