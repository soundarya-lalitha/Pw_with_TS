// @ts-nocheck
import { expect } from '@playwright/test';

/**
 * Page Object for Google and Playwright Documentation
 * Handles interactions with:
 * - Google search page
 * - Playwright documentation site
 * - Trace Viewer feature
 */

export class GooglePageObject {
  constructor(page) {
    this.page = page;

    // Google Search page locators
    // Using getByRole (combobox role is explicitly defined in the textarea)
    this.searchInput = page.getByRole('combobox');
    
    // Playwright documentation locators
    // Using getByRole for link with accessible name "Get started"
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
    
    // Using getByRole with .first() to uniquely identify the first Trace Viewer link
    // The span elements have implicit link role and accessible name "Trace viewer"
    this.traceViewerLink = page.getByRole('link', { name: 'Trace viewer' }).first();
    
    // Same element as traceViewerLink, using the same semantic locator
    this.traceViewerLabel = page.getByRole('link', { name: 'Trace viewer' }).first();
  }

  /**
   * Navigate to Google home page
   */
  async navigateToGoogle() {
    await this.page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to Playwright documentation
   */
  async navigateToPlaywrightDocs() {
    await this.page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Search for a query on Google
   * @param {string} searchQuery - Search query to enter
   */
  async searchGoogle(searchQuery) {
    await this.searchInput.click();
    await this.searchInput.fill(searchQuery);
    await this.page.keyboard.press('Enter');
    // Wait for search results to load
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on a specific search result link
   * @param {string} url - URL or text of the link to click
   */
  async clickSearchResult(url) {
    // Click on the first result that matches the URL
    const link = this.page.locator(`a[href*="${url}"]`).first();
    await link.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the Get Started button on Playwright docs
   */
  async clickGetStartedButton() {
    await this.getStartedButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the Trace Viewer link on the left sidebar
   */
  async clickTraceViewerLink() {
    await this.traceViewerLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify that Trace Viewer label is visible on the page
   */
  async verifyTraceViewerLabelVisible() {
    await expect(this.traceViewerLabel).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Close the browser
   */
  async closeBrowser() {
    await this.page.context().browser().close();
  }

  /**
   * Complete end-to-end flow: navigate Google, search, click first result, verify Trace Viewer
   */
  async completeGooglePlaywrightFlow() {
    // Navigate to Google
    await this.navigateToGoogle();
    
    // Search for Playwright tutorial
    await this.searchGoogle('playwright tutorial');
    
    // Click on the first Playwright.dev link
    await this.clickSearchResult('playwright.dev');
    
    // Verify we're on Playwright docs
    await expect(this.page).toHaveTitle(/Playwright/i);
    
    // Click Get Started button
    await this.clickGetStartedButton();
    
    // Click Trace Viewer link
    await this.clickTraceViewerLink();
    
    // Verify Trace Viewer label appears
    await this.verifyTraceViewerLabelVisible();
  }
}
