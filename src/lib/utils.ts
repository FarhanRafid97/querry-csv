import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as monaco from 'monaco-editor';
import Papa from 'papaparse';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getKeyCombo = (event: monaco.IKeyboardEvent): string => {
  let combo = '';
  if (event.ctrlKey || event.metaKey) combo += 'Ctrl+';
  if (event.shiftKey) combo += 'Shift+';
  if (event.altKey) combo += 'Alt+';
  combo += event.keyCode;
  return combo;
};

// Load CSV into DuckDB
export const loadCSV = async (files: File) => {
  try {
    // Read file as text for Papa Parse
    const fileText = await files.text();

    // Parse CSV with Papa Parse to handle all delimiters automatically
    const parseResult = Papa.parse(fileText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: async (results) => {
        try {
          console.log('ini parseResult', results.data);
          // Convert parsed data back to CSV format for DuckDB
          const csvData = Papa.unparse(results.data, {
            header: true
          });
          const uint8Array = new TextEncoder().encode(csvData);
          const baseName = files.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
          const tableName = `csv_${baseName}`;

          return {
            data: csvData,
            dataBuffer: uint8Array,
            fileName: files.name,
            tableName: tableName
          };
        } catch (error) {
          console.error('Error parsing CSV:', error);
          throw error;
        }
      }
    });
    console.log('ini parseResult', parseResult);
    return parseResult;
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};

export function detectDelimiter(csvText: string, sample_size = 1000) {
  const sample = csvText.slice(0, sample_size);
  const delimiters = [',', ';', '\t', '|'];

  let maxCount = 0;
  let bestDelimiter = ',';

  delimiters.forEach((delimiter) => {
    const count = (sample.match(new RegExp('\\' + delimiter, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  });

  return bestDelimiter;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeColor = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'json':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'parquet':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'sql':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function readTableNameFromQuery(query: string): string {
  const match = query.match(/FROM\s+["'`]?(csv_[a-zA-Z0-9_]+)["'`]?/i);
  return match ? match[1] : '';
}
