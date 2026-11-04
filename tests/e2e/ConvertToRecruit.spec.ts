import { expect, test } from '@playwright/test';
import { getTestData } from '../helpers/excelReader.js';
import { RecruitPageObject } from '../helpers/RecruitPageObject.js';
import * as allure from 'allure-js-commons';

const conversionTestData = getTestData('testdata.xlsx', 'Convert');

for (const data of conversionTestData) {

  test.describe(`[${data.TestCaseID}] prospect conversion`, () => {
    let recruitPage: RecruitPageObject;

    test.beforeEach(async ({ page }) => {
      const email = String(data.Username).trim();
      const password = String(data.Password);
      if (!email || !password) {
        throw new Error('Convert test data must include Username and Password.');
      }

      recruitPage = new RecruitPageObject(page);
      await allure.step('Navigate and Login', async () => {
        await recruitPage.goto();
        await recruitPage.login(email, password);
      });
    });

    // Verifies the prospect is already converted to Recruit
    test('converts a prospect to a recruit:', async () => {
      await allure.label('ALLURE_ID', String(data.TestCaseID));
      await allure.feature('Recruit');
      await allure.story('Convert a prospect to a recruit using Convert sheet data');
      await allure.owner('Lalitha');
      await allure.tag('Recruit');
      await allure.tag('Data Driven');
      await allure.logStep(`TestCaseID: ${String(data.TestCaseID)}`);
      await allure.logStep('Test Description: Convert a prospect to a recruit');

      const prospect = {
        searchByName: String(data.SearchByName).trim(),
        split: String(data.Split).trim(),
        hasEin: String(data.HasEin).trim(),
        ein: String(data.Ein).trim(),
        stateToSponsor: String(data.State).trim(),
      };

      let isAlreadyRecruit = false;
      await allure.step(`Check whether prospect ${prospect.searchByName} is already a Recruit`, async () => {
        isAlreadyRecruit = await recruitPage.isProspectConvertedToRecruit(prospect);

        if (isAlreadyRecruit) {
          await allure.logStep(`The prospect ${prospect.searchByName}  is already converted to Recruit. No need to convert again.`);
        }
        else{
          await allure.logStep(`The prospect ${prospect.searchByName} is not yet converted to Recruit.`);
        }
      });

      if (!isAlreadyRecruit) {
      await allure.step('Convert prospect to Recruit', async () => {
        await recruitPage.ConverToRecruit(prospect);

        await allure.step('Verify prospect is listed as Recruit in the pipeline', async () => {
              await expect(recruitPage.isProspectConvertedToRecruit(prospect)).resolves.toBe(true);
              await allure.logStep(`Success: The prospect ${prospect.searchByName} is now converted to Recruit.`);
          });
          
        });
      }

     
    });

    test.afterEach(async () => {
      await allure.step('Logout from Website', async () => {
        await recruitPage.Logout();
      });
    });
  });
}
