// @ts-nocheck

import { expect } from '@playwright/test'

import  os  from 'os';


export class RepoPageObject {
  
  constructor(page) {
    this.page = page;
    // Locators
    this.analyticsMenu = page.getByRole('button', { name: ' Analytics ' });
    this.byStateLink = page.locator('#analytics').getByRole('link', { name: 'By State And Utilization Of' });
    this.employerSearchInput = page.getByRole('textbox', { name: 'Type to search employer...' });
    this.checkEmpLoaded=page.locator('div.alert.alert-info.shadow-sm.mb-4'); //using class
    //this.checkEmpLoaded=page.locator('div.alert.alert-info');   
    this.generateReportButton = page.getByRole('button', { name: 'Generate Report' });
    this.downloadExcelLink = page.getByRole('link', { name: ' Download Excel' });
    this.logoutLink = page.getByRole('link', { name: ' Logout' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username or email' });
  }

  async navigateToByStateReport() {
    await this.analyticsMenu.click();
    await this.byStateLink.click();
  }

  async verifyPageLoaded() {
    await expect(this.employerSearchInput).toBeVisible();
  }

  async searchEmployer(searchText) {
    await this.employerSearchInput.click();
    await this.employerSearchInput.fill(searchText);
  }

  async selectEmployer(employerName) {
    await this.page.getByText(employerName).click();
  }

  /* async verifyEmployerSelected(employerName) {
    await expect(this.checkEmpLoaded.toContainText(employerName));       
  }
 */
   

async verifyEmployerSelected(employerName) {
  const selectedEmployerBadge = this.checkEmpLoaded.filter({ hasText: employerName }); 

  await expect(selectedEmployerBadge).toBeVisible();
} 

  async generateReport() {
    await this.generateReportButton.click();
  }

  async verifyReportGenerated() {
    await expect(this.downloadExcelLink).toBeVisible({ timeout: 15000 });
  }

  async downloadReport() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadExcelLink.click();
    const download = await downloadPromise;
    const fileName = download.suggestedFilename();

    const savePath = `${os.homedir()}\\Downloads\\${fileName}`;
       
    await download.saveAs(savePath);
    return savePath;
  }

  async logout() {
    await this.logoutLink.click();
  }

  async verifyLoggedOut() {
    await expect(this.usernameInput).toBeVisible();
  }
}