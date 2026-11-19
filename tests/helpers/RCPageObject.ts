import { expect, type Locator, type Page } from '@playwright/test';

export class RCPageObject {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly pipelineLink: Locator;
  readonly prospectStageButton: Locator;
  readonly recruitStageButton: Locator;
  readonly commitmentStageButton: Locator;
  readonly blockedStageButton: Locator;
  readonly tableViewButton: Locator;
  readonly prospectCategoryButton: Locator;
  readonly recruitCategoryButton: Locator;
  readonly commitmentCategoryButton: Locator;
  readonly a2pSponsorCategoryButton: Locator;
  readonly orientationCategoryButton: Locator;
  readonly startCategoryButton: Locator;
  readonly stagesButton: Locator;
  readonly blockersButton: Locator;
  readonly showDroppedButton: Locator;
   readonly hideDroppedButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.pipelineLink = page.getByRole('link', { name: 'Pipeline' });
    this.prospectStageButton = page.getByRole('button', { name: /^Prospect\b/ });
    this.recruitStageButton = page.getByRole('button', { name: /^Recruit\b/ });
    this.commitmentStageButton = page.getByRole('button', { name: /^Commitment\b/ });
    this.blockedStageButton = page.getByRole('button', { name: /^Blocked\b/ });
    this.tableViewButton = page.getByRole('button', { name: 'Table' });
    this.prospectCategoryButton = page.getByRole('button', { name: /^Prospect(?: \(\d+\))?$/ });
    this.recruitCategoryButton = page.getByRole('button', { name: /^Recruit(?: \(\d+\))?$/ });
    this.commitmentCategoryButton = page.getByRole('button', { name: /^Commitment(?: \(\d+\))?$/ });
    this.a2pSponsorCategoryButton = page.getByRole('button', { name: /^A2P\/Sponsor(?: \(\d+\))?$/ });
    this.orientationCategoryButton = page.getByRole('button', { name: /^Orientation(?: \(\d+\))?$/ });
    this.startCategoryButton = page.getByRole('button', { name: /^Start(?: \(\d+\))?$/ });
    this.stagesButton = page.getByRole('button', { name: 'Stages' });
    this.blockersButton = page.getByRole('button', { name: /^Blockers\s*(?: \(\d+\))?$/ });
    this.showDroppedButton = page.getByRole('button', { name: /^Show Dropped/ });
    this.hideDroppedButton= page.getByRole('button', { name: /^Hide Dropped/ });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.pipelineLink).toBeVisible();
  }

  async openPipeline(): Promise<void> {
    await this.pipelineLink.click();
    await expect(this.prospectStageButton).toBeVisible();
  }

  async reviewPipelineStages(): Promise<void> {
    for (const stageButton of [
      this.prospectStageButton,
      this.recruitStageButton,
      this.commitmentStageButton,
      this.blockedStageButton,
    ]) {
      await expect(stageButton).toBeVisible();
      await stageButton.click();
    }
  }

  async reviewTableCategories(): Promise<void> {
    await this.tableViewButton.click();
    for (const categoryButton of [
      this.prospectCategoryButton,
      this.recruitCategoryButton,
      this.commitmentCategoryButton,
      this.a2pSponsorCategoryButton,
      this.orientationCategoryButton,
      this.startCategoryButton,
    ]) {
      await expect(categoryButton).toBeVisible();
      await categoryButton.click();
    }
  }

  async reviewStageFilters(): Promise<void> {
    await this.stagesButton.click();
    await expect(this.blockersButton).toBeVisible();
    await this.blockersButton.click();
    await expect(this.showDroppedButton).toBeVisible();
    await this.showDroppedButton.click();
    await expect(this.hideDroppedButton).toBeVisible();
    await this.showDroppedButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.signInButton).toBeVisible();
  }
}
