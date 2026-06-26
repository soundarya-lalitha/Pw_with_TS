// tests/specs/analyticsReport.spec.js
import {test,expect } from '@playwright/test';
import { RepoPageObject } from '../helpers/RepoPageObject';
import { getTestData } from '../helpers/excelReader';
import { LoginPageObject } from '../helpers/LoginPageObject';
import  { allure } from 'allure-playwright';  



//Load test data from Excel
const analytTestData = getTestData('testdata.xlsx', 'AnalyticsReport');

test.describe('--- Login to Control Center and view Utilization Report ---', () => {

for (const data of analytTestData) {
 test(`[${data.TestCaseID}] ${data.TestDescription}`, async ({ page }) => {

    // ── Allure Metadata ──────────────────────────────────────────────
    await allure.label('ALLURE_ID', String(data.TestCaseID));
    await allure.label('severity', data.Severity ?? 'normal');
    await allure.label('epic', 'Analytics');
    await allure.label('feature', 'By State And Utilization Report');
    await allure.label(data.TestDescription);
    await allure.label('owner', 'Soundarya');
    console.log(data.EmployerName);
    await allure.description(`Validates the analytics report generation and download report for employer: ${data.EmployerName} by logging in as ${data.Username}`);

    test.info().annotations.push(
        { type: 'TestCaseID',      description: data.TestCaseID },
        { type: 'Test Description', description: data.TestDescription },
      );

    // ── Page Objects ─────────────────────────────────────────────────
    const lpo = new LoginPageObject(page);
    const apo = new RepoPageObject(page);

    // ── Step 1: Login and Navigate────────────────────────────────────────────────
    await allure.step(`Navigate and Login as ${data.Username}`, async () => {
      await lpo.login(data.Username, data.Password);
      await lpo.verifyLoginSuccess();
    });

    // ── Step 2: Navigate to Analytics Report ─────────────────────────
    await allure.step(`Navigate to By State And Utilization report`, async () => {
      await apo.navigateToByStateReport();
      await apo.verifyPageLoaded();
    });

    // ── Step 3: Search Employer ───────────────────────────────────────
    await allure.step(`Search for employer: "${data.EmployerSearch}"`, async () => {
      await apo.searchEmployer(data.EmployerSearch);
    });

    // ── Step 4: Select Employer ───────────────────────────────────────
    await allure.step(`Select employer: "${data.EmployerName}"`, async () => {
      await apo.selectEmployer(data.EmployerName);
      
    });

    // ── Step 5: Generate Report ───────────────────────────────────────
    await allure.step(`Click Generate Report button`, async () => {
      await apo.generateReport();
      await apo.verifyEmployerSelected(data.EmployerName);
      await apo.verifyReportGenerated();
    });

    // ── Step 6: Download Report ───────────────────────────────────────
    await allure.step(`Download Excel report`, async () => {
      const fileName = await apo.downloadReport();
      await allure.attachment('Downloaded File Name',Buffer.from(fileName),'text/plain');
    });

    // ── Step 7: Logout ────────────────────────────────────────────────
    await allure.step(`Logout from application`, async () => {
      await apo.logout();
      await apo.verifyLoggedOut();
    });
  });
}
});


