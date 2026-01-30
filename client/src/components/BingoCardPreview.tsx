/**
 * BingoCardPreview Component
 * Renders a single bingo card with customizable styling
 * Completely isolated from CSS variables to ensure PDF/PNG export compatibility
 */

import { BingoCard, StylingConfig, SizeConfig, LogoConfig } from '@/lib/bingoUtils';

interface BingoCardPreviewProps {
  card: BingoCard;
  styling: StylingConfig;
  logo: LogoConfig;
  sizeConfig: SizeConfig;
}

export default function BingoCardPreview({
  card,
  styling,
  logo,
  sizeConfig
}: BingoCardPreviewProps) {
  const containerHeight = sizeConfig.unit === 'px' ? sizeConfig.height : sizeConfig.height * 3.78;
  const containerWidth = sizeConfig.unit === 'px' ? sizeConfig.width : sizeConfig.width * 3.78;

  // Normalize colors to hex format - handles hex, named colors, and CSS variables
  const normalizeColor = (color: string): string => {
    // If already hex, return as-is
    if (color.startsWith('#')) return color;
    
    // Color name mapping
    const colorNames: Record<string, string> = {
      'white': '#FFFFFF',
      'black': '#000000',
      'transparent': 'transparent',
      'gray': '#808080',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000'
    };
    
    const lower = color.toLowerCase().trim();
    if (colorNames[lower]) return colorNames[lower];
    
    // If it's a CSS variable or oklch/rgb function, return a safe default
    if (color.includes('var(') || color.includes('oklch') || color.includes('rgb')) {
      return '#000000'; // Default to black for any unsupported format
    }
    
    return color;
  };

  // Create inline styles that don't reference any CSS variables
  const cardWrapperStyle: React.CSSProperties = {
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // Explicitly set all properties to avoid inheritance
    margin: 0,
    fontFamily: styling.fontFamily || 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
    border: `${styling.outerBorder}px solid ${normalizeColor(styling.outerBorderColor)}`,
    backgroundColor: normalizeColor(styling.backgroundColor),
    borderRadius: `${styling.roundedCorners}px`,
    color: normalizeColor(styling.fontColor)
  };

  const gridContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${card.gridSize}, 1fr)`,
    gap: `${styling.gridLineThickness}px`,
    flex: 1,
    marginBottom: logo.showOnCards ? '60px' : '0',
    width: '100%',
    height: 'auto',
    boxSizing: 'border-box'
  };

  const cellStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${styling.cellPadding}px`,
    backgroundColor: '#FFFFFF',
    border: styling.showGridLines 
      ? `${styling.gridLineThickness}px solid ${normalizeColor(styling.gridLineColor)}`
      : 'none',
    textAlign: 'center',
    fontSize: `${Math.max(10, 20 - card.gridSize * 2)}px`,
    fontWeight: 600,
    wordBreak: 'break-word',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: 'inherit'
  };

  const logoStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: `${Math.min(containerWidth * 0.3, 100)}px`,
    height: 'auto',
    maxHeight: '50px',
    objectFit: 'contain'
  };

  return (
    <div 
      style={cardWrapperStyle}
      data-card-element
    >
      {/* Grid of cells */}
      <div style={gridContainerStyle}>
        {card.words.map((word, index) => (
          <div key={index} style={cellStyle}>
            {word}
          </div>
        ))}
      </div>

      {/* Logo */}
      {logo.showOnCards && logo.imageData && (
        <img
          src={logo.imageData}
          alt="Card Logo"
          style={logoStyle}
        />
      )}
    </div>
  );
}
