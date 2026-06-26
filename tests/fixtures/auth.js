//const { test: base, expect } = require('@playwright/test');

import { test as base, expect } from '@playwright/test';
import { login } from '../helpers/loginHelper';

// Extend base test with pre-authenticated page
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // 1️⃣ Automatically logs in BEFORE your test runs
    await login(page, process.env.APP_USERNAME || 'myuser', 
                      process.env.APP_PASSWORD || 'mypassword');

    // 2️⃣ Waits until Logo is visible
   await expect(page.locator('[alt="Logo"]')).toBeVisible();

    // 3️⃣ Hands the logged-in page to your test
    await use(page);

    // 4️⃣ After test finishes, cleanup happens automatically
  },
});

export default { test, expect };

