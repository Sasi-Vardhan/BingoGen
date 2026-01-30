/**
 * Bingo Card Generator - Main Application Page
 * Design: Modern Playful Utility
 * 
 * This is the primary interface for the bingo card generator.
 * It follows a progressive disclosure pattern:
 * 1. Grid size and number of cards selection
 * 2. Word input and validation
 * 3. Styling and customization
 * 4. Logo upload and placement
 * 5. Card generation and download
 */

import { useState, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle, Download, Eye, Plus, Trash2, RotateCcw } from 'lucide-react';
import {
  BingoCard,
  CardConfig,
  StylingConfig,
  SizeConfig,
  LogoConfig,
  calculateRequiredWords,
  processWords,
  generateBingoCards,
  isWordCountSufficient,
  getSizePresetDimensions,
  generateId
} from '@/lib/bingoUtils';
import {
  parseCSVFile,
  parseXLSXFile,
  extractWordsFromParsedData,
  exportCardToPNG,
  exportCardsToPDF,
  exportCardsAsZIP,
  isValidFileType,
  ParsedFileData
} from '@/lib/fileUtils';
import BingoCardPreview from '@/components/BingoCardPreview';
import GridSizeSelector from '@/components/GridSizeSelector';
import WordInputPanel from '@/components/WordInputPanel';
import StylingPanel from '@/components/StylingPanel';
import LogoUploadPanel from '@/components/LogoUploadPanel';
import CardGenerationPanel from '@/components/CardGenerationPanel';

export default function Home() {
  // Step 1: Grid Configuration
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    gridSize: 5,
    numCards: 1,
    allowRepetition: true
  });

  // Step 2: Word Management
  const [words, setWords] = useState<string[]>([]);
  const [wordInput, setWordInput] = useState<string>('');
  const [parsedFileData, setParsedFileData] = useState<ParsedFileData | null>(null);
  const [selectedFileColumn, setSelectedFileColumn] = useState<number>(0);

  // Step 3: Styling
  const [styling, setStyling] = useState<StylingConfig>({
    outerBorder: 3,
    outerBorderColor: '#1F2937',
    showGridLines: true,
    gridLineThickness: 1,
    gridLineColor: '#D1D5DB',
    cellPadding: 8,
    fontFamily: 'Poppins',
    fontColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    roundedCorners: 8
  });

  // Step 4: Size Configuration
  const [sizeConfig, setSizeConfig] = useState<SizeConfig>({
    preset: 'A4',
    width: 600,
    height: 800,
    unit: 'px'
  });

  // Step 5: Logo
  const [logo, setLogo] = useState<LogoConfig>({
    imageData: null,
    size: 20,
    showOnCards: false
  });

  // Generated Cards
  const [generatedCards, setGeneratedCards] = useState<BingoCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Preview
  const [previewZoom, setPreviewZoom] = useState(100);
  const [currentStep, setCurrentStep] = useState<'setup' | 'words' | 'styling' | 'logo' | 'generate'>('setup');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate required words
  const requiredWords = calculateRequiredWords(cardConfig.gridSize, cardConfig.numCards);
  const hasEnoughWords = isWordCountSufficient(words.length, cardConfig.gridSize, cardConfig.numCards);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      
      if (!isValidFileType(file)) {
        throw new Error('Please upload a CSV or XLSX file');
      }

      let fileData: ParsedFileData;

      if (file.name.endsWith('.csv')) {
        fileData = await parseCSVFile(file);
      } else {
        fileData = await parseXLSXFile(file);
      }

      setParsedFileData(fileData);
      setSelectedFileColumn(0);
      
      // Extract words from first column
      const extractedWords = extractWordsFromParsedData(fileData, 0);
      setWords(extractedWords);
      setSuccess(`Loaded ${extractedWords.length} words from file`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  // Handle manual word input
  const handleWordInputChange = (input: string) => {
    setWordInput(input);
    const processed = processWords(input);
    setWords(processed);
    setParsedFileData(null);
  };

  // Handle file column selection
  const handleColumnSelection = (columnIndex: number) => {
    if (!parsedFileData) return;
    setSelectedFileColumn(columnIndex);
    const extractedWords = extractWordsFromParsedData(parsedFileData, columnIndex);
    setWords(extractedWords);
  };

  // Generate bingo cards
  const handleGenerateCards = async () => {
    try {
      setError('');
      setSuccess('');
      setIsGenerating(true);

      if (!hasEnoughWords) {
        throw new Error(`Need at least ${requiredWords} unique words, but you have ${words.length}`);
      }

      const cards = generateBingoCards(words, cardConfig);
      setGeneratedCards(cards);
      setSuccess(`Generated ${cards.length} bingo card(s) successfully!`);
      setCurrentStep('generate');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cards');
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete a card
  const handleDeleteCard = (cardId: string) => {
    setGeneratedCards(generatedCards.filter(card => card.id !== cardId));
  };

  // Regenerate cards
  const handleRegenerateCards = () => {
    setGeneratedCards([]);
    handleGenerateCards();
  };

  // Export functions
  const handleExportPDF = async () => {
    try {
      setError('');
      const cardElements = document.querySelectorAll('[data-card-element]') as NodeListOf<HTMLElement>;
      
      if (cardElements.length === 0) {
        throw new Error('No cards to export');
      }

      await exportCardsToPDF(Array.from(cardElements), 'bingo-cards.pdf', 'one-per-page');
      setSuccess('PDF exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF');
    }
  };

  const handleExportPNGs = async () => {
    try {
      setError('');
      const cardElements = document.querySelectorAll('[data-card-element]') as NodeListOf<HTMLElement>;
      
      if (cardElements.length === 0) {
        throw new Error('No cards to export');
      }

      for (let i = 0; i < cardElements.length; i++) {
        await exportCardToPNG(cardElements[i], `bingo-card-${i + 1}.png`);
      }
      
      setSuccess('PNG files exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PNGs');
    }
  };

  const handleExportZIP = async () => {
    try {
      setError('');
      const cardElements = document.querySelectorAll('[data-card-element]') as NodeListOf<HTMLElement>;
      
      if (cardElements.length === 0) {
        throw new Error('No cards to export');
      }

      await exportCardsAsZIP(Array.from(cardElements), 'bingo-cards.zip');
      setSuccess('ZIP file exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export ZIP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            🎲 Bingo Card Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Create, customize, and download print-ready bingo cards in seconds
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 animate-bounce-check" />
            <div>
              <p className="text-green-800 font-semibold">Success</p>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Grid Size Selection */}
            <div className="card-section animate-slide-in-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2>Step 1: Configure Card Structure</h2>
                {cardConfig.gridSize && cardConfig.numCards && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Complete
                  </span>
                )}
              </div>
              <GridSizeSelector
                gridSize={cardConfig.gridSize}
                numCards={cardConfig.numCards}
                onGridSizeChange={(size: number) => setCardConfig({ ...cardConfig, gridSize: size })}
                onNumCardsChange={(num: number) => setCardConfig({ ...cardConfig, numCards: num })}
              />
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>For {cardConfig.numCards} card(s) of size {cardConfig.gridSize}×{cardConfig.gridSize}, you need at least <span className="font-bold text-blue-900">{requiredWords} unique words</span>.</strong>
                </p>
              </div>
            </div>

            <div className="gradient-divider"></div>

            {/* Step 2: Word Input */}
            <div className="card-section animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2>Step 2: Add Bingo Words</h2>
                {words.length > 0 && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    hasEnoughWords
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {hasEnoughWords ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {words.length} / {requiredWords}
                  </span>
                )}
              </div>
              <WordInputPanel
                words={words}
                wordInput={wordInput}
                parsedFileData={parsedFileData}
                selectedFileColumn={selectedFileColumn}
                onWordInputChange={handleWordInputChange}
                onFileUpload={handleFileUpload}
                onColumnSelection={handleColumnSelection}
                fileInputRef={fileInputRef}
              />
            </div>

            <div className="gradient-divider"></div>

            {/* Step 3: Styling */}
            <div className="card-section animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className="mb-4">Step 3: Customize Appearance</h2>
              <StylingPanel
                styling={styling}
                onStylingChange={setStyling}
              />
            </div>

            <div className="gradient-divider"></div>

            {/* Step 4: Logo Upload */}
            <div className="card-section animate-slide-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="mb-4">Step 4: Add Logo (Optional)</h2>
              <LogoUploadPanel
                logo={logo}
                onLogoChange={setLogo}
              />
            </div>

            <div className="gradient-divider"></div>

            {/* Step 5: Generate */}
            <div className="card-section animate-slide-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className="mb-4">Step 5: Generate & Download</h2>
              <div className="space-y-4">
                <button
                  onClick={handleGenerateCards}
                  disabled={!hasEnoughWords || isGenerating}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Bingo Cards'}
                </button>
                
                {generatedCards.length > 0 && (
                  <CardGenerationPanel
                    cards={generatedCards}
                    onExportPDF={handleExportPDF}
                    onExportPNGs={handleExportPNGs}
                    onExportZIP={handleExportZIP}
                    onRegenerate={handleRegenerateCards}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card-section animate-slide-in-up" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                  <div className="flex items-center gap-2">
                    {[50, 75, 100, 125].map(zoom => (
                      <button
                        key={zoom}
                        onClick={() => setPreviewZoom(zoom)}
                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                          previewZoom === zoom
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {zoom}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                  {generatedCards.length > 0 ? (
                    <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}>
                      <BingoCardPreview
                        card={generatedCards[0]}
                        styling={styling}
                        logo={logo}
                        sizeConfig={sizeConfig}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                      <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                {generatedCards.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-1">Generated Cards: {generatedCards.length}</p>
                    <p className="text-xs">Showing first card preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Cards Grid */}
        {generatedCards.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedCards.map((card, index) => (
                <div key={card.id} className="card-section">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Card {index + 1}</h3>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4" style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
                    <BingoCardPreview
                      card={card}
                      styling={styling}
                      logo={logo}
                      sizeConfig={sizeConfig}
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleExportPDF}
                      className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm">
            © 2026 Bingo Card Generator. Built with ❤️ for fun and learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
