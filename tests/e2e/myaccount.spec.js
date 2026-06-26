// tests/e2e/myaccount.spec.js
// ─────────────────────────────────────────────────────────────────
// Data-driven MyAccount tests — updates account settings
// Excel Sheet: "ultimateAccount"
// Columns: TestCaseID | TestDescription | Username | Password | Company | ProfessionalTitle | Timezone | ExpectedResult | Execute
// All data (including login credentials) comes from: "ultimateAccount" sheet
// ─────────────────────────────────────────────────────────────────

/**
 * Feature: Update My Account Settings
 * Application:  https://courses.ultimateqa.com/
 * Framework: Playwright + JavaScript
 * Pattern: Page Object Model
 * Coverage areas: Company selection, Professional title, Timezone updates
 */

import { test, expect } from '@playwright/test';
import { getTestData } from '../helpers/excelReader';
import { LoginPageObject } from '../helpers/LoginPageObject';
import { MyAccountPageObject } from '../helpers/MyAccountPageObject';
import { allure } from 'allure-playwright';

// Load test data from Excel sheet
const accountTestData = getTestData('testdata.xlsx', 'ultimateAccount');

test.describe('--- Update My Account Settings ---', () => {
  
  // Iterate through all account test cases
  for (const accountData of accountTestData) {
    test(`[${accountData.TestCaseID}] ${accountData.TestDescription}`, async ({ page }) => {
      
      // All data including login credentials come from ultimateAccount sheet

      // Allure parameters and annotations
      await allure.label('ALLURE_ID', String(accountData.TestCaseID));
      await allure.feature('Account Settings');
      await allure.story(accountData.TestDescription);
      await allure.owner('Lalitha');
      await allure.tag('AccountSettings', 'DataDriven');
      await allure.parameter('Username', accountData.Username);
      await allure.parameter('Company', accountData.Company);
      await allure.parameter('ProfessionalTitle', accountData.ProfessionalTitle);
      await allure.parameter('Timezone', accountData.Timezone);

      test.info().annotations.push(
        { type: 'TestCaseID', description: accountData.TestCaseID },
        { type: 'Test Description', description: accountData.TestDescription },
        { type: 'Expected Result', description: accountData.ExpectedResult },
      );

      console.log('Test Case ID:', accountData.TestCaseID);
      console.log('Username:', accountData.Username);
      console.log('Password:', accountData.Password);
      console.log('Company:', accountData.Company);
      console.log('Professional Title:', accountData.ProfessionalTitle);
      console.log('Timezone:', accountData.Timezone);

      // Initialize page objects
      const lpo = new LoginPageObject(page);
      const mapo = new MyAccountPageObject(page);

      // Step 1: Navigate and Login using credentials from ultimateAccount sheet
      await allure.step('Navigate to website and Login', async () => {
        await lpo.login(accountData.Username, accountData.Password);
      });

      // Step 2: Verify Login Success
      await allure.step('Verify Login Success', async () => {
        await lpo.verifyLoginSuccess();
      });

      // Step 3: Click Toggle Menu
      await allure.step('Click Toggle Menu', async () => {
        await lpo.clkToggleMenu();
      });

      // Step 4: Navigate to My Account
      await allure.step('Navigate to My Account', async () => {
        await mapo.navigateToMyAccount();
      });

      // Step 5: Update Account Details
      await allure.step('Update Account Details', async () => {
        await mapo.updateAccountDetails(
          accountData.Company,
          accountData.ProfessionalTitle,
          accountData.Timezone
        );
      });

      // Step 6: Verify Changes Saved
      await allure.step('Verify Changes Saved', async () => {
        await mapo.verifyChangesSaved();
      });

      // Step 7: Logout from Website
      await allure.step('Logout from Website', async () => {
        await lpo.logout();
      });
    });
  }
});
