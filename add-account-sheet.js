// Script to add ultimateAccount sheet to testdata.xlsx
// Run with: node add-account-sheet.js

import XLSX from 'xlsx';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to testdata.xlsx
const filePath = resolve(__dirname, './test-data/testdata.xlsx');

// Sample data for ultimateAccount sheet
const ultimateAccountData = [
  {
    TestCaseID: 'ACC001',
    TestDescription: 'Update account with Employee Loan Solutions company, Ms title, and Hongkong timezone',
    Username: 'soundarya.lalithac@gmail.com',
    Password: 'Paswrd@123#',
    Company: 'Employee Loan Solutions',
    ProfessionalTitle: 'Ms.',
    Timezone: 'Hongkong',
    ExpectedResult: 'PASS',
    Execute: 'Y'
  },
  {
    TestCaseID: 'ACC002',
    TestDescription: 'Verify account settings can be updated with different values',
    Username: 'soundarya.lalithac@gmail.com',
    Password: 'Paswrd@123#',
    Company: 'Employee Loan Solutions',
    ProfessionalTitle: 'Ms.',
    Timezone: 'Hongkong',
    ExpectedResult: 'PASS',
    Execute: 'Y'
  }
];

try {
  // Read existing workbook
  const workbook = XLSX.readFile(filePath);
  
  // Create new sheet with ultimateAccount data
  const newSheet = XLSX.utils.json_to_sheet(ultimateAccountData);
  
  // Add or update the ultimateAccount sheet
  workbook.Sheets['ultimateAccount'] = newSheet;
  
  // Ensure ultimateAccount is in SheetNames (add if not exists)
  if (!workbook.SheetNames.includes('ultimateAccount')) {
    workbook.SheetNames.push('ultimateAccount');
  }
  
  // Write the updated workbook back to file
  XLSX.writeFile(workbook, filePath);
  
  console.log('✓ ultimateAccount sheet added/updated successfully!');
  console.log('Columns: TestCaseID, TestDescription, Username, Password, Company, ProfessionalTitle, Timezone, ExpectedResult, Execute');
  console.log(`Sample rows: ${ultimateAccountData.length}`);
  
} catch (error) {
  console.error('Error updating testdata.xlsx:', error.message);
}
