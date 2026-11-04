
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();  // ✅ loads .env file

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 9_000 },
  fullyParallel: false,
  retries: 0,
  globalSetup: './global-setup.ts',
  //this is for the api test leadhouse csv always saves old data if failures in between -Lalitha
  // //above line is used to set up the global setup file for playwright test. This file is executed before any tests are run and can be used to perform any necessary setup tasks, such as logging in or setting up test data. The path to the global setup file is specified relative to the root of the project. In this case, the global setup file is located in the root directory of the project and is named global-setup.ts.
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
    baseURL: process.env.APP_URL || 'https://onboarding-dev-lumin.vercel.app',
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'retain-on-failure',
    browserName: 'chromium',
    headless: Boolean(process.env.CI),
  },

  projects: [
    
    /* never used firefox
    {
      name: 'qa-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.APP_URL || 'https://onboarding-dev-lumin.vercel.app',
        browserName: 'firefox',
        headless: Boolean(process.env.CI),
      },
    },
 */
    {
      name: 'chrome',
      use: 
      { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.APP_URL || 'https://onboarding-dev-lumin.vercel.app',
        browserName: 'chromium',
        headless: Boolean(process.env.CI),
      },
    },


    /*API project currently not used -Lalitha
     {
      name: 'APILead',
      use: 
      { 
       baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY ?? ''
        }
      },
    }, */
  ],
  //
  outputDir: 'test-results/',
});
// usgae :npx playwright test --project=qa-chrome
//npx playwright test myaccount.spec.js --project=qa-chrome
//TEST_ENV=qa npx playwright test --project=chrome ---implement this now--good
//"test:qa:chrome": "cross-env TEST_ENV=qa playwright test --project=chrome"
//this line should be under scripts in package.json to run scripts for 
// multiple environments with different browsers.

//npx playwright test FirstAPI.spec.ts --project=APILead

//npx playwright test tests/e2e/Prospect.spec.ts --project=chrome
//npx playwright test tests/e2e/ConvertToRecruit.spec.ts --project=chrome
// for allure report - npm run report:generate  and to open-- npm run report:open

