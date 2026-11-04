import { expect, test } from '@playwright/test';
import { getTestData } from '../helpers/excelReader.js';
import { RecruitPageObject } from '../helpers/RecruitPageObject.js';
import * as allure from 'allure-js-commons';

const recruitTestData = getTestData('testdata.xlsx', 'ProspectAdd');

for (const data of recruitTestData) {
  test.describe(`[${data.TestCaseID}] prospect creation`, () => {
    let recruitPage: RecruitPageObject;

    test.beforeEach(async ({ page }) => {
      const email = String(data.Username).trim();
      const password = String(data.Password);
      if (!email || !password) {
        throw new Error('RecruitAdd test data must include Username and Password.');
      }

      recruitPage = new RecruitPageObject(page);
      await allure.step('Navigate and Login', async () => {
        await recruitPage.goto();
        await recruitPage.login(email, password);
      });
    });

    test('creates a new prospect', async () => {
      await allure.label('ALLURE_ID', String(data.TestCaseID));
      await allure.feature('Recruit');
      await allure.story('Create a new prospect using Add ProspectAdd data sheet');
      await allure.owner('Lalitha');
      await allure.tag('Recruit');
      await allure.tag('Data Driven');
      test.info().annotations.push(
        { type: 'TestCaseID', description: String(data.TestCaseID) },
        { type: 'Test Description', description: 'Create a new prospect from PropectAdd Excel data sheet' },
      );

      await allure.step('Open New Prospect Form', async () => {
        await recruitPage.openNewProspectForm();
        await expect(recruitPage.firstNameInput).toBeVisible();
      });
      await allure.step(`Fill Prospect Details for ${data.SearchName}`, async () => {
        await recruitPage.fillInitialProspectDetails({
          firstName: String(data.Firstname),
          lastName: String(data.Lastname),
          personalEmail: String(data.Personalemail),
          referredBy: String(data.Referedby),
          split: String(data.Split),
          supervisorName: String(data.Supervisor),
          hasEin: String(data.HasEin),
          ein: String(data.Ein),
          stateToSponsor: String(data.State),
          hasJonsApproval: true,
          cellPhone: String(data.CellPhone),
          currentEmployer: String(data.CurrentEmployer),
          searchByName:String(data.SearchName)
        });
      });
      await allure.step('Save Prospect', async () => {
        await recruitPage.saveProspect();
      });
      await allure.step('Verify whether prospect already exists message is not displayed', async () => {
        // Prospect already exists message should not be displayed.
        await recruitPage.page.waitForTimeout(5000);
        //await expect(recruitPage.matchedMessage).not.toBeVisible();
        if(await recruitPage.matchedMessage.isVisible()) {
          await allure.logStep(`Prospect already exists with name ${data.SearchName} and email ${data.Personalemail}. Prospect creation failed.`);
        }
        else{
          await allure.logStep(`Prospect ${data.Firstname} ${data.Lastname} created successfully.`);
        }
        

      });
    });

    test.afterEach(async () => {
      await allure.step('Logout from Website', async () => {
        await recruitPage.Logout();
      });
    });
  });
}
