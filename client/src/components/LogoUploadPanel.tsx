/**
 * LogoUploadPanel Component
 * Allows users to upload and configure logo placement on cards
 */

import { Upload, Trash2 } from 'lucide-react';
import { LogoConfig } from '@/lib/bingoUtils';

interface LogoUploadPanelProps {
  logo: LogoConfig;
  onLogoChange: (logo: LogoConfig) => void;
}

export default function LogoUploadPanel({ logo, onLogoChange }: LogoUploadPanelProps) {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      alert('Please upload a PNG, JPG, or SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onLogoChange({
        ...logo,
        imageData,
        showOnCards: true
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onLogoChange({
      imageData: null,
      size: 20,
      showOnCards: false
    });
  };

  return (
    <div className="space-y-4">
      {!logo.imageData ? (
        <>
          {/* Upload Area */}
          <div>
            <label className="label-text">Upload Logo</label>
            <div
              onClick={() => document.getElementById('logo-input')?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload logo
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, or SVG (max 5MB)
              </p>
            </div>
            <input
              id="logo-input"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Logo Placement:</strong> Logos are placed at the bottom-center of each card and will not overlap the grid.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Logo Preview */}
          <div>
            <label className="label-text">Logo Preview</label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center h-32">
              <img
                src={logo.imageData}
                alt="Uploaded Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Logo Size Control */}
          <div>
            <label className="label-text">Logo Size: {logo.size}% of card width</label>
            <input
              type="range"
              min="5"
              max="40"
              value={logo.size}
              onChange={(e) =>
                onLogoChange({ ...logo, size: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Adjust the size to fit your card design
            </p>
          </div>

          {/* Show on Cards Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showLogo"
              checked={logo.showOnCards}
              onChange={(e) =>
                onLogoChange({ ...logo, showOnCards: e.target.checked })
              }
              className="w-4 h-4 rounded cursor-pointer accent-orange-500"
            />
            <label htmlFor="showLogo" className="text-sm text-gray-700 cursor-pointer font-medium">
              Show logo on all cards
            </label>
          </div>

          {/* Remove Logo Button */}
          <button
            onClick={handleRemoveLogo}
            className="w-full px-4 py-2 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove Logo
          </button>

          {/* Info Box */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Logo Placement:</strong> Your logo will appear at the bottom-center of each card.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
