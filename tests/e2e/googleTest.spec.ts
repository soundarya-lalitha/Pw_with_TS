// tests/e2e/googleTest.js
// ─────────────────────────────────────────────────────────────────
// Google Search and Playwright Documentation Navigation Test
// Purpose: Automate navigation from Google to Playwright docs
// Test Flow:
//   1. Navigate to google.com
//   2. Search for "playwright tutorial"
//   3. Click on first Playwright.dev link
//   4. Click Get Started button
//   5. Click Trace Viewer link
//   6. Verify Trace Viewer label appears
//   7. Close browser
// ─────────────────────────────────────────────────────────────────

/**
 * Test Suite: Google Navigation to Playwright Documentation
 * Framework: Playwright + JavaScript
 * Pattern: Page Object Model
 */

import {test,expect } from '@playwright/test';
import { GooglePageObject } from '../helpers/GooglePageObject.js';
import * as allure from 'allure-js-commons';

test.describe('--- Google Search and Playwright Navigation Test ---', () => {
  
  test('TC001: Navigate from Google to Playwright Docs and Verify Trace Viewer', async ({ page }) => {
    
    // Allure reporting annotations
    await allure.label('ALLURE_ID', 'TC001');
    await allure.feature('Google Navigation');
    await allure.story('Search for Playwright and navigate to documentation');
    await allure.owner('QA Team');
    await allure.tag('Google Script');
    test.info().annotations.push(
      { type: 'TestCaseID', description: 'TC001' },
      { type: 'Test Description', description: 'Navigate from Google to Playwright Trace Viewer' },
    );

    // Initialize Page Object
    const gpo = new GooglePageObject(page);

    // Step 1: Navigate to Google
    await allure.step('Navigate to Google Home', async () => {
      await gpo.navigateToGoogle();
      await expect(page).toHaveTitle(/Google/);
      console.log('✓ Successfully navigated to Google');
    });

    // Step 2: Search for "playwright tutorial"
    await allure.step('Search for Playwright Tutorial', async () => {
      await gpo.searchGoogle('playwright tutorial');
      console.log('✓ Searched for "playwright tutorial"');
    });

    // Step 3: Click on the first Playwright.dev link
    await allure.step('Click Playwright.dev Link', async () => {
      await gpo.clickSearchResult('playwright.dev');
      await expect(page).toHaveTitle(/Playwright/i);
      console.log('✓ Clicked on Playwright.dev link from search results');
    });

    // Step 4: Click Get Started button
    await allure.step('Click Get Started Button', async () => {
      await gpo.clickGetStartedButton();
      console.log('✓ Clicked Get Started button');
    });

    // Step 5: Click Trace Viewer link in sidebar
    await allure.step('Click Trace Viewer Link', async () => {
      await gpo.clickTraceViewerLink();
      console.log('✓ Clicked Trace Viewer link');
    });

    // Step 6: Verify Trace Viewer label appears
    await allure.step('Verify Trace Viewer Label Appears', async () => {
      await gpo.verifyTraceViewerLabelVisible();
      console.log('✓ Trace Viewer label is visible on the page');
    });

    // Step 7: Close browser
    await allure.step('Close Browser', async () => {
      /* const browser = page.context().browser();
      if (browser) await browser.close(); */
      await gpo.closeBrowser();
      console.log('✓ Browser closed successfully');
    });

  });

  test('TC002: Alternative - Complete Flow Using Helper Method', async ({ page }) => {
    
    // Allure reporting annotations
    await allure.label('ALLURE_ID', 'TC002');
    await allure.feature('Google Navigation');
    await allure.story('Complete flow using helper method');
    await allure.owner('QA Team');
    await allure.tag('Google');

    test.info().annotations.push(
      { type: 'TestCaseID', description: 'TC002' },
      { type: 'Test Description', description: 'Complete Google to Playwright flow using helper method' },
    );

    // Initialize Page Object
    const gpo = new GooglePageObject(page);

    // Execute complete flow
    await allure.step('Execute Complete Google to Playwright Flow', async () => {
      await gpo.completeGooglePlaywrightFlow();
      console.log('✓ Completed full navigation flow successfully');
    });

    // Close browser
    await allure.step('Close Browser', async () => {
      const browser = page.context().browser();
      if (browser) await browser.close();
      console.log('✓ Browser closed successfully');
    });

  });

});
