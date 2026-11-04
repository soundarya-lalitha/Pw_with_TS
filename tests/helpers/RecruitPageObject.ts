import { expect, type Locator, type Page } from '@playwright/test';

export interface RecruitProspectDetails {
  firstName: string;
  lastName: string;
  personalEmail: string;
  referredBy: string;
  split: string;
  supervisorName: string;
  hasEin: string;
  ein: string;
  stateToSponsor: string;
  hasJonsApproval: boolean;
  cellPhone: string;
  currentEmployer: string;
  searchByName: string;
}

export interface ConvertRecruitDetails {
  searchByName: string;
  split: string;
  hasEin: string;
  ein: string;
  stateToSponsor: string;
}


export class RecruitPageObject {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly newProspectButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly personalEmailInput: Locator;
  readonly referredByInput: Locator;
  readonly splitSelect: Locator;
  readonly supervisorSelect: Locator;
  readonly hasEinSelect: Locator;
  readonly einInput: Locator;
  readonly statesToSponsorSelect: Locator;
  readonly jonsApprovalCheckbox: Locator;
  readonly cellPhoneInput: Locator;
  readonly currentEmployerInput: Locator;
  readonly saveProspectButton: Locator;
  readonly logoutButton: Locator;
  readonly matchedMessage: Locator;
  readonly searchByNameInput: Locator;
  readonly recruitStatus: Locator;
  readonly prospectStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.newProspectButton = page.getByRole('button', { name: 'New prospect' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.personalEmailInput = page.getByRole('textbox', { name: 'Personal Email *' });
    this.referredByInput = page.getByRole('textbox', { name: 'Referred By *' });
    this.splitSelect = page.getByLabel('Split');
    this.supervisorSelect = page.getByLabel('Supervisor Name');
    this.hasEinSelect = page.getByLabel('Has EIN?');
    this.einInput = page.getByRole('textbox', { name: 'EIN' });
    this.statesToSponsorSelect = page.getByLabel('States to Sponsor');
    this.jonsApprovalCheckbox = page.getByRole('checkbox', { name: "Has Jon's approval to join" });
    this.cellPhoneInput = page.getByRole('textbox', { name: 'Cell Phone *' });
    this.currentEmployerInput = page.getByRole('textbox', { name: 'Current Employer *' });
    this.saveProspectButton = page.getByRole('button', { name: 'Save Prospect' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.matchedMessage = page.getByText('Matched on email');
    this.searchByNameInput = this.page.getByRole('textbox', { name: 'Search by name' });
    this.recruitStatus = this.page.getByRole('table').getByText('Recruit');
    this.prospectStatus = this.page.getByRole('table').getByText('Prospect');
 
  }

  async goto(): Promise<void> {
    await this.page.goto('https://onboarding-dev-lumin.vercel.app/login', {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openNewProspectForm(): Promise<void> {
    await this.newProspectButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillInitialProspectDetails(prospect: RecruitProspectDetails): Promise<void> {
    await this.firstNameInput.fill(prospect.firstName);
    await this.lastNameInput.fill(prospect.lastName);
    await this.personalEmailInput.fill(prospect.personalEmail);
    await this.referredByInput.fill(prospect.referredBy);
    //enter only if split value is present in the test data sheet
    if (prospect.split !== null) {
      await this.splitSelect.selectOption(prospect.split);
    }
    await this.supervisorSelect.selectOption(prospect.supervisorName);
    //provide ein is yes and ein value only if hasEin is yes in the test data sheet
    if(prospect.hasEin.toLowerCase() == 'yes') {
      await this.hasEinSelect.selectOption(prospect.hasEin);
      await this.einInput.fill(prospect.ein);
    }
    //enter state only if state is not null in the sheet
    if(prospect.stateToSponsor !== null) {
      await this.statesToSponsorSelect.selectOption(prospect.stateToSponsor);
    }
    await this.cellPhoneInput.fill(prospect.cellPhone);
    await this.currentEmployerInput.fill(prospect.currentEmployer);
    await this.jonsApprovalCheckbox.check();
    
  }

  async saveProspect(): Promise<void> {
    await this.saveProspectButton.click();
  }

  

  async Logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async isProspectConvertedToRecruit(recruit: ConvertRecruitDetails): Promise<boolean> {
    await this.searchByNameInput.fill(recruit.searchByName);
    await this.page.waitForTimeout(8000);
    return await this.recruitStatus.isVisible();
    
  }


  async isProspectCreated(prospect: RecruitProspectDetails): Promise<boolean> {
    await this.searchByNameInput.fill(prospect.searchByName);
    await this.page.waitForTimeout(8000);
    return await this.prospectStatus.isVisible();
    
  }

  async ConverToRecruit(recruit: ConvertRecruitDetails): Promise<void> {
    
      await this.page.getByText('finish & convert →').click();      
        await this.splitSelect.selectOption(recruit.split);    
        await this.hasEinSelect.selectOption(recruit.hasEin);       
        await this.einInput.fill(recruit.ein); 
        await this.statesToSponsorSelect.selectOption(recruit.stateToSponsor);
        await this.page.waitForTimeout(5000);
        await this.page.getByRole('button', { name: 'Convert to Recruit' }).click();
        await this.page.waitForTimeout(5000);
        await this.searchByNameInput.fill(recruit.searchByName);      

    await expect(this.recruitStatus).toBeVisible();
  }
}