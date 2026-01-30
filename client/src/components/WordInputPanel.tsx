/**
 * WordInputPanel Component
 * Handles manual word input and file uploads (CSV/XLSX)
 */

import { Upload, Trash2 } from 'lucide-react';
import { ParsedFileData } from '@/lib/fileUtils';

interface WordInputPanelProps {
  words: string[];
  wordInput: string;
  parsedFileData: ParsedFileData | null;
  selectedFileColumn: number;
  onWordInputChange: (input: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onColumnSelection: (columnIndex: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function WordInputPanel({
  words,
  wordInput,
  parsedFileData,
  selectedFileColumn,
  onWordInputChange,
  onFileUpload,
  onColumnSelection,
  fileInputRef
}: WordInputPanelProps) {
  return (
    <div className="space-y-4">
      {/* Tabs for input methods */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            !parsedFileData
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Manual Input
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            parsedFileData
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          File Upload
        </button>
      </div>

      {/* Manual Input Tab */}
      {!parsedFileData && (
        <div className="space-y-3">
          <div>
            <label className="label-text">Enter Words</label>
            <textarea
              value={wordInput}
              onChange={(e) => onWordInputChange(e.target.value)}
              placeholder="Enter words separated by commas or newlines&#10;Example:&#10;Apple, Banana, Cherry&#10;or&#10;Apple&#10;Banana&#10;Cherry"
              className="input-field h-32 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              You can use commas or line breaks to separate words
            </p>
          </div>
        </div>
      )}

      {/* File Upload Tab */}
      {!parsedFileData && (
        <div className="space-y-3">
          <div>
            <label className="label-text">Upload File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload CSV or XLSX file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: CSV, XLSX (Excel)
              </p>
            </div>
            <input
              ref={fileInputRef as React.RefObject<HTMLInputElement>}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={onFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* File Preview and Column Selection */}
      {parsedFileData && (
        <div className="space-y-3">
          <div>
            <label className="label-text">Select Column</label>
            <div className="flex gap-2 flex-wrap">
              {parsedFileData.columns.map((column, index) => (
                <button
                  key={index}
                  onClick={() => onColumnSelection(index)}
                  className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                    selectedFileColumn === index
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-700'
                      : 'border-gray-200 text-gray-700 hover:border-cyan-300'
                  }`}
                >
                  {column}
                </button>
              ))}
            </div>
          </div>

          {/* File Data Preview */}
          <div>
            <label className="label-text">Data Preview</label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {parsedFileData.columns.map((column, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedFileData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`border border-gray-300 px-3 py-2 ${
                            cellIndex === selectedFileColumn
                              ? 'bg-cyan-50 text-cyan-900 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedFileData.rows.length > 5 && (
              <p className="text-xs text-gray-500 mt-2">
                Showing 5 of {parsedFileData.rows.length} rows
              </p>
            )}
          </div>

          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Different File
          </button>
        </div>
      )}

      {/* Word Count Summary */}
      {words.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-semibold">{words.length} unique word(s)</span> loaded successfully
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {words.slice(0, 5).map((word, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
              >
                {word}
              </span>
            ))}
            {words.length > 5 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                +{words.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
