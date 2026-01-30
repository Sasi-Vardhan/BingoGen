/**
 * File Handling Utilities
 * Handles CSV/XLSX parsing and PDF/PNG export
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ParsedFileData {
  columns: string[];
  rows: string[][];
  selectedColumn: number;
}

/**
 * Parse CSV file and extract data
 */
export function parseCSVFile(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const rows = results.data as string[][];
        
        if (rows.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        // Get column headers (first row)
        const columns = rows[0].map((_, index) => `Column ${index + 1}`);
        
        // Extract data rows
        const dataRows = rows.slice(1);
        
        resolve({
          columns,
          rows: dataRows,
          selectedColumn: 0
        });
      },
      error: (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

/**
 * Parse XLSX file and extract data
 */
export function parseXLSXFile(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Parse sheet to JSON
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
        
        if (rows.length === 0) {
          reject(new Error('XLSX file is empty'));
          return;
        }
        
        // Get column headers
        const columns = rows[0].map((_, index) => `Column ${index + 1}`);
        
        // Extract data rows
        const dataRows = rows.slice(1);
        
        resolve({
          columns,
          rows: dataRows,
          selectedColumn: 0
        });
      } catch (error) {
        reject(new Error(`XLSX parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract words from parsed file data based on selected column
 */
export function extractWordsFromParsedData(
  data: ParsedFileData,
  columnIndex: number
): string[] {
  const words: string[] = [];
  
  for (const row of data.rows) {
    if (row[columnIndex]) {
      const word = String(row[columnIndex]).trim();
      if (word.length > 0) {
        words.push(word);
      }
    }
  }
  
  return words;
}

/**
 * Export bingo card to PNG using html2canvas
 */
export async function exportCardToPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (error) {
    throw new Error(`PNG export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export multiple bingo cards to PDF
 */
export async function exportCardsToPDF(
  cardElements: HTMLElement[],
  filename: string,
  layout: 'one-per-page' | 'multiple-per-page' = 'one-per-page'
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i];
      
      // Convert element to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      if (layout === 'one-per-page') {
        // One card per page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate dimensions to fit on page
        const margin = 10;
        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;
        
        const imgWidth = availWidth;
        const imgHeight = (canvas.height / canvas.width) * imgWidth;
        
        const yPos = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
      } else {
        // Multiple cards per page (2x2 grid)
        const cardsPerPage = 4;
        const cardIndex = i % cardsPerPage;
        
        if (cardIndex === 0 && i > 0) {
          pdf.addPage();
        }
        
        const cardWidth = (pageWidth - 20) / 2;
        const cardHeight = (pageHeight - 20) / 2;
        
        const col = cardIndex % 2;
        const row = Math.floor(cardIndex / 2);
        
        const xPos = 10 + col * (cardWidth + 5);
        const yPos = 10 + row * (cardHeight + 5);
        
        pdf.addImage(imgData, 'PNG', xPos, yPos, cardWidth, cardHeight);
      }
    }
    
    pdf.save(filename);
  } catch (error) {
    throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export multiple PNG files as ZIP
 */
export async function exportCardsAsZIP(
  cardElements: HTMLElement[],
  filename: string
): Promise<void> {
  try {
    // Dynamic import for JSZip
    const JSZip = (await import('jszip')).default as any;
    const zip = new (JSZip as any)();
    
    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i];
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgDataUrl = canvas.toDataURL('image/png');
      const base64Data = imgDataUrl.split(',')[1] || '';
      zip.file(`bingo-card-${i + 1}.png`, base64Data, { base64: true });
    }
    
    const blob = await (zip as any).generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    throw new Error(`ZIP export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  return validTypes.includes(file.type) || 
         file.name.endsWith('.csv') || 
         file.name.endsWith('.xlsx') ||
         file.name.endsWith('.xls');
}

/**
 * Download text file
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
