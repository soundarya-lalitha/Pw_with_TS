import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://onboarding-dev-lumin.vercel.app/login');
  await page.getByRole('main').click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('rc_test@luminlending.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Lumin@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Pipeline' }).click();
  await page.getByRole('button', { name: 'Prospect 1 in talks — entered' }).click();
  await page.getByRole('button', { name: 'Recruit 11 invited, not yet' }).click();
  await page.getByRole('button', { name: 'Commitment 2 paid the fee' }).click();
  await page.getByRole('button', { name: 'Blocked 8 need someone to act' }).click();
  await page.getByRole('button', { name: 'Table' }).click();
  await page.getByRole('button', { name: 'Prospect (1)' }).click();
  await page.getByRole('button', { name: 'Recruit (11)' }).click();
  await page.getByRole('button', { name: 'Commitment (2)' }).click();
  await page.getByRole('button', { name: 'A2P/Sponsor (3)' }).click();
  await page.getByRole('button', { name: 'Orientation (3)' }).click();
  await page.getByRole('button', { name: 'Start (8)' }).click();
  await page.getByRole('button', { name: 'Stages' }).click();
  await page.getByRole('button', { name: 'Blockers8' }).click();
  await page.getByRole('button', { name: 'Show Dropped (2)' }).click();
  await page.getByRole('button', { name: 'Show Dropped (2)' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
});