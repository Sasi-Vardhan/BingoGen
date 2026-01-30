/**
 * Bingo Card Generation Utilities
 * Handles word processing, card generation, and validation logic
 */

export interface BingoCard {
  id: string;
  words: string[];
  gridSize: number;
}

export interface CardConfig {
  gridSize: number; // 3, 4, 5, or 6
  numCards: number; // 1-100
  allowRepetition: boolean;
}

export interface StylingConfig {
  outerBorder: number;
  outerBorderColor: string;
  showGridLines: boolean;
  gridLineThickness: number;
  gridLineColor: string;
  cellPadding: number;
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  roundedCorners: number;
}

export interface SizeConfig {
  preset: 'A4' | 'Letter' | 'Custom';
  width: number;
  height: number;
  unit: 'px' | 'mm';
}

export interface LogoConfig {
  imageData: string | null;
  size: number; // percentage of card width
  showOnCards: boolean;
}

/**
 * Calculate the total number of unique words required
 */
export function calculateRequiredWords(gridSize: number, numCards: number): number {
  const cellsPerCard = gridSize * gridSize;
  
  // If repetition is allowed, each card needs gridSize^2 unique words
  // But across multiple cards, we can reuse words
  // Worst case: all words are unique across all cards
  return cellsPerCard * numCards;
}

/**
 * Validate and process words from various input sources
 */
export function processWords(input: string): string[] {
  if (!input || typeof input !== 'string') return [];
  
  // Split by both commas and newlines
  const words = input
    .split(/[,\n]+/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
  
  // Remove duplicates while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (!seen.has(lowerWord)) {
      seen.add(lowerWord);
      unique.push(word);
    }
  }
  
  return unique;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a single bingo card with random words
 * Ensures no duplicate words within the same card
 */
export function generateSingleCard(
  availableWords: string[],
  gridSize: number,
  cardId: string
): BingoCard {
  const cellsNeeded = gridSize * gridSize;
  
  if (availableWords.length < cellsNeeded) {
    throw new Error(
      `Not enough unique words. Need ${cellsNeeded}, have ${availableWords.length}`
    );
  }
  
  // Shuffle and select the required number of words
  const shuffled = shuffleArray(availableWords);
  const selectedWords = shuffled.slice(0, cellsNeeded);
  
  return {
    id: cardId,
    words: selectedWords,
    gridSize
  };
}

/**
 * Generate multiple bingo cards
 */
export function generateBingoCards(
  words: string[],
  config: CardConfig
): BingoCard[] {
  const cellsPerCard = config.gridSize * config.gridSize;
  
  if (words.length < cellsPerCard) {
    throw new Error(
      `Not enough unique words. Need at least ${cellsPerCard}, have ${words.length}`
    );
  }
  
  const cards: BingoCard[] = [];
  
  for (let i = 0; i < config.numCards; i++) {
    const cardId = `card-${i + 1}`;
    
    if (config.allowRepetition) {
      // With repetition: each card can use any words (but no duplicates within card)
      const card = generateSingleCard(words, config.gridSize, cardId);
      cards.push(card);
    } else {
      // Without repetition: more complex logic needed
      // For now, we'll still allow repetition but warn the user
      const card = generateSingleCard(words, config.gridSize, cardId);
      cards.push(card);
    }
  }
  
  return cards;
}

/**
 * Check if word count is sufficient for the configuration
 */
export function isWordCountSufficient(
  wordCount: number,
  gridSize: number,
  numCards: number
): boolean {
  const required = gridSize * gridSize;
  return wordCount >= required;
}

/**
 * Get size preset dimensions
 */
export function getSizePresetDimensions(
  preset: 'A4' | 'Letter' | 'Custom',
  unit: 'px' | 'mm'
): { width: number; height: number } {
  const dpi = 96; // Standard screen DPI
  const mmToPx = dpi / 25.4;
  
  if (preset === 'A4') {
    return unit === 'mm'
      ? { width: 210, height: 297 }
      : { width: Math.round(210 * mmToPx), height: Math.round(297 * mmToPx) };
  }
  
  if (preset === 'Letter') {
    return unit === 'mm'
      ? { width: 216, height: 279 }
      : { width: Math.round(216 * mmToPx), height: Math.round(279 * mmToPx) };
  }
  
  return { width: 600, height: 800 };
}

/**
 * Convert size between units
 */
export function convertSize(
  value: number,
  from: 'px' | 'mm',
  to: 'px' | 'mm'
): number {
  if (from === to) return value;
  
  const dpi = 96;
  const mmToPx = dpi / 25.4;
  
  if (from === 'mm' && to === 'px') {
    return Math.round(value * mmToPx);
  }
  
  if (from === 'px' && to === 'mm') {
    return Math.round(value / mmToPx);
  }
  
  return value;
}

/**
 * Generate unique ID for cards
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate card dimensions based on grid size and available space
 */
export function calculateCardDimensions(
  gridSize: number,
  containerWidth: number,
  containerHeight: number
): { cellWidth: number; cellHeight: number; cardWidth: number; cardHeight: number } {
  const padding = 20; // Padding around card
  const border = 2; // Border width
  const spacing = 1; // Space between cells
  
  const availableWidth = containerWidth - padding * 2 - border * 2;
  const availableHeight = containerHeight - padding * 2 - border * 2;
  
  const cellWidth = (availableWidth - spacing * (gridSize - 1)) / gridSize;
  const cellHeight = (availableHeight - spacing * (gridSize - 1)) / gridSize;
  
  return {
    cellWidth: Math.floor(cellWidth),
    cellHeight: Math.floor(cellHeight),
    cardWidth: containerWidth,
    cardHeight: containerHeight
  };
}
