// @ts-check
import { defineConfig, devices } from '@playwright/test';


// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();  // ✅ loads .env file

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 9_000 },
  fullyParallel: false,
  retries: 1,

  // ✅ Dual Reporter: HTML (built-in) + Allure (user-friendly)
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    
    ['list'], // live terminal output

    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',      // raw results go here
      suiteTitle: true,
    }],
  ],
  //['allure-playwright', { outputFolder: 'allure-results', detail: true }], ---use for allure report Lalitha
  use: {
    baseURL: process.env.APP_URL || 'https://courses.ultimateqa.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    browserName: 'chromium',
    headless: Boolean(process.env.CI),
  },

  projects: [
    {
      name: 'qa-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.APP_URL || 'https://courses.ultimateqa.com',
        browserName: 'chromium',
        headless: Boolean(process.env.CI),
      },
    },

    {
      name: 'qa-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.APP_URL || 'https://courses.ultimateqa.com',
        browserName: 'firefox',
        headless: Boolean(process.env.CI),
      },
    },

    {
      name: 'dev-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.APP_URL || 'https://courses.ultimateqa.com',
        browserName: 'chromium',
        headless: Boolean(process.env.CI),
      },
    },
  ],
  //
  outputDir: 'test-results/',
});
// usgae :npx playwright test --project=qa-chrome
//npx playwright test myaccount.spec.js --project=qa-chrome