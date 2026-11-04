// tests/e2e/login.spec.js
// ─────────────────────────────────────────────────────────────────
// Data-driven login tests — all inputs come from Excel
// Excel Sheet: "LoginTests"
// Columns: TestCaseID | TestDescription | Username | Password | ExpectedResult | Execute
// ─────────────────────────────────────────────────────────────────

/**
 * Feature: User Login
 * Application:  https://courses.ultimateqa.com/
 * Framework: Playwright + JavaScript
 * Pattern: Page Object Model
 * Coverage areas: happy path, validation errors, session handling
 */

import { test, expect } from '@playwright/test';
import { getTestData } from '../helpers/excelReader.js';
import { LoginPageObject } from '../helpers/LoginPageObject.js';
import  * as allure from 'allure-js-commons'; 

//https://practicetestautomation.com/practice-test-login/
//https://ultimateqa.com/filling-out-forms/
//https://courses.ultimateqa.com/collections

// Load test data from Excel
const loginTestData = getTestData('testdata.xlsx', 'LoginUltimateQA')
  //.filter(row => String(row.Execute).trim().toUpperCase() === 'Y');


test.describe('--- Login to Practice Test Automation Website ---', () => {

  for (const data of loginTestData) {
    test(`[${data.TestCaseID}] ${data.TestDescription}`, async ({ page }) => {

      //Allure parameters
      await allure.label('ALLURE_ID', String(data.TestCaseID));
      await allure.feature('Login');                           // groups by feature in report
      await allure.story(data.TestDescription);                // user story label
      await allure.owner('Lalitha');                           // team/person responsible
      await allure.tag('Login');        // filterable tags
      await allure.tag('Data Driven');
      await allure.parameter('Username', data.Username);  

      test.info().annotations.push(
        { type: 'TestCaseID',      description: data.TestCaseID },
        { type: 'Test Description', description: data.ExpectedResult },
      );

      console.log("username ",data.Username);
      console.log("password ",data.Password);

      const lpo = new LoginPageObject(page); 
      const expectedResult = String(data.ExpectedResult).trim().toUpperCase();
/* 
      if (expectedResult === 'PASS') { // condition based test run driven from test-data Lalitha
        await lpo.login(data.Username, data.Password);
        await lpo.assertLoginSuccess();
        await lpo.logout();
      } else {
        await lpo.login(data.Username, data.Password);
        await lpo.assertLoginFailure();
      } */

        // method to navigate to the url and login with username and password
        await allure.step('Navigate and Login', async () => {
             await lpo.login(data.Username, data.Password);
        });
        
         // method to verify whether login is successful
        await allure.step('Verify Login Failure', async () => {
            await lpo.verifyLoginSuccess();
        });
        
        //method to logout
        await allure.step('Logout from Website',async () => {
        await lpo.logout();
        });
        
        
    });
  }

});