

import { expect, type Page, type Locator } from '@playwright/test';
/**
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 * @param {string} signIn
 * @param {string} togglemenu
 * 
 */

export class LoginPageObject
{
      readonly page: Page;
        readonly signInLink: Locator;
        readonly username: Locator;
        readonly password: Locator;
        readonly signinButton: Locator;
        readonly togglemenu: Locator;
        readonly dashboardLink: Locator;
        readonly signoutLink: Locator;

      constructor(page : Page)
      {
            this.page=page;
            //locators in POM are seperated from actual code     
             this.signInLink=page.getByRole('link', { name: 'Sign In'}); 
            this.username = page.getByRole('textbox',{name:'Email'});
            this.password = page.getByRole('textbox',{name:'Password'});           
            // use if not clicing this.signInLink=page.getByRole('link', { name: 'Sign In', exact: false });
            this.signinButton = page.getByRole('button', { name: 'Sign in',exact:false });
            //this.signinButton = page.getByRole('button', { name: /Sign in/ });
            //this.signinButton = page.locator('button.button-primary');
            this.togglemenu =  page.getByRole('button', { name: 'Toggle menu' });
            this.dashboardLink=page.getByRole('link', { name: 'My Dashboard' });
            this.signoutLink=page.getByRole('link', { name: 'Sign Out' });
      }


       

      //Method to load the login url and verify page title
      async goto() 
      {
            //await this.page.goto('/');
            await this.page.goto('/', { waitUntil: 'domcontentloaded' });
            await expect(this.page).toHaveTitle(/UltimateQA/);
      }

      //Method to click sign in Link
      async clkSignInLink()
      {
            await this.signInLink.click();
      }      
    
      //Method to fill username
      async fillUsername(username:string) 
      {
            
            await this.username.fill(username);
      }
      //Method to fill password
      async fillPassword(password:string)
      {
            
            await this.password.fill(password);
      }

      //Method to click sign in Button
      async clkSignInButton()
      {
            await this.signinButton.click();
      }      
      
      //Method to click Toggle Menu
      async clkToggleMenu()
      {
            await this.togglemenu.click();
      } 

      //Method to load url,fill username and password and click on signin button
      async login(username:string,password:string) 
      {
            //await this.goto();
            await this.page.goto('/', { waitUntil: 'domcontentloaded' });
            //await this.page.waitForTimeout(300000);
            await this.signInLink.click();
            await this.username.fill(username);
            await this.password.fill(password);
            await this.signinButton.click();
            
            
      }
      //method to click signout link after clicking on toggle menu
      async logout() 
      {
            await this.togglemenu.click();
             await this.signoutLink.click();
      }
      //Method to verify login is successfull
      async verifyLoginSuccess() 
      {
            await expect(this.dashboardLink).toBeVisible({ timeout: 10_000 });
            console.log("Successfully logged into---------");
      }
      //method ot Verify whether login failed
      async verifyLoginFailed() 
      {
            await expect(this.signInLink).toBeVisible({ timeout: 10_000 });
      }

}