sample automation test case generation prompt

I have automated the login page of this below website https://courses.ultimateqa.com/account (login.spect.ts)
the corresponding page obeject is LoginPageObject.js
Generate a complete Playwright test covering:
Login to this website(use existing LoginPageObject.js)
click on the toggle menu on the right hand side.
click on the My Account link.
select company as Employee Loan Solutions
Select Professional title as Ms.
Select timezone as Hongkong and save changes
Logout from the wbesite((use existing LoginPageObject.js))
The data must be input from the exising excel sheet testdata.xlsx (presnet in D:\playwright\test-data) from the new tab ultimateAccount 
Use the login details of the sheet LoginUltimateQA  
Use the same structure and locator style as my existing file.