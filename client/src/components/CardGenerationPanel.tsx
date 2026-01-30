/**
 * CardGenerationPanel Component
 * Displays generated cards and provides download options
 */

import { Download, RotateCcw, FileText, Images, Archive } from 'lucide-react';
import { BingoCard } from '@/lib/bingoUtils';

interface CardGenerationPanelProps {
  cards: BingoCard[];
  onExportPDF: () => Promise<void>;
  onExportPNGs: () => Promise<void>;
  onExportZIP: () => Promise<void>;
  onRegenerate: () => void;
}

export default function CardGenerationPanel({
  cards,
  onExportPDF,
  onExportPNGs,
  onExportZIP,
  onRegenerate
}: CardGenerationPanelProps) {
  return (
    <div className="space-y-4">
      {/* Cards Generated Info */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-bold text-green-900">{cards.length} bingo card(s)</span> generated successfully!
        </p>
      </div>

      {/* Download Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Download Options</h3>

        <button
          onClick={onExportPDF}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
        >
          <FileText className="w-4 h-4" />
          Download PDF (All Cards)
        </button>

        <button
          onClick={onExportPNGs}
          className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
        >
          <Images className="w-4 h-4" />
          Download PNGs (Individual Files)
        </button>

        <button
          onClick={onExportZIP}
          className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
        >
          <Archive className="w-4 h-4" />
          Download ZIP (All PNGs)
        </button>
      </div>

      {/* Regenerate Option */}
      <button
        onClick={onRegenerate}
        className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Regenerate Cards
      </button>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-2">📋 Download Information:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li><strong>PDF:</strong> One card per page, print-ready</li>
          <li><strong>PNGs:</strong> High-resolution images for each card</li>
          <li><strong>ZIP:</strong> All PNGs compressed in one file</li>
        </ul>
      </div>
    </div>
  );
}
