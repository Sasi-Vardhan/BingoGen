/**
 * GridSizeSelector Component
 * Allows users to select grid size (3x3 to 6x6) and number of cards (1-100)
 */

import { Grid3x3, Grid2x2 } from 'lucide-react';

interface GridSizeSelectorProps {
  gridSize: number;
  numCards: number;
  onGridSizeChange: (size: number) => void;
  onNumCardsChange: (num: number) => void;
}

export default function GridSizeSelector({
  gridSize,
  numCards,
  onGridSizeChange,
  onNumCardsChange
}: GridSizeSelectorProps) {
  const gridSizes = [3, 4, 5, 6];

  return (
    <div className="space-y-6">
      {/* Grid Size Selection */}
      <div>
        <label className="label-text">Grid Size</label>
        <div className="grid grid-cols-4 gap-3">
          {gridSizes.map(size => (
            <button
              key={size}
              onClick={() => onGridSizeChange(size)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold text-lg ${
                gridSize === size
                  ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-cyan-300'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Each card will have {gridSize * gridSize} cells
        </p>
      </div>

      {/* Number of Cards Selection */}
      <div>
        <label className="label-text">Number of Cards</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="100"
            value={numCards}
            onChange={(e) => onNumCardsChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={numCards}
              onChange={(e) => onNumCardsChange(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="input-field w-20 text-center"
            />
            <span className="text-sm text-gray-600 font-medium">cards</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can generate between 1 and 100 cards
        </p>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Total cells needed:</span> {gridSize * gridSize * numCards} cells
        </p>
      </div>
    </div>
  );
}
