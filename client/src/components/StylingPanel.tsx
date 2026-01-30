/**
 * StylingPanel Component
 * Allows users to customize card styling (borders, colors, fonts, etc.)
 */

import { StylingConfig } from '@/lib/bingoUtils';

interface StylingPanelProps {
  styling: StylingConfig;
  onStylingChange: (styling: StylingConfig) => void;
}

export default function StylingPanel({ styling, onStylingChange }: StylingPanelProps) {
  const fonts = ['Arial', 'Times New Roman', 'Poppins', 'Montserrat', 'Roboto'];

  const handleChange = (key: keyof StylingConfig, value: any) => {
    onStylingChange({ ...styling, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Card Border Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Card Border</h3>
        
        <div>
          <label className="label-text">Outer Border Thickness: {styling.outerBorder}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={styling.outerBorder}
            onChange={(e) => handleChange('outerBorder', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div>
          <label className="label-text">Border Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={styling.outerBorderColor}
              onChange={(e) => handleChange('outerBorderColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={styling.outerBorderColor}
              onChange={(e) => handleChange('outerBorderColor', e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </div>
      </div>

      <div className="gradient-divider"></div>

      {/* Grid & Cell Styling */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Grid & Cells</h3>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showGridLines"
            checked={styling.showGridLines}
            onChange={(e) => handleChange('showGridLines', e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-cyan-600"
          />
          <label htmlFor="showGridLines" className="text-sm text-gray-700 cursor-pointer font-medium">
            Show Grid Lines
          </label>
        </div>

        <div>
          <label className="label-text">Grid Line Thickness: {styling.gridLineThickness}px</label>
          <input
            type="range"
            min="0"
            max="5"
            value={styling.gridLineThickness}
            onChange={(e) => handleChange('gridLineThickness', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>

        <div>
          <label className="label-text">Grid Line Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={styling.gridLineColor}
              onChange={(e) => handleChange('gridLineColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={styling.gridLineColor}
              onChange={(e) => handleChange('gridLineColor', e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Cell Padding: {styling.cellPadding}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={styling.cellPadding}
            onChange={(e) => handleChange('cellPadding', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
      </div>

      <div className="gradient-divider"></div>

      {/* Typography & Colors */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Typography & Colors</h3>

        <div>
          <label className="label-text">Font Family</label>
          <select
            value={styling.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="input-field"
          >
            {fonts.map(font => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text">Font Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={styling.fontColor}
              onChange={(e) => handleChange('fontColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={styling.fontColor}
              onChange={(e) => handleChange('fontColor', e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Card Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={styling.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={styling.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </div>
      </div>

      <div className="gradient-divider"></div>

      {/* Shape */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Shape</h3>

        <div>
          <label className="label-text">Rounded Corners: {styling.roundedCorners}px</label>
          <input
            type="range"
            min="0"
            max="30"
            value={styling.roundedCorners}
            onChange={(e) => handleChange('roundedCorners', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
      </div>

      {/* Preview of current styling */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 font-semibold mb-3">STYLING PREVIEW</p>
        <div
          style={{
            border: `${styling.outerBorder}px solid ${styling.outerBorderColor}`,
            backgroundColor: styling.backgroundColor,
            borderRadius: `${styling.roundedCorners}px`,
            padding: '12px',
            fontFamily: styling.fontFamily,
            color: styling.fontColor,
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Sample Text
        </div>
      </div>
    </div>
  );
}
