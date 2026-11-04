// tests/helpers/excelReader.ts
// ─────────────────────────────────────────────
// Utility to read test data from Excel files
// ─────────────────────────────────────────────

import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Lightweight type for a row read from Excel
type TestRow = Record<string, any>;

/**
 * Read all rows from a specific sheet in an Excel file
 * @param {string} fileName - Excel file name (inside /test-data folder)
 * @param {string} sheetName - Sheet name to read
 * @returns {Array<Object>} Array of row objects
 */


export function readExcelData(fileName:string, sheetName:string): TestRow[] {
 const filePath = path.join(__dirname, '../../test-data', fileName);

  console.log('Reading xl file', filePath);
  console.log('sheet name', sheetName);

  const workbook = XLSX.readFile(filePath);

if (!workbook.SheetNames.includes(sheetName)) {
    throw new Error(`Sheet "${sheetName}" not found in "${fileName}". Available sheets: ${workbook.SheetNames.join(', ')}`);
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as TestRow[];
  return rows;
}

/**
 * Filter only rows where "Execute" column is "Yes" (or "Y")
 * Allows you to turn specific test cases on/off from Excel
 * @param {Array<Object>} rows
 * @returns {Array<Object>}
 */
export function filterActiveTests(rows: TestRow[]):  TestRow[] {
  return rows.filter(row => {
    const execute = String(row['Execute'] || row['execute'] || 'Yes').trim().toLowerCase();
    return execute === 'yes' || execute === 'y' || execute === 'true' || execute === '';
  });
}

/**
 * Get specific sheet data with active filter applied
 * @param {string} fileName
 * @param {string} sheetName
 * @returns {Array<Object>}
 */
export function getTestData(fileName:string, sheetName:string):TestRow[] {
  const allRows = readExcelData(fileName, sheetName);
  return filterActiveTests(allRows);
}


