import { expect, test } from '@playwright/test';
import { getTestData } from '../helpers/excelReader.js';
import { RCPageObject } from '../helpers/RCPageObject.js';
import * as allure from 'allure-js-commons';

const rcTestData = getTestData('testdata.xlsx', 'RC');

for (const data of rcTestData) {
  test.describe(`[${data.TestCaseID}] pipeline review`, () => {
    let rcPage: RCPageObject;

    test.beforeEach(async ({ page }) => {
      const email = String(data.Username).trim();
      const password = String(data.Password);
      if (!email || !password) {
        throw new Error('RC test data must include Username and Password.');
      }

      rcPage = new RCPageObject(page);
      await allure.step('Navigate and Login', async () => {
        await rcPage.goto();
        await rcPage.login(email, password);
      });
    });

    // Verifies the pipeline stages, table categories, and stage filters are accessible.
    test('reviews pipeline stages and table filters', async () => {
      await allure.label('ALLURE_ID', String(data.TestCaseID));
      await allure.feature('Recruitment Pipeline');
      await allure.story('Review pipeline stages and table filters');
      await allure.owner('Lalitha');
      await allure.tag('Recruitment Pipeline');
      await allure.tag('Data Driven');
      test.info().annotations.push(
        { type: 'TestCaseID', description: String(data.TestCaseID) },
        { type: 'Test Description', description: 'Review pipeline stages and table filters' },
      );

      await allure.step('Open Pipeline', async () => {
        await rcPage.openPipeline();
        await expect(rcPage.prospectStageButton).toBeVisible();
      });
      await allure.step('Review Pipeline Stages', async () => {
        await rcPage.reviewPipelineStages();
      });
      await allure.step('Review Table Categories', async () => {
        await rcPage.reviewTableCategories();
        await expect(rcPage.startCategoryButton).toBeVisible();
      });
      await allure.step('Review Stage Filters', async () => {
        await rcPage.reviewStageFilters();
        await expect(rcPage.logoutButton).toBeVisible();
      });
    });

    test.afterEach(async () => {
      await allure.step('Logout from Website', async () => {
        await rcPage.logout();
      });
    });
  });
}
